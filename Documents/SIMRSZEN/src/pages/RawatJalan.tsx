import { postApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { Search, Filter, Stethoscope, Clock, CheckCircle, Users, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PoliStats {
  department_id: string;
  department_name: string;
  doctor_name: string;
  total: number;
  served: number;
  waiting: number;
  in_progress: number;
}

interface CurrentPatient {
  id: string;
  visit_id: string;
  patient_name: string;
  medical_record_number: string;
  department_name: string;
  doctor_name: string;
  status: string;
  check_in_time: string;
  chief_complaint: string | null;
}

interface QueuePatient {
  id: string;
  queue_number: number;
  patient_name: string;
  medical_record_number: string;
  doctor_name: string;
  status: string;
  check_in_time: string;
}

export default function RawatJalan() {
  const [loading, setLoading] = useState(true);
  const [poliStats, setPoliStats] = useState<PoliStats[]>([]);
  const [currentPatients, setCurrentPatients] = useState<CurrentPatient[]>([]);
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [stats, setStats] = useState({ activePoli: 0, totalQueue: 0, served: 0, waiting: 0 });
  
  // Medical Record Dialog
  const [medicalRecordOpen, setMedicalRecordOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<CurrentPatient | null>(null);
  const [medicalForm, setMedicalForm] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    temperature: "",
    respiratory_rate: "",
    weight: "",
    height: "",
  });
  const [savingRecord, setSavingRecord] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDepartments(),
        fetchPoliStats(),
        fetchCurrentPatients(),
        fetchQueuePatients(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await postApi<{ id: string; name: string }[]>("/unsafe-query", {
        query: `SELECT id, name FROM departments ORDER BY name`
      });
      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Gagal memuat daftar poli");
    }
  };

  const fetchPoliStats = async () => {
    try {
      const data = await postApi<PoliStats[]>("/unsafe-query", {
        query: `
          SELECT 
            d.id as department_id,
            d.name as department_name,
            'Umum' as doctor_name,
            COUNT(v.id)::int as total,
            COUNT(CASE WHEN v.status = 'selesai' THEN 1 END)::int as served,
            COUNT(CASE WHEN v.status = 'menunggu' THEN 1 END)::int as waiting,
            COUNT(CASE WHEN v.status IN ('dipanggil', 'diperiksa') THEN 1 END)::int as in_progress
          FROM departments d
          LEFT JOIN visits v ON d.id = v."departmentId" AND DATE(v."createdAt") = CURRENT_DATE
          GROUP BY d.id, d.name
          ORDER BY d.name`
      });
      setPoliStats(data || []);

      const overallStats = (data || []).reduce(
        (acc, curr) => {
          acc.activePoli += 1;
          acc.totalQueue += (curr.waiting || 0) + (curr.in_progress || 0);
          acc.served += (curr.served || 0);
          acc.waiting += (curr.waiting || 0);
          return acc;
        },
        { activePoli: 0, totalQueue: 0, served: 0, waiting: 0 }
      );
      setStats(overallStats);
    } catch (error) {
      console.error("Error fetching poli stats:", error);
      toast.error("Gagal memuat statistik poli");
    }
  };

  const fetchCurrentPatients = async () => {
    try {
      const data = await postApi<CurrentPatient[]>("/unsafe-query", {
        query: `
          SELECT 
            v.id,
            v.id as visit_id,
            v."queueNumber" as queue_number,
            p.name as patient_name,
            p."medicalRecordNumber" as medical_record_number,
            d.name as department_name,
            COALESCE(dr."fullName", 'Umum') as doctor_name,
            v.status,
            TO_CHAR(v."createdAt", 'HH24:MI') as check_in_time,
            v.complaint as chief_complaint
          FROM visits v
          JOIN patients p ON v."patientId" = p.id
          LEFT JOIN departments d ON v."departmentId" = d.id
          LEFT JOIN doctors dr ON v."doctorId" = dr.id
          WHERE DATE(v."createdAt") = CURRENT_DATE
            AND v.status IN ('dipanggil', 'dilayani')
          ORDER BY v."createdAt" DESC
          LIMIT 20`
      });
      setCurrentPatients(data || []);
    } catch (error) {
      console.error("Error fetching current patients:", error);
      toast.error("Gagal memuat daftar pasien saat ini");
    }
  };

  const fetchQueuePatients = async () => {
    try {
      const data = await postApi<QueuePatient[]>("/unsafe-query", {
        query: `
          SELECT 
            v.id,
            v."queueNumber" as queue_number,
            p.name as patient_name,
            p."medicalRecordNumber" as medical_record_number,
            COALESCE(dr."fullName", 'Umum') as doctor_name,
            v.status,
            TO_CHAR(v."createdAt", 'HH24:MI') as check_in_time
          FROM visits v
          JOIN patients p ON v."patientId" = p.id
          LEFT JOIN doctors dr ON v."doctorId" = dr.id
          WHERE DATE(v."createdAt") = CURRENT_DATE
            AND v.status = 'menunggu'
          ORDER BY v."queueNumber"
          LIMIT 20`
      });
      setQueuePatients(data || []);
    } catch (error) {
      console.error("Error fetching queue patients:", error);
      toast.error("Gagal memuat daftar antrian");
    }
  };

  const handleStartExamination = async (patient: CurrentPatient) => {
    try {
      await postApi("/unsafe-query", {
        query: `UPDATE visits SET status = 'diperiksa' WHERE id = '${patient.visit_id}'`
      });
      
      setSelectedVisit(patient);
      setMedicalRecordOpen(true);
      fetchData();
    } catch (error) {
      console.error("Error updating visit status:", error);
      toast.error("Gagal memulai pemeriksaan");
    }
  };

  const handleSaveMedicalRecord = async () => {
    if (!selectedVisit) return;

    setSavingRecord(true);
    try {
      // Save medical record as JSON in visit complaint field (simplified)
      const soapNote = `S: ${medicalForm.subjective}\nO: ${medicalForm.objective}\nA: ${medicalForm.assessment}\nP: ${medicalForm.plan}`;
      
      await postApi("/unsafe-query", {
        query: `UPDATE visits SET status = 'selesai', complaint = '${soapNote.replace(/'/g, "''")}' WHERE id = '${selectedVisit.visit_id}'`
      });

      toast.success("Rekam medis berhasil disimpan");
      setMedicalRecordOpen(false);
      setSelectedVisit(null);
      setMedicalForm({
        subjective: "", objective: "", assessment: "", plan: "",
        blood_pressure_systolic: "", blood_pressure_diastolic: "",
        heart_rate: "", temperature: "", respiratory_rate: "",
        weight: "", height: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast.error("Gagal menyimpan rekam medis");
    } finally {
      setSavingRecord(false);
    }
  };

  const filteredCurrentPatients = currentPatients.filter(patient => {
    const matchesSearch = 
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medical_record_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === "all" || 
      patient.department_name === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const filteredQueuePatients = queuePatients.filter(patient => {
    const matchesSearch = 
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medical_record_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "dipanggil": return "Dipanggil";
      case "diperiksa": return "Pemeriksaan";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rawat Jalan</h1>
          <p className="text-muted-foreground">Manajemen pelayanan rawat jalan</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.activePoli}</p>
            <p className="text-sm text-muted-foreground">Poliklinik Aktif</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalQueue}</p>
            <p className="text-sm text-muted-foreground">Total Antrian</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.served}</p>
            <p className="text-sm text-muted-foreground">Sudah Dilayani</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-info/10">
            <Users className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.waiting}</p>
            <p className="text-sm text-muted-foreground">Menunggu</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview Poli</TabsTrigger>
          <TabsTrigger value="current">Pasien Sedang Dilayani</TabsTrigger>
          <TabsTrigger value="queue">Antrian</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
          ) : poliStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada kunjungan rawat jalan hari ini
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {poliStats.map((poli) => (
                <div key={poli.department_id} className="module-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{poli.department_name}</h4>
                    <Badge
                      variant="outline"
                      className={
                        poli.waiting > 0 || poli.in_progress > 0
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {poli.waiting > 0 || poli.in_progress > 0 ? "Aktif" : "Selesai"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{poli.doctor_name}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{poli.served}/{poli.total}</span>
                    </div>
                    <Progress value={poli.total > 0 ? (poli.served / poli.total) * 100 : 0} className="h-2" />
                  </div>
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-success">{poli.served}</p>
                      <p className="text-xs text-muted-foreground">Selesai</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-info">{poli.in_progress}</p>
                      <p className="text-xs text-muted-foreground">Diperiksa</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-warning">{poli.waiting}</p>
                      <p className="text-xs text-muted-foreground">Menunggu</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="current">
          <div className="module-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Pasien Sedang Dilayani</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pasien..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
            ) : filteredCurrentPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada pasien yang sedang dilayani
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCurrentPatients.map((patient) => (
                  <div
                    key={patient.visit_id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.patient_name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.patient_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.department_name} - {patient.doctor_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{patient.medical_record_number}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={
                          patient.status === "diperiksa"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-info/10 text-info border-info/20"
                        }
                      >
                        {getStatusLabel(patient.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground">Sejak {formatTime(patient.check_in_time)}</p>
                      {patient.status === "dipanggil" && (
                        <Button size="sm" onClick={() => handleStartExamination(patient)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Mulai Periksa
                        </Button>
                      )}
                      {patient.status === "diperiksa" && (
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedVisit(patient);
                          setMedicalRecordOpen(true);
                        }}>
                          <FileText className="h-4 w-4 mr-1" />
                          Input Rekam Medis
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="queue">
          <div className="module-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Antrian per Poliklinik</h3>
              <div className="flex items-center gap-2">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter Poli" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Poli</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
            ) : queuePatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada antrian menunggu
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No. Antrian</th>
                      <th>No. RM</th>
                      <th>Nama Pasien</th>
                      <th>Dokter</th>
                      <th>Waktu Daftar</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueuePatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <Badge variant="outline" className="font-mono">
                            {patient.queue_number.toString().padStart(3, "0")}
                          </Badge>
                        </td>
                        <td className="font-mono text-sm">{patient.medical_record_number}</td>
                        <td className="font-medium">{patient.patient_name}</td>
                        <td>{patient.doctor_name}</td>
                        <td>{formatTime(patient.check_in_time)}</td>
                        <td>
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            Menunggu
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Medical Record Dialog */}
      <Dialog open={medicalRecordOpen} onOpenChange={setMedicalRecordOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Input Rekam Medis</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
          {selectedVisit && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nama Pasien:</span>
                    <p className="font-medium">{selectedVisit.patient_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">No. Rekam Medis:</span>
                    <p className="font-medium">{selectedVisit.medical_record_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Poli:</span>
                    <p className="font-medium">{selectedVisit.department_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dokter:</span>
                    <p className="font-medium">{selectedVisit.doctor_name}</p>
                  </div>
                  {selectedVisit.chief_complaint && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Keluhan:</span>
                      <p className="font-medium">{selectedVisit.chief_complaint}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h4 className="font-semibold mb-3">Tanda Vital</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>TD Sistolik (mmHg)</Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={medicalForm.blood_pressure_systolic}
                      onChange={(e) => setMedicalForm({ ...medicalForm, blood_pressure_systolic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TD Diastolik (mmHg)</Label>
                    <Input
                      type="number"
                      placeholder="80"
                      value={medicalForm.blood_pressure_diastolic}
                      onChange={(e) => setMedicalForm({ ...medicalForm, blood_pressure_diastolic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nadi (x/menit)</Label>
                    <Input
                      type="number"
                      placeholder="80"
                      value={medicalForm.heart_rate}
                      onChange={(e) => setMedicalForm({ ...medicalForm, heart_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Suhu (°C)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={medicalForm.temperature}
                      onChange={(e) => setMedicalForm({ ...medicalForm, temperature: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pernapasan (x/menit)</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={medicalForm.respiratory_rate}
                      onChange={(e) => setMedicalForm({ ...medicalForm, respiratory_rate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Berat Badan (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="60"
                      value={medicalForm.weight}
                      onChange={(e) => setMedicalForm({ ...medicalForm, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tinggi Badan (cm)</Label>
                    <Input
                      type="number"
                      placeholder="170"
                      value={medicalForm.height}
                      onChange={(e) => setMedicalForm({ ...medicalForm, height: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subjective (Keluhan Pasien)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Keluhan utama dan riwayat penyakit..."
                    value={medicalForm.subjective}
                    onChange={(e) => setMedicalForm({ ...medicalForm, subjective: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Objective (Pemeriksaan Fisik)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Hasil pemeriksaan fisik..."
                    value={medicalForm.objective}
                    onChange={(e) => setMedicalForm({ ...medicalForm, objective: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assessment (Diagnosis)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Diagnosis kerja..."
                    value={medicalForm.assessment}
                    onChange={(e) => setMedicalForm({ ...medicalForm, assessment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plan (Rencana Tindakan)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Rencana terapi dan tindak lanjut..."
                    value={medicalForm.plan}
                    onChange={(e) => setMedicalForm({ ...medicalForm, plan: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMedicalRecordOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveMedicalRecord} disabled={savingRecord}>
              {savingRecord ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Rekam Medis"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

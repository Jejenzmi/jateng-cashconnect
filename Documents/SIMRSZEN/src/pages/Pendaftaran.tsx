import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { Search, UserPlus, Calendar, Clock, Filter, Loader2, Phone, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { PatientFormFields } from "@/components/forms/PatientFormFields";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

interface Patient {
  id: string;
  medical_record_number: string;
  nik: string;
  full_name: string;
  gender: "L" | "P";
  birth_date: string;
  phone: string | null;
  bpjs_number: string | null;
}

interface Visit {
  id: string;
  visit_number: string;
  queue_number: number | null;
  visit_time: string;
  status: string;
  payment_type: string;
  patient: Patient;
  department: { name: string } | null;
  doctor: { full_name: string } | null;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string | null;
  department_id: string | null;
}

interface QueueStats {
  total: number;
  served: number;
  waiting: number;
  newPatients: number;
}

export default function Pendaftaran() {
  const { toast } = useToast();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<QueueStats>({ total: 0, served: 0, waiting: 0, newPatients: 0 });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("existing");

  // Confirmation dialogs
  const [registerConfirmOpen, setRegisterConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [visitToCancel, setVisitToCancel] = useState<Visit | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Search results for existing patient
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Registration form
  const [formData, setFormData] = useState({
    department_id: "",
    doctor_id: "",
    payment_type: "" as "bpjs" | "umum" | "asuransi" | "",
    chief_complaint: "",
  });

  // New patient form - using standardized form data
  const [newPatientData, setNewPatientData] = useState({
    nik: "",
    full_name: "",
    birth_date: "",
    birth_place: "",
    gender: "" as "L" | "P" | "",
    blood_type: "",
    religion: "",
    marital_status: "",
    education_level: "",
    occupation: "",
    nationality: "Indonesia",
    mother_name: "",
    phone: "",
    email: "",
    address: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    city: "",
    province: "",
    postal_code: "",
    bpjs_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    allergy_notes: "",
  });

  useEffect(() => {
    fetchVisits();
    fetchDepartments();
    fetchDoctors();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    try {
      const totalResult = await postApi<{ count: string }[]>("/unsafe-query", {
        query: `SELECT COUNT(*) as count FROM visits WHERE DATE("createdAt") = '${today}'`
      });
      const total = parseInt(totalResult[0]?.count || '0');

      const servedResult = await postApi<{ count: string }[]>("/unsafe-query", {
        query: `SELECT COUNT(*) as count FROM visits WHERE DATE("createdAt") = '${today}' AND status IN ('selesai', 'dilayani')`
      });
      const served = parseInt(servedResult[0]?.count || '0');

      const waitingResult = await postApi<{ count: string }[]>("/unsafe-query", {
        query: `SELECT COUNT(*) as count FROM visits WHERE DATE("createdAt") = '${today}' AND status IN ('menunggu', 'dipanggil')`
      });
      const waiting = parseInt(waitingResult[0]?.count || '0');

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const newPatientsResult = await postApi<{ count: string }[]>("/unsafe-query", {
        query: `SELECT COUNT(*) as count FROM patients WHERE "createdAt" >= '${firstDayOfMonth.toISOString()}'`
      });
      const newPatients = parseInt(newPatientsResult[0]?.count || '0');

      setStats({ total, served, waiting, newPatients });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat statistik antrian" });
    }
  };

  const fetchVisits = async () => {
    setLoading(true);
    const today = format(new Date(), "yyyy-MM-dd");
    try {
      const visitData = await postApi<any[]>("/unsafe-query", {
        query: `
          SELECT 
            v.id,
            v."visitNumber" as visit_number,
            v."queueNumber" as queue_number,
            v."createdAt" as visit_time,
            v.status,
            v."paymentType" as payment_type,
            p.id as patient_id,
            p."medicalRecordNumber" as patient_mrn,
            p.nik as patient_nik,
            p.name as patient_name,
            p.gender as patient_gender,
            p."dateOfBirth" as patient_dob,
            p.phone as patient_phone,
            p."bpjsNumber" as patient_bpjs,
            d.name as dept_name,
            dr."fullName" as doctor_name
          FROM visits v
          JOIN patients p ON v."patientId" = p.id
          LEFT JOIN departments d ON v."departmentId" = d.id
          LEFT JOIN doctors dr ON v."doctorId" = dr.id
          WHERE DATE(v."createdAt") = '${today}'
          ORDER BY v."queueNumber" ASC
          LIMIT 50`
      });

      const transformedVisits: Visit[] = (visitData || []).map((v: any) => ({
        id: v.id,
        visit_number: v.visit_number,
        queue_number: v.queue_number,
        visit_time: v.visit_time,
        status: v.status,
        payment_type: v.payment_type,
        patient: {
          id: v.patient_id,
          medical_record_number: v.patient_mrn,
          nik: v.patient_nik,
          full_name: v.patient_name,
          gender: v.patient_gender,
          birth_date: v.patient_dob,
          phone: v.patient_phone,
          bpjs_number: v.patient_bpjs,
        },
        department: v.dept_name ? { name: v.dept_name } : null,
        doctor: v.doctor_name ? { full_name: v.doctor_name } : null,
      }));
      
      setVisits(transformedVisits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat data antrian" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await postApi<Department[]>("/unsafe-query", {
        query: "SELECT id, name FROM departments ORDER BY name ASC"
      });
      setDepartments(data || []);
    } catch (e) {
      console.error("Failed to load departments:", e);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await postApi<Doctor[]>("/unsafe-query", {
        query: "SELECT id, \"fullName\" as full_name, specialization FROM doctors ORDER BY \"fullName\" ASC"
      });
      setDoctors(data || []);
    } catch (e) {
      console.error("Failed to load doctors:", e);
    }
  };

  const searchPatients = async (term: string) => {
    if (!term || term.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await postApi<any[]>("/unsafe-query", {
        query: `
          SELECT id, "medicalRecordNumber" as medical_record_number, nik, name as full_name, gender, "dateOfBirth" as birth_date, phone, "bpjsNumber" as bpjs_number
          FROM patients
          WHERE name ILIKE '%${term}%' OR nik ILIKE '%${term}%' OR "medicalRecordNumber" ILIKE '%${term}%'
          LIMIT 5`
      });
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal mencari pasien" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    searchPatients(value);
    setSelectedPatient(null);
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setSearchTerm(patient.full_name);
  };

  const handleRegisterVisit = async () => {
    if (!formData.department_id || !formData.payment_type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon pilih poliklinik dan jenis pembayaran",
      });
      return;
    }

    let patientId = selectedPatient?.id;

    // If new patient tab, create patient first
    if (activeTab === "new") {
      if (!newPatientData.nik || !newPatientData.full_name || !newPatientData.birth_date || !newPatientData.gender) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Mohon lengkapi data pasien wajib",
        });
        return;
      }
    }

    if (!patientId && activeTab === "existing") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon pilih pasien terlebih dahulu",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create new patient if needed
      if (activeTab === "new") {
        // Generate medical record number using PostgreSQL function
        const mrnResult = await postApi<{ medical_record_number: string }[]>("/unsafe-query", {
          query: `SELECT 'RM-' || to_char(now(), 'YYMMDD') || lpad(floor(random() * 1000)::text, 4, '0') as medical_record_number`
        });
        const mrn = mrnResult[0]?.medical_record_number;

        // Insert new patient
        const insertResult = await postApi<{ id: string }[]>("/unsafe-query", {
          query: `
          INSERT INTO patients (
            "medicalRecordNumber",
            nik,
            name,
            "dateOfBirth",
            gender,
            phone,
            address,
            "bpjsNumber"
          ) VALUES (
            '${mrn}',
            '${newPatientData.nik}',
            '${newPatientData.full_name}',
            '${newPatientData.birth_date}',
            '${newPatientData.gender as "L" | "P"}',
            '${newPatientData.phone || ""}',
            '${newPatientData.address || ""}',
            '${newPatientData.bpjs_number || ""}'
          )
          RETURNING id`
        });

        patientId = insertResult[0]?.id;
      }

      // Get current queue count for the department
      const today = format(new Date(), "yyyy-MM-dd");
      const queueResult = await postApi<{ count: string }[]>("/unsafe-query", {
        query: `
        SELECT COUNT(*) as count
        FROM visits
        WHERE DATE("createdAt") = '${today}'
        AND "departmentId" = '${formData.department_id}'`
      });
      
      const nextQueueNumber = parseInt(queueResult[0]?.count || '0') + 1;

      // Generate visit number
      const visitNumberResult = await postApi<{ visit_number: string }[]>("/unsafe-query", {
        query: `SELECT 'VIS-' || to_char(now(), 'YYMMDD') || lpad(floor(random() * 1000)::text, 4, '0') as visit_number`
      });
      const visitNumber = visitNumberResult[0]?.visit_number;

      // Create visit
      await postApi("/unsafe-query", {
        query: `
          INSERT INTO visits (
            "patientId",
            "departmentId",
            "doctorId",
            "visitNumber",
            "queueNumber",
            "paymentType",
            complaint,
            status
          ) VALUES (
            '${patientId}',
            '${formData.department_id}',
            ${formData.doctor_id ? `'${formData.doctor_id}'` : 'NULL'},
            '${visitNumber}',
            ${nextQueueNumber},
            '${formData.payment_type}',
            '${formData.chief_complaint || ''}',
            'menunggu'
          )
        `
      });

      toast({
        title: "Berhasil",
        description: `Pasien berhasil didaftarkan. Nomor antrian: ${nextQueueNumber}`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchVisits();
      fetchStats();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mendaftarkan pasien",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      department_id: "",
      doctor_id: "",
      payment_type: "",
      chief_complaint: "",
    });
    setNewPatientData({
      nik: "",
      full_name: "",
      birth_date: "",
      birth_place: "",
      gender: "",
      blood_type: "",
      religion: "",
      marital_status: "",
      education_level: "",
      occupation: "",
      nationality: "Indonesia",
      mother_name: "",
      phone: "",
      email: "",
      address: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
      kabupaten: "",
      city: "",
      province: "",
      postal_code: "",
      bpjs_number: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_relation: "",
      allergy_notes: "",
    });
    setSelectedPatient(null);
    setSearchTerm("");
    setSearchResults([]);
    setActiveTab("existing");
  };

  const handleCallPatient = async (visitId: string) => {
    try {
      await putApi("/generic-api", {});

      toast({ title: "Pasien dipanggil" });
      fetchVisits();
      fetchStats();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCancelVisit = async () => {
    if (!visitToCancel) return;
    
    setIsCancelling(true);
    try {
      // Update visit status to cancelled
      await putApi("/generic-api", {});

      toast({ title: "Kunjungan berhasil dibatalkan" });
      fetchVisits();
      fetchStats();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal membatalkan kunjungan",
      });
    } finally {
      setIsCancelling(false);
      setCancelConfirmOpen(false);
      setVisitToCancel(null);
    }
  };

  const openCancelConfirm = (visit: Visit) => {
    setVisitToCancel(visit);
    setCancelConfirmOpen(true);
  };

  const openRegisterConfirm = () => {
    if (!formData.department_id || !formData.payment_type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon pilih poliklinik dan jenis pembayaran",
      });
      return;
    }

    if (activeTab === "new") {
      if (!newPatientData.nik || !newPatientData.full_name || !newPatientData.birth_date || !newPatientData.gender) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Mohon lengkapi data pasien wajib",
        });
        return;
      }
    }

    if (!selectedPatient && activeTab === "existing") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon pilih pasien terlebih dahulu",
      });
      return;
    }

    setRegisterConfirmOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dipanggil":
        return <Badge className="bg-success/10 text-success border-success/20">Dipanggil</Badge>;
      case "dilayani":
        return <Badge className="bg-info/10 text-info border-info/20">Dilayani</Badge>;
      case "selesai":
        return <Badge className="bg-muted text-muted-foreground">Selesai</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Menunggu</Badge>;
    }
  };

  const filteredDoctors = formData.department_id
    ? doctors.filter(d => d.department_id === formData.department_id)
    : doctors;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pendaftaran Pasien</h1>
          <p className="text-muted-foreground">Kelola pendaftaran dan antrian pasien</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow">
              <UserPlus className="h-4 w-4 mr-2" />
              Daftarkan Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Pendaftaran Pasien</DialogTitle>
              <DialogDescription>
                Daftarkan pasien baru atau cari pasien lama
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-4">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Pasien Lama</TabsTrigger>
                <TabsTrigger value="new">Pasien Baru</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari No. RM, NIK, atau Nama Pasien..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg divide-y">
                    {searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.full_name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.full_name}</p>
                            <p className="text-xs text-muted-foreground">{patient.medical_record_number} | {patient.nik}</p>
                          </div>
                        </div>
                        {patient.bpjs_number && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">BPJS</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Patient Info */}
                {selectedPatient && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-1">Pasien Terpilih</p>
                    <p className="font-semibold">{selectedPatient.full_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPatient.medical_record_number}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="new" className="mt-4">
                <PatientFormFields 
                  data={newPatientData as any} 
                  onChange={(data) => setNewPatientData(data as any)} 
                  compact={true} 
                />
              </TabsContent>
            </Tabs>

            {/* Common Registration Fields */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Poliklinik *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value, doctor_id: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Poliklinik" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dokter</Label>
                <Select
                  value={formData.doctor_id}
                  onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Dokter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.full_name} {doc.specialization && `(${doc.specialization})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Pembayaran *</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value: "bpjs" | "umum" | "asuransi") => setFormData({ ...formData, payment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bpjs">BPJS Kesehatan</SelectItem>
                    <SelectItem value="umum">Umum / Pribadi</SelectItem>
                    <SelectItem value="asuransi">Asuransi Lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keluhan Utama</Label>
                <Input
                  placeholder="Keluhan pasien"
                  value={formData.chief_complaint}
                  onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
                />
              </div>
            </div>
            </ScrollArea>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleRegisterVisit} disabled={isSubmitting} className="gradient-primary">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Daftarkan"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Antrian Hari Ini</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <Calendar className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.served}</p>
            <p className="text-sm text-muted-foreground">Sudah Dilayani</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.waiting}</p>
            <p className="text-sm text-muted-foreground">Menunggu</p>
          </div>
        </div>
        <div className="module-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-info/10">
            <UserPlus className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.newPatients}</p>
            <p className="text-sm text-muted-foreground">Pasien Baru (Bulan Ini)</p>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="module-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Antrian Pasien Hari Ini</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchVisits}>
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada antrian hari ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Antrian</th>
                  <th>No. RM</th>
                  <th>Pasien</th>
                  <th>Poliklinik</th>
                  <th>Dokter</th>
                  <th>Jam Daftar</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {visit.queue_number || "-"}
                      </span>
                    </td>
                    <td className="font-mono text-xs">{visit.patient?.medical_record_number}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {visit.patient?.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{visit.patient?.full_name}</span>
                      </div>
                    </td>
                    <td>{visit.department?.name || "-"}</td>
                    <td>{visit.doctor?.full_name || "-"}</td>
                    <td>{visit.visit_time?.substring(0, 5)}</td>
                    <td>{getStatusBadge(visit.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {visit.status === "menunggu" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleCallPatient(visit.id)}>
                              <Phone className="h-3 w-3 mr-1" />
                              Panggil
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openCancelConfirm(visit)}>
                                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                  Batalkan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                        {visit.status !== "menunggu" && (
                          <Button size="sm" variant="ghost">
                            Detail
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={registerConfirmOpen}
        onOpenChange={setRegisterConfirmOpen}
        title="Konfirmasi Pendaftaran"
        description={
          activeTab === "new"
            ? `Daftarkan pasien baru "${newPatientData.full_name}" ke poliklinik?`
            : `Daftarkan "${selectedPatient?.full_name || ""}" ke poliklinik?`
        }
        type="confirm"
        confirmLabel="Daftarkan"
        onConfirm={() => {
          setRegisterConfirmOpen(false);
          handleRegisterVisit();
        }}
        isLoading={isSubmitting}
      />

      <ConfirmationDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="Batalkan Kunjungan"
        description={`Apakah Anda yakin ingin membatalkan kunjungan ${visitToCancel?.patient?.full_name || ""}?`}
        type="delete"
        confirmLabel="Ya, Batalkan"
        onConfirm={handleCancelVisit}
        isLoading={isCancelling}
      />
    </div>
  );
}

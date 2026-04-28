import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { 
  FileText, Search, Filter, Plus, Calendar, 
  User, Stethoscope, Activity, ChevronRight, Download, 
  Eye, Edit, Trash2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface LabResult {
  id: string;
  lab_number: string;
  patient_id: string;
  template_id: string;
  visit_id: string;
  status: string;
  results: Record<string, string>;
  notes: string | null;
  request_date: string;
  sample_date: string | null;
  result_date: string | null;
  requested_by: string | null;
  created_at: string;
  updated_at: string;
}

interface LabTemplate {
  id: string;
  name: string;
  description: string | null;
  fields: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Laboratorium() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch lab results
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labTemplates, setLabTemplates] = useState<LabTemplate[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingResults(true);
      setIsLoadingTemplates(true);
      
      try {
        // Fetch lab results
        const results = await getApi<LabResult[]>`
          SELECT 
            lr.id,
            lr.lab_number,
            lr.patient_id,
            lr.template_id,
            lr.visit_id,
            lr.status,
            lr.results,
            lr.notes,
            lr.request_date,
            lr.sample_date,
            lr.result_date,
            lr.requested_by,
            lr.created_at,
            lr.updated_at
          FROM laboratory_requests lr
          WHERE lr.status != 'deleted'
          ORDER BY lr.request_date DESC
        `;

        // Fetch lab templates
        const templates = await getApi<LabTemplate[]>`
          SELECT 
            lt.id,
            lt.name,
            lt.description,
            lt.fields,
            lt.is_active,
            lt.created_at,
            lt.updated_at
          FROM lab_templates lt
          WHERE lt.is_active = true
        `;

        // Fetch related data
        const patientIds = [...new Set(results.map(r => r.patient_id))];
        const doctorIds = [...new Set(results.map(r => r.requested_by).filter(Boolean))] as string[];

        let patientsData: any[] = [];
        let doctorsData: any[] = [];

        if (patientIds.length > 0) {
          patientsData = await getApi<any[]>`
            SELECT 
              p.id,
              p.patientId,
              p.nama AS name,
              p.jenis_kelamin AS gender,
              p.umur AS age,
              p.tanggal_lahir AS birth_date,
              p.alamat AS address
            FROM patients p
            WHERE p.id IN (${patientIds.join(', ')})
          `;
        }

        if (doctorIds.length > 0) {
          doctorsData = await getApi<any[]>`
            SELECT 
              d.id,
              d.kode AS code,
              d.nama AS name,
              d.spesialisasi AS specialization
            FROM dokters d
            WHERE d.id IN (${doctorIds.join(', ')})
          `;
        }

        setLabResults(results);
        setLabTemplates(templates);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingResults(false);
        setIsLoadingTemplates(false);
        setIsLoadingPatients(false);
        setIsLoadingDoctors(false);
      }
    };

    fetchData();
  }, []);

  // Filter lab results based on search term, status, and date
  const filteredResults = labResults.filter(result => {
    const matchesSearch = 
      patients.find((p: any) => p.id === result.patient_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.lab_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || result.status === selectedStatus;
    
    const resultDate = result.request_date ? new Date(result.request_date) : null;
    const matchesDate = !selectedDate || !resultDate || 
      resultDate.toISOString().split('T')[0] === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Get patient name by ID
  const getPatientName = (id: string) => {
    const patient = patients.find((p: any) => p.id === id);
    return patient ? patient.name : "N/A";
  };

  // Get doctor name by ID
  const getDoctorName = (id: string) => {
    if (!id) return "N/A";
    const doctor = doctors.find((d: any) => d.id === id);
    return doctor ? doctor.name : "N/A";
  };

  // Get status variant for badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "in-progress":
        return "Dalam Proses";
      case "pending":
        return "Menunggu";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratorium</h1>
          <p className="text-muted-foreground">
            Kelola permintaan dan hasil pemeriksaan laboratorium
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Permintaan
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pasien..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status Pemeriksaan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="in-progress">Dalam Proses</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemeriksaan Laboratorium</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingResults || isLoadingPatients || isLoadingDoctors ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Permintaan</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">Bulan ini</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Sample pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">Analisis</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100</div>
                  <p className="text-xs text-muted-foreground">Hasil siap</p>
                </CardContent>
              </Card>
            </div>

            {/* Lab Results Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Lab</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Dokter Pengirim</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hasil</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.lab_number}</TableCell>
                        <TableCell>{getPatientName(result.patient_id)}</TableCell>
                        <TableCell>{getDoctorName(result.requested_by || '')}</TableCell>
                        <TableCell>
                          {result.request_date 
                            ? format(parseISO(result.request_date), 'dd MMM yyyy', { locale: id })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(result.status)}>
                            {getStatusLabel(result.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {result.status === 'completed' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTest(result);
                                setShowResultModal(true);
                              }}
                            >
                              Lihat Hasil
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Tidak ada hasil pemeriksaan laboratorium
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
          )}
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hasil Pemeriksaan Laboratorium</DialogTitle>
            <DialogDescription>
              Detail hasil pemeriksaan untuk {selectedTest ? getPatientName(selectedTest.patient_id) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">No. Lab</p>
                    <p className="font-medium">{selectedTest.lab_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Pemeriksaan</p>
                    <p className="font-medium">
                      {selectedTest.result_date 
                        ? format(parseISO(selectedTest.result_date), 'dd MMM yyyy', { locale: id })
                        : '-'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Pasien</p>
                  <p className="font-medium">{getPatientName(selectedTest.patient_id)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Pemeriksaan</p>
                  <p className="font-medium">
                    {labTemplates.find(t => t.id === selectedTest.template_id)?.name || 'N/A'}
                  </p>
                </div>
                
                {selectedTest.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Catatan</p>
                    <p className="font-medium whitespace-pre-line">{selectedTest.notes}</p>
                  </div>
                )}
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Parameter</TableHead>
                        <TableHead>Nilai</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Nilai Normal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(selectedTest.results || {}).map(([param, value], idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{param}</TableCell>
                          <TableCell>{value}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="outline">Normal</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowResultModal(false)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
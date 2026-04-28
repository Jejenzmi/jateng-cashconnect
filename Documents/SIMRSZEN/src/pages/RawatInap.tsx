import { useState, useEffect } from "react";
import { 
  Bed, Calendar, User, Search, Filter, Plus, Eye, Edit, 
  Trash2, Phone, Mail, MapPin, Stethoscope, Pill, Activity
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

// ... kode komponen RawatInap ...

export default function RawatInap() {
  const { user } = useAuth();
  const [inpatientStays, setInpatientStays] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInpatient, setNewInpatient] = useState({
    patientId: "",
    doctorId: "",
    roomId: "",
    bedNumber: "",
    admissionDate: new Date().toISOString().split('T')[0],
    dischargeDate: "",
    notes: ""
  });

  // Fungsi untuk mengambil data rawat inap
  const fetchInpatientStays = async () => {
    try {
      // Di sini seharusnya ada panggilan API, misalnya:
      // const response = await getApi('/api/inpatient-stays');
      // setInpatientStays(response.data);
      // Untuk saat ini, kita hanya menggunakan data dummy
      setInpatientStays([
        {
          id: "1",
          patientId: "P001",
          doctorId: "D001",
          roomId: "R001",
          bedNumber: "101",
          admissionDate: "2023-10-01",
          dischargeDate: "",
          notes: "Pasien sakit kepala",
          isActive: true,
          roomName: "Ruangan 1",
        },
        {
          id: "2",
          patientId: "P002",
          doctorId: "D002",
          roomId: "R002",
          bedNumber: "102",
          admissionDate: "2023-10-02",
          dischargeDate: "2023-10-05",
          notes: "Pasien sakit perut",
          isActive: false,
          roomName: "Ruangan 2",
        },
      ]);
    } catch (error) {
      console.error('Error fetching inpatient stays:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data pasien
  const fetchPatients = async () => {
    try {
      // Di sini seharusnya ada panggilan API, misalnya:
      // const response = await getApi('/api/patients');
      // setPatients(response.data);
      // Untuk saat ini, kita hanya menggunakan data dummy
      setPatients([
        {
          id: "P001",
          nama: "John Doe",
          patientId: "P001",
          jenisKelamin: "Laki-laki",
          tanggalLahir: "1990-01-01",
          alamat: "Jl. Jalan No. 1",
          noTelp: "081234567890",
          email: "johndoe@example.com",
        },
        {
          id: "P002",
          nama: "Jane Smith",
          patientId: "P002",
          jenisKelamin: "Perempuan",
          tanggalLahir: "1992-02-02",
          alamat: "Jl. Jalan No. 2",
          noTelp: "089876543210",
          email: "janesmith@example.com",
        },
      ]);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fungsi untuk mengambil data dokter
  const fetchDoctors = async () => {
    try {
      // Di sini seharusnya ada panggilan API, misalnya:
      // const response = await getApi('/api/doctors');
      // setDoctors(response.data);
      // Untuk saat ini, kita hanya menggunakan data dummy
      setDoctors([
        {
          id: "D001",
          nama: "Dr. John Doe",
          kode: "D001",
          spesialisasi: "Bedah Umum",
          noTelp: "081234567890",
          email: "johndoe@example.com",
        },
        {
          id: "D002",
          nama: "Dr. Jane Smith",
          kode: "D002",
          spesialisasi: "Gastroenterologi",
          noTelp: "089876543210",
          email: "janesmith@example.com",
        },
      ]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fungsi untuk mengambil data ruangan
  const fetchWards = async () => {
    try {
      // Di sini seharusnya ada panggilan API, misalnya:
      // const response = await getApi('/api/wards');
      // setWards(response.data);
      // Untuk saat ini, kita hanya menggunakan data dummy
      setWards([
        {
          id: "R001",
          name: "Ruangan 1",
          capacity: 30,
        },
        {
          id: "R002",
          name: "Ruangan 2",
          capacity: 30,
        },
      ]);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  // Fungsi untuk menambahkan rawat inap baru
  const handleAddInpatient = async () => {
    try {
      // Validasi input
      if (!newInpatient.patientId || !newInpatient.doctorId || !newInpatient.roomId || !newInpatient.admissionDate) {
        alert('Mohon lengkapi semua data wajib');
        return;
      }

      // Format data untuk dikirim ke API
      const inpatientData = {
        patientId: newInpatient.patientId,
        doctorId: newInpatient.doctorId,
        roomId: newInpatient.roomId,
        bedNumber: parseInt(newInpatient.bedNumber),
        admissionDate: newInpatient.admissionDate,
        dischargeDate: newInpatient.dischargeDate || null,
        notes: newInpatient.notes || '',
        admittedBy: user.id,
      };

      // Panggil API untuk menambahkan data rawat inap
      // Di sini seharusnya ada panggilan API, misalnya:
      // await postApi('/api/inpatient-stays', inpatientData);
      
      // Untuk saat ini, kita hanya reset form dan tutup modal
      setNewInpatient({
        patientId: '',
        doctorId: '',
        roomId: '',
        bedNumber: '',
        admissionDate: new Date().toISOString().split('T')[0],
        dischargeDate: '',
        notes: ''
      });
      
      setShowAddModal(false);
      
      // Refresh data
      fetchInpatientStays();
    } catch (error) {
      console.error('Error adding inpatient:', error);
      alert('Gagal menambahkan data rawat inap');
    }
  };

  useEffect(() => {
    fetchInpatientStays();
    fetchPatients();
    fetchDoctors();
    fetchWards();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rawat Inap</h1>
          <p className="text-muted-foreground">
            Kelola data pasien rawat inap dan ketersediaan tempat tidur
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Rawat Inap
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
        <Select value={selectedWard} onValueChange={setSelectedWard}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Ruangan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Ruangan</SelectItem>
            {wards.map(ward => (
              <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status Pasien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="discharged">Pulang</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inpatientStays.length}</div>
            <p className="text-xs text-muted-foreground">Saat ini dirawat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tempat Tidur</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48/60</div>
            <p className="text-xs text-muted-foreground">Tersedia: 12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Lama</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 hr</div>
            <p className="text-xs text-muted-foreground">Perawatan</p>
          </CardContent>
        </Card>
      </div>

      {/* Inpatient List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pasien Rawat Inap</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasien</TableHead>
                <TableHead>Ruangan</TableHead>
                <TableHead>Dokter Penanggung Jawab</TableHead>
                <TableHead>Masuk</TableHead>
                <TableHead>Estimasi Pulang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inpatientStays.map((stay) => {
                const patient = patients.find(p => p.id === stay.patientId);
                const doctor = doctors.find(d => d.id === stay.doctorId);
                
                return (
                  <TableRow key={stay.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{patient?.nama?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient?.nama}</p>
                          <p className="text-sm text-muted-foreground">{patient?.patientId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{stay.roomName}</p>
                        <p className="text-sm text-muted-foreground">Bed {stay.bedNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doctor?.nama}</p>
                        <p className="text-sm text-muted-foreground">{doctor?.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(stay.admissionDate), 'dd MMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell>
                      {stay.dischargeDate 
                        ? format(parseISO(stay.dischargeDate), 'dd MMM yyyy', { locale: id })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={stay.isActive ? "default" : "secondary"}>
                        {stay.isActive ? "Dirawat" : "Pulang"}
                      </Badge>
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Inpatient Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pasien Rawat Inap</DialogTitle>
            <DialogDescription>
              Isi data pasien dan informasi rawat inap
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Pasien</label>
                <Select 
                  value={newInpatient.patientId} 
                  onValueChange={(value) => setNewInpatient({...newInpatient, patientId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Pasien" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>{patient.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Dokter Penanggung Jawab</label>
                <Select 
                  value={newInpatient.doctorId} 
                  onValueChange={(value) => setNewInpatient({...newInpatient, doctorId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Dokter" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>{doctor.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ruangan</label>
                <Select 
                  value={newInpatient.roomId} 
                  onValueChange={(value) => setNewInpatient({...newInpatient, roomId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map(ward => (
                      <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Nomor Tempat Tidur</label>
                <Input 
                  type="number" 
                  value={newInpatient.bedNumber} 
                  onChange={(e) => setNewInpatient({...newInpatient, bedNumber: e.target.value})}
                  placeholder="Nomor TT"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tanggal Masuk</label>
                <Input 
                  type="date" 
                  value={newInpatient.admissionDate} 
                  onChange={(e) => setNewInpatient({...newInpatient, admissionDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tanggal Perkiraan Pulang</label>
                <Input 
                  type="date" 
                  value={newInpatient.dischargeDate} 
                  onChange={(e) => setNewInpatient({...newInpatient, dischargeDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Catatan</label>
              <Input 
                value={newInpatient.notes} 
                onChange={(e) => setNewInpatient({...newInpatient, notes: e.target.value})}
                placeholder="Catatan tambahan"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Batal</Button>
            <Button onClick={handleAddInpatient}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

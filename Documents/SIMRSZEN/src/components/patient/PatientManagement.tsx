import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Phone,
  MapPin,
  Droplets,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  nik: string;
  medicalRecordNumber: string;
  name: string;
  dateOfBirth: string;
  gender: 'L' | 'P';
  bloodType?: string;
  bpjsNumber?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  maritalStatus?: string;
  religion?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

const PatientManagement: React.FC = () => {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      return response.data.data as Patient[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (patientData: Omit<Patient, 'id' | 'medicalRecordNumber' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/patients`, patientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalOpen(false);
      setEditingPatient(null);
      setFormData({
        nik: '',
        name: '',
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: 'L',
        bloodType: '',
        bpjsNumber: '',
        phone: '',
        address: '',
        occupation: '',
        maritalStatus: '',
        religion: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
      toast.success(editingPatient ? 'Pasien berhasil diperbarui' : 'Pasien berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving patient:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data pasien');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...patientData }: Patient) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/patients/${id}`, patientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalOpen(false);
      setEditingPatient(null);
      setFormData({
        nik: '',
        name: '',
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: 'L',
        bloodType: '',
        bpjsNumber: '',
        phone: '',
        address: '',
        occupation: '',
        maritalStatus: '',
        religion: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
      toast.success('Pasien berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating patient:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data pasien');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/patients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Pasien berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting patient:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data pasien');
    }
  });

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalRecordNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.bpjsNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const [formData, setFormData] = useState<Omit<Patient, 'id' | 'medicalRecordNumber' | 'createdAt' | 'updatedAt'>>({
    nik: '',
    name: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    gender: 'L',
    bloodType: '',
    bpjsNumber: '',
    phone: '',
    address: '',
    occupation: '',
    maritalStatus: '',
    religion: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  
  useEffect(() => {
    if (editingPatient) {
      setFormData({
        nik: editingPatient.nik,
        name: editingPatient.name,
        dateOfBirth: new Date(editingPatient.dateOfBirth).toISOString().split('T')[0],
        gender: editingPatient.gender,
        bloodType: editingPatient.bloodType || '',
        bpjsNumber: editingPatient.bpjsNumber || '',
        phone: editingPatient.phone || '',
        address: editingPatient.address || '',
        occupation: editingPatient.occupation || '',
        maritalStatus: editingPatient.maritalStatus || '',
        religion: editingPatient.religion || '',
        emergencyContactName: editingPatient.emergencyContactName || '',
        emergencyContactPhone: editingPatient.emergencyContactPhone || '',
      });
      setIsModalOpen(true);
    }
  }, [editingPatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      updateMutation.mutate({ ...editingPatient, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data pasien ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pasien</h1>
        <p className="text-muted-foreground">
          Kelola data pasien, registrasi, dan riwayat kunjungan
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Pasien Aktif</TabsTrigger>
          <TabsTrigger value="archive">Arsip</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien berdasarkan nama, NIK, atau nomor BPJS..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Pasien Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tambah Pasien Baru</DialogTitle>
                  <DialogDescription>
                    Isi formulir di bawah untuk mendaftarkan pasien baru
                  </DialogDescription>
                </DialogHeader>
                <PatientForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Pasien</CardTitle>
              <CardDescription>
                {filteredPatients.length} pasien ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. RM</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Nomor HP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients?.filter(patient => 
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.nik.includes(searchTerm) ||
                    patient.medicalRecordNumber.includes(searchTerm)
                  ).map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{patient.medicalRecordNumber}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.nik}</TableCell>
                      <TableCell>
                        <Badge variant={patient.gender === 'L' ? 'default' : 'secondary'}>
                          {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>{patient.bpjsNumber || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Arsip Pasien</CardTitle>
              <CardDescription>
                Data pasien yang tidak aktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Belum ada data arsip pasien
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  +10% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pasien BPJS</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter(p => p.bpjsNumber).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((patients.filter(p => p.bpjsNumber).length / patients.length) * 100)}% dari total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Golongan Darah Umum</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter(p => p.bloodType === 'O+')?.length > 0 
                    ? 'O+' 
                    : patients[0]?.bloodType || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paling banyak didaftarkan
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alergi Umum</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.some(p => p.allergies) ? 'Ya' : 'Tidak'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {patients.filter(p => p.allergies).length} pasien
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPatient ? 'Edit Pasien' : 'Tambah Pasien Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                      NIK *
                    </Label>
                    <Input
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleChange}
                      required
                      maxLength={16}
                      className="w-full"
                      placeholder="Masukkan NIK (16 digit)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Nama lengkap pasien"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin *
                    </Label>
                    <Select
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as 'L' | 'P' }))}
                      value={formData.gender}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                      Golongan Darah
                    </Label>
                    <Input
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Contoh: A, B, AB, O"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bpjsNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      No. Kartu BPJS
                    </Label>
                    <Input
                      id="bpjsNumber"
                      name="bpjsNumber"
                      value={formData.bpjsNumber}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Nomor kartu BPJS"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telepon
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Nomor telepon"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Alamat lengkap"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPatient(null);
                      setFormData({
                        nik: '',
                        name: '',
                        dateOfBirth: new Date().toISOString().split('T')[0],
                        gender: 'L',
                        bloodType: '',
                        bpjsNumber: '',
                        phone: '',
                        address: '',
                        occupation: '',
                        maritalStatus: '',
                        religion: '',
                        emergencyContactName: '',
                        emergencyContactPhone: '',
                      });
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingPatient ? 'Perbarui' : 'Simpan')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Patient Form Component
const PatientForm: React.FC = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicalRecordNo">Nomor Rekam Medis</Label>
          <Input id="medicalRecordNo" placeholder="Otomatis jika kosong" />
        </div>
        <div>
          <Label htmlFor="nik">NIK</Label>
          <Input id="nik" placeholder="Nomor Induk Kependudukan" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input id="fullName" placeholder="Nama lengkap pasien" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthDate">Tanggal Lahir</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="birthDate" type="date" className="pl-9" />
          </div>
        </div>
        <div>
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Alamat</Label>
        <Input id="address" placeholder="Alamat lengkap pasien" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Nomor HP</Label>
          <Input id="phone" placeholder="Nomor telepon aktif" />
        </div>
        <div>
          <Label htmlFor="bpjsNumber">Nomor BPJS</Label>
          <Input id="bpjsNumber" placeholder="Nomor kepesertaan BPJS" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bloodType">Golongan Darah</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih golongan darah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="allergies">Alergi</Label>
          <Input id="allergies" placeholder="Alergi obat/spesifik" />
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
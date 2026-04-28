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
  Stethoscope,
  Clock,
  MapPin,
  FileText,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Registration {
  id: string;
  patientId: string;
  patientName: string;
  registrationDate: string;
  serviceType: string;
  department: string;
  doctor: string;
  status: 'daftar' | 'periksa' | 'selesai' | 'batal';
  queueNumber: string;
  notes: string;
}

const RegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockRegistrations: Registration[] = [
      {
        id: '1',
        patientId: '1',
        patientName: 'Ahmad Fauzi',
        registrationDate: '2026-04-19 08:30:00',
        serviceType: 'rawat_jalan',
        department: 'poli-internal',
        doctor: 'dr. Budi Santoso',
        status: 'periksa',
        queueNumber: 'A-001',
        notes: 'Kontrol hipertensi',
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'Siti Nurhaliza',
        registrationDate: '2026-04-19 09:15:00',
        serviceType: 'rawat_jalan',
        department: 'poli-kandungan',
        doctor: 'dr. Sri Lestari',
        status: 'daftar',
        queueNumber: 'B-002',
        notes: 'Pemeriksaan rutin trimester 2',
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'Budi Santoso',
        registrationDate: '2026-04-18 14:20:00',
        serviceType: 'gawat_darurat',
        department: 'igd',
        doctor: 'dr. Andi Pratama',
        status: 'selesai',
        queueNumber: 'C-001',
        notes: 'Kecelakaan lalu lintas minor',
      },
    ];
    setRegistrations(mockRegistrations);
    setFilteredRegistrations(mockRegistrations);
  }, []);

  useEffect(() => {
    const results = registrations.filter(registration =>
      registration.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.queueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegistrations(results);
  }, [searchTerm, registrations]);

  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDialogOpen(true);
  };

  const handleEditRegistration = (registration: Registration) => {
    navigate(`/registrations/edit/${registration.id}`);
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(registrations.filter(registration => registration.id !== id));
    setFilteredRegistrations(filteredRegistrations.filter(registration => registration.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Registration['status']) => {
    setRegistrations(prev => prev.map(reg => reg.id === id ? {...reg, status} : reg));
    setFilteredRegistrations(prev => prev.map(reg => reg.id === id ? {...reg, status} : reg));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Registrasi</h1>
        <p className="text-muted-foreground">
          Kelola pendaftaran pasien, antrian, dan status pemeriksaan
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Antrian Hari Ini</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama pasien, nomor antri, atau dokter..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Daftar Pasien
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Registrasi Pasien Baru</DialogTitle>
                  <DialogDescription>
                    Isi formulir di bawah untuk mendaftarkan pasien
                  </DialogDescription>
                </DialogHeader>
                <RegistrationForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Antrian Pemeriksaan</CardTitle>
              <CardDescription>
                {filteredRegistrations.filter(r => r.status !== 'selesai' && r.status !== 'batal').length} pasien menunggu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Antrian</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Waktu Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations
                    .filter(r => r.status !== 'selesai' && r.status !== 'batal')
                    .map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.queueNumber}</TableCell>
                      <TableCell>{registration.patientName}</TableCell>
                      <TableCell>{registration.department.replace('poli-', 'Poli ').replace('_', ' ')}</TableCell>
                      <TableCell>{registration.doctor}</TableCell>
                      <TableCell>{new Date(registration.registrationDate).toLocaleTimeString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            registration.status === 'daftar' ? 'default' :
                            registration.status === 'periksa' ? 'secondary' :
                            registration.status === 'selesai' ? 'outline' :
                            'destructive'
                          }
                        >
                          {registration.status === 'daftar' && 'Terdaftar'}
                          {registration.status === 'periksa' && 'Sedang Diperiksa'}
                          {registration.status === 'selesai' && 'Selesai'}
                          {registration.status === 'batal' && 'Dibatalkan'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRegistration(registration)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRegistration(registration)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {registration.status === 'daftar' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateStatus(registration.id, 'periksa')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          
                          {registration.status === 'periksa' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateStatus(registration.id, 'selesai')}
                            >
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRegistration(registration.id)}
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

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pendaftaran</CardTitle>
              <CardDescription>
                Daftar pendaftaran sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations
                    .filter(r => r.status === 'selesai' || r.status === 'batal')
                    .map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{new Date(registration.registrationDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{registration.patientName}</TableCell>
                      <TableCell>{registration.department.replace('poli-', 'Poli ').replace('_', ' ')}</TableCell>
                      <TableCell>{registration.doctor}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            registration.status === 'selesai' ? 'outline' :
                            'destructive'
                          }
                        >
                          {registration.status === 'selesai' && 'Selesai'}
                          {registration.status === 'batal' && 'Dibatalkan'}
                        </Badge>
                      </TableCell>
                      <TableCell>{registration.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {registrations.filter(r => 
                    new Date(r.registrationDate).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pendaftaran hari ini
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sedang Diperiksa</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {registrations.filter(r => r.status === 'periksa').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pasien sedang diperiksa
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {registrations.filter(r => r.status === 'selesai').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pemeriksaan selesai
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rawat Jalan</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {registrations.filter(r => r.serviceType === 'rawat_jalan').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pendaftaran rawat jalan
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Antrian Per Departemen</CardTitle>
              <CardDescription>
                Distribusi pendaftaran berdasarkan departemen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(registrations.map(r => r.department))).map(dept => {
                  const deptRegs = registrations.filter(r => r.department === dept);
                  return (
                    <div key={dept} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{dept.replace('poli-', 'Poli ').replace('_', ' ')}</span>
                        <span className="text-sm text-muted-foreground">{deptRegs.length} pasien</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(deptRegs.length / registrations.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Registrasi</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang registrasi pasien
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nomor Antrian</Label>
                  <p className="mt-1">{selectedRegistration.queueNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Pendaftaran</Label>
                  <p className="mt-1">
                    {new Date(selectedRegistration.registrationDate).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Nama Pasien</Label>
                <p className="mt-1">{selectedRegistration.patientName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Pelayanan</Label>
                  <p className="mt-1">
                    {selectedRegistration.serviceType === 'rawat_jalan' && 'Rawat Jalan'}
                    {selectedRegistration.serviceType === 'rawat_inap' && 'Rawat Inap'}
                    {selectedRegistration.serviceType === 'gawat_darurat' && 'Gawat Darurat'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departemen</Label>
                  <p className="mt-1">{selectedRegistration.department.replace('poli-', 'Poli ').replace('_', ' ')}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Dokter Penanggung Jawab</Label>
                <p className="mt-1">{selectedRegistration.doctor}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Catatan</Label>
                <p className="mt-1">{selectedRegistration.notes || '-'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge 
                    variant={
                      selectedRegistration.status === 'daftar' ? 'default' :
                      selectedRegistration.status === 'periksa' ? 'secondary' :
                      selectedRegistration.status === 'selesai' ? 'outline' :
                      'destructive'
                    }
                  >
                    {selectedRegistration.status === 'daftar' && 'Terdaftar'}
                    {selectedRegistration.status === 'periksa' && 'Sedang Diperiksa'}
                    {selectedRegistration.status === 'selesai' && 'Selesai'}
                    {selectedRegistration.status === 'batal' && 'Dibatalkan'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Registration Form Component
const RegistrationForm: React.FC = () => {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="patient">Pilih Pasien</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Cari atau pilih pasien..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ahmad">Ahmad Fauzi (MR-1234567890)</SelectItem>
            <SelectItem value="siti">Siti Nurhaliza (MR-1234567891)</SelectItem>
            <SelectItem value="budi">Budi Santoso (MR-1234567892)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="serviceType">Jenis Pelayanan</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis pelayanan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rawat_jalan">Rawat Jalan</SelectItem>
              <SelectItem value="rawat_inap">Rawat Inap</SelectItem>
              <SelectItem value="gawat_darurat">Gawat Darurat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Departemen</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poli-internal">Poli Internal</SelectItem>
              <SelectItem value="poli-kandungan">Poli Kandungan</SelectItem>
              <SelectItem value="poli-anak">Poli Anak</SelectItem>
              <SelectItem value="poli-bedah">Poli Bedah</SelectItem>
              <SelectItem value="poli-gigi">Poli Gigi</SelectItem>
              <SelectItem value="igd">IGD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="doctor">Dokter Penanggung Jawab</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih dokter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dr-budi">dr. Budi Santoso</SelectItem>
            <SelectItem value="dr-sri">dr. Sri Lestari</SelectItem>
            <SelectItem value="dr-andi">dr. Andi Pratama</SelectItem>
            <SelectItem value="dr-mega">dr. Mega Ayu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Catatan</Label>
        <Input id="notes" placeholder="Catatan tambahan untuk pendaftaran" />
      </div>
    </div>
  );
};

export default RegistrationManagement;
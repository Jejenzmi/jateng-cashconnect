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
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  HeartPulse,
  Syringe,
  Pill
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  registrationId: string;
  registrationDate: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const MedicalRecordManagement: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        patientId: '1',
        patientName: 'Ahmad Fauzi',
        doctorId: 'd1',
        doctorName: 'dr. Budi Santoso',
        registrationId: 'r1',
        registrationDate: '2026-04-19 08:30:00',
        chiefComplaint: 'Sesak napas',
        historyOfPresentIllness: 'Pasien mengeluh sesak napas sejak 2 hari yang lalu...',
        physicalExam: 'TD: 120/80 mmHg, N: 80x/mnt, RR: 20x/mnt, T: 36.5°C',
        diagnosis: 'Bronkhitis akut',
        treatment: 'Diberikan antibiotik dan ekspektoran',
        notes: 'Kontrol 1 minggu kemudian',
        createdAt: '2026-04-19 09:15:00',
        updatedAt: '2026-04-19 09:15:00',
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'Siti Nurhaliza',
        doctorId: 'd2',
        doctorName: 'dr. Sri Lestari',
        registrationId: 'r2',
        registrationDate: '2026-04-19 09:45:00',
        chiefComplaint: 'Nyeri perut bagian kanan bawah',
        historyOfPresentIllness: 'Pasien mengeluh nyeri perut kanan bawah sejak 1 hari yang lalu...',
        physicalExam: 'TD: 110/70 mmHg, N: 85x/mnt, RR: 22x/mnt, T: 37.2°C',
        diagnosis: 'Apendisitis akut',
        treatment: 'Dirujuk ke bedah untuk evaluasi lebih lanjut',
        notes: 'Perlu tindakan segera',
        createdAt: '2026-04-19 10:30:00',
        updatedAt: '2026-04-19 10:30:00',
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'Budi Santoso',
        doctorId: 'd1',
        doctorName: 'dr. Budi Santoso',
        registrationId: 'r3',
        registrationDate: '2026-04-18 14:30:00',
        chiefComplaint: 'Demam dan batuk',
        historyOfPresentIllness: 'Pasien mengeluh demam dan batuk sejak 3 hari yang lalu...',
        physicalExam: 'TD: 115/75 mmHg, N: 88x/mnt, RR: 20x/mnt, T: 37.8°C',
        diagnosis: 'Infeksi saluran pernapasan atas',
        treatment: 'Diberikan obat penurun panas dan ekspektoran',
        notes: 'Kontrol bila gejala tidak membaik',
        createdAt: '2026-04-18 15:00:00',
        updatedAt: '2026-04-18 15:00:00',
      },
    ];
    setMedicalRecords(mockRecords);
    setFilteredRecords(mockRecords);
  }, []);

  useEffect(() => {
    const results = medicalRecords.filter(record =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(results);
  }, [searchTerm, medicalRecords]);

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    navigate(`/medical-records/edit/${record.id}`);
  };

  const handleDeleteRecord = (id: string) => {
    setMedicalRecords(medicalRecords.filter(record => record.id !== id));
    setFilteredRecords(filteredRecords.filter(record => record.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Rekam Medis</h1>
        <p className="text-muted-foreground">
          Kelola rekam medis pasien, diagnosa, dan riwayat pengobatan
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Rekam Terbaru</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama pasien, keluhan utama, atau diagnosa..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Rekam Medis
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Rekam Medis Baru</DialogTitle>
                  <DialogDescription>
                    Isi formulir di bawah untuk membuat rekam medis pasien
                  </DialogDescription>
                </DialogHeader>
                <MedicalRecordForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rekam Medis Terbaru</CardTitle>
              <CardDescription>
                {filteredRecords.length} rekam medis ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Keluhan Utama</TableHead>
                    <TableHead>Diagnosa</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.patientName}</TableCell>
                      <TableCell>{record.chiefComplaint.substring(0, 30)}{record.chiefComplaint.length > 30 ? '...' : ''}</TableCell>
                      <TableCell>{record.diagnosis.substring(0, 30)}{record.diagnosis.length > 30 ? '...' : ''}</TableCell>
                      <TableCell>{record.doctorName}</TableCell>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRecord(record.id)}
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
              <CardTitle>Riwayat Rekam Medis</CardTitle>
              <CardDescription>
                Seluruh riwayat rekam medis pasien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Keluhan Utama</TableHead>
                    <TableHead>Diagnosa</TableHead>
                    <TableHead>Dokter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{record.patientName}</TableCell>
                      <TableCell>{record.chiefComplaint.substring(0, 40)}{record.chiefComplaint.length > 40 ? '...' : ''}</TableCell>
                      <TableCell>{record.diagnosis.substring(0, 40)}{record.diagnosis.length > 40 ? '...' : ''}</TableCell>
                      <TableCell>{record.doctorName}</TableCell>
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
                <CardTitle className="text-sm font-medium">Total Rekam</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicalRecords.length}</div>
                <p className="text-xs text-muted-foreground">
                  Rekam medis dibuat
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {medicalRecords.filter(r => 
                    new Date(r.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Rekam hari ini
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dokter Teraktif</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Array.from(
                    medicalRecords.reduce((acc, record) => {
                      acc.set(record.doctorName, (acc.get(record.doctorName) || 0) + 1);
                      return acc;
                    }, new Map<string, number>())
                  ).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(' ')[1] || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paling banyak rekam
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diagnosa Umum</CardTitle>
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Array.from(
                    medicalRecords.reduce((acc, record) => {
                      acc.set(record.diagnosis, (acc.get(record.diagnosis) || 0) + 1);
                      return acc;
                    }, new Map<string, number>())
                  ).sort((a, b) => b[1] - a[1])[0]?.[0]?.substring(0, 10) || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Diagnosa terbanyak
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Diagnosa Terbanyak</CardTitle>
              <CardDescription>
                Distribusi diagnosa berdasarkan frekuensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(
                  medicalRecords.reduce((acc, record) => {
                    acc.set(record.diagnosis, (acc.get(record.diagnosis) || 0) + 1);
                    return acc;
                  }, new Map<string, number>())
                )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([diagnosis, count]) => (
                  <div key={diagnosis} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{diagnosis}</span>
                      <span className="text-sm text-muted-foreground">{count} kasus</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(count / medicalRecords.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Medical Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Rekam Medis</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang rekam medis pasien
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Pasien</Label>
                  <p className="mt-1">{selectedRecord.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dokter Penanggung Jawab</Label>
                  <p className="mt-1">{selectedRecord.doctorName}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                <p className="mt-1">{new Date(selectedRecord.createdAt).toLocaleString('id-ID')}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Keluhan Utama</Label>
                <p className="mt-1">{selectedRecord.chiefComplaint}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Riwayat Penyakit Sekarang</Label>
                <p className="mt-1">{selectedRecord.historyOfPresentIllness}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Pemeriksaan Fisik</Label>
                <p className="mt-1">{selectedRecord.physicalExam}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Diagnosa</Label>
                <p className="mt-1">{selectedRecord.diagnosis}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Penanganan/Tindakan</Label>
                <p className="mt-1">{selectedRecord.treatment}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Catatan Tambahan</Label>
                <p className="mt-1">{selectedRecord.notes || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Medical Record Form Component
const MedicalRecordForm: React.FC = () => {
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
        <Label htmlFor="chiefComplaint">Keluhan Utama</Label>
        <Textarea 
          id="chiefComplaint" 
          placeholder="Jelaskan keluhan utama pasien..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="historyOfPresentIllness">Riwayat Penyakit Sekarang</Label>
        <Textarea 
          id="historyOfPresentIllness" 
          placeholder="Jelaskan riwayat penyakit sekarang pasien..."
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="physicalExam">Pemeriksaan Fisik</Label>
        <Textarea 
          id="physicalExam" 
          placeholder="Catat hasil pemeriksaan fisik (tekanan darah, nadi, suhu, dll)..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="diagnosis">Diagnosa</Label>
        <Input 
          id="diagnosis" 
          placeholder="Masukkan diagnosa utama..." 
        />
      </div>
      
      <div>
        <Label htmlFor="treatment">Penanganan/Tindakan</Label>
        <Textarea 
          id="treatment" 
          placeholder="Deskripsikan penanganan atau tindakan yang diberikan..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea 
          id="notes" 
          placeholder="Catatan tambahan lainnya..."
          rows={2}
        />
      </div>
    </div>
  );
};

export default MedicalRecordManagement;
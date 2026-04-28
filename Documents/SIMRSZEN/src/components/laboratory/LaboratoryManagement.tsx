import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Calendar,
  Syringe,
  FileText,
  Eye,
  TestTube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LabTest {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  doctor: string;
  requestedDate: string;
  completedDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  result?: string;
}

const LaboratoryManagement: React.FC = () => {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [filteredLabTests, setFilteredLabTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockLabTests: LabTest[] = [
      {
        id: '1',
        testName: 'Complete Blood Count (CBC)',
        patientId: 'P-001',
        patientName: 'Ahmad Fauzi',
        doctor: 'Dr. Budi Santoso',
        requestedDate: '2024-04-15',
        completedDate: '',
        status: 'in-progress'
      },
      {
        id: '2',
        testName: 'Liver Function Test',
        patientId: 'P-002',
        patientName: 'Siti Nurhaliza',
        doctor: 'Dr. Ratna Sari',
        requestedDate: '2024-04-16',
        completedDate: '2024-04-17',
        status: 'completed',
        result: 'Normal range detected. No abnormalities noted.'
      },
      {
        id: '3',
        testName: 'Kidney Function Test',
        patientId: 'P-003',
        patientName: 'Budi Santoso',
        doctor: 'Dr. Andi Pratama',
        requestedDate: '2024-04-10',
        completedDate: '',
        status: 'pending'
      },
      {
        id: '4',
        testName: 'Lipid Profile',
        patientId: 'P-004',
        patientName: 'Rina Kartika',
        doctor: 'Dr. Maya Putri',
        requestedDate: '2024-04-17',
        completedDate: '',
        status: 'pending'
      }
    ];
    
    setLabTests(mockLabTests);
    setFilteredLabTests(mockLabTests);
  }, []);

  useEffect(() => {
    const results = labTests.filter(test =>
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLabTests(results);
  }, [searchTerm, labTests]);

  const handleViewLabTest = (test: LabTest) => {
    setSelectedLabTest(test);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    setLabTests(labTests.map(test => 
      test.id === id ? { ...test, status } : test
    ));
    setFilteredLabTests(filteredLabTests.map(test => 
      test.id === id ? { ...test, status } : test
    ));
  };

  const handleAddResult = (id: string, result: string) => {
    setLabTests(labTests.map(test => 
      test.id === id ? { ...test, result, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : test
    ));
    setFilteredLabTests(filteredLabTests.map(test => 
      test.id === id ? { ...test, result, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : test
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Laboratorium</h1>
        <p className="text-muted-foreground">
          Kelola pemeriksaan laboratorium, hasil, dan status
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pasien, uji lab, dokter..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Uji Lab
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Permintaan Uji Laboratorium Baru</DialogTitle>
              <DialogDescription>
                Tambahkan permintaan uji laboratorium untuk pasien
              </DialogDescription>
            </DialogHeader>
            <LabTestForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Uji Laboratorium</CardTitle>
          <CardDescription>
            {filteredLabTests.length} permintaan uji laboratorium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uji Lab</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Tanggal Diminta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLabTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      {test.testName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {test.patientName} (ID: {test.patientId})
                    </div>
                  </TableCell>
                  <TableCell>{test.doctor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(test.requestedDate).toLocaleDateString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        test.status === 'pending' ? 'outline' : 
                        test.status === 'in-progress' ? 'secondary' : 
                        test.status === 'completed' ? 'success' : 
                        'destructive'
                      }
                    >
                      {test.status === 'pending' ? 'Menunggu' : 
                       test.status === 'in-progress' ? 'Dalam Proses' : 
                       test.status === 'completed' ? 'Selesai' : 
                       'Dibatalkan'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewLabTest(test)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(test.id, 'completed')}
                        disabled={test.status === 'completed' || test.status === 'cancelled'}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Lab Test Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Uji Laboratorium</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang uji laboratorium
            </DialogDescription>
          </DialogHeader>
          {selectedLabTest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Uji</Label>
                  <p className="mt-1">{selectedLabTest.testName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nama Pasien</Label>
                  <p className="mt-1">{selectedLabTest.patientName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID Pasien</Label>
                  <p className="mt-1">{selectedLabTest.patientId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dokter Penanggung Jawab</Label>
                  <p className="mt-1">{selectedLabTest.doctor}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Diminta</Label>
                  <p className="mt-1">{new Date(selectedLabTest.requestedDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Selesai</Label>
                  <p className="mt-1">
                    {selectedLabTest.completedDate ? 
                      new Date(selectedLabTest.completedDate).toLocaleDateString('id-ID') : 
                      'Belum selesai'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge 
                    variant={
                      selectedLabTest.status === 'pending' ? 'outline' : 
                      selectedLabTest.status === 'in-progress' ? 'secondary' : 
                      selectedLabTest.status === 'completed' ? 'success' : 
                      'destructive'
                    }
                  >
                    {selectedLabTest.status === 'pending' ? 'Menunggu' : 
                     selectedLabTest.status === 'in-progress' ? 'Dalam Proses' : 
                     selectedLabTest.status === 'completed' ? 'Selesai' : 
                     'Dibatalkan'}
                  </Badge>
                </div>
              </div>
              
              {selectedLabTest.result && (
                <div>
                  <Label className="text-sm font-medium">Hasil Uji</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p>{selectedLabTest.result}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Lab Test Form Component
const LabTestForm: React.FC = () => {
  const [testName, setTestName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctor, setDoctor] = useState('');

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="testName">Nama Uji Laboratorium</Label>
        <Select value={testName} onValueChange={setTestName}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis uji laboratorium..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cbc">Complete Blood Count (CBC)</SelectItem>
            <SelectItem value="liver-function">Liver Function Test</SelectItem>
            <SelectItem value="kidney-function">Kidney Function Test</SelectItem>
            <SelectItem value="lipid-profile">Lipid Profile</SelectItem>
            <SelectItem value="thyroid-test">Thyroid Function Test</SelectItem>
            <SelectItem value="glucose">Blood Glucose</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="patient">Pilih Pasien</Label>
        <Select value={patientId} onValueChange={setPatientId}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih pasien..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P-001">Ahmad Fauzi (P-001)</SelectItem>
            <SelectItem value="P-002">Siti Nurhaliza (P-002)</SelectItem>
            <SelectItem value="P-003">Budi Santoso (P-003)</SelectItem>
            <SelectItem value="P-004">Rina Kartika (P-004)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="doctor">Dokter Penanggung Jawab</Label>
        <Select value={doctor} onValueChange={setDoctor}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih dokter..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dr-budi">Dr. Budi Santoso</SelectItem>
            <SelectItem value="dr-ratna">Dr. Ratna Sari</SelectItem>
            <SelectItem value="dr-andi">Dr. Andi Pratama</SelectItem>
            <SelectItem value="dr-maya">Dr. Maya Putri</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LaboratoryManagement;
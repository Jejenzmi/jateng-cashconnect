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
  Scan,
  FileText,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ImagingRequest {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  doctor: string;
  requestedDate: string;
  completedDate: string;
  status: 'requested' | 'in-progress' | 'completed' | 'cancelled';
  result?: string;
  imageFiles?: string[];
}

const RadiologyManagement: React.FC = () => {
  const [imagingRequests, setImagingRequests] = useState<ImagingRequest[]>([]);
  const [filteredImagingRequests, setFilteredImagingRequests] = useState<ImagingRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImagingRequest, setSelectedImagingRequest] = useState<ImagingRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockImagingRequests: ImagingRequest[] = [
      {
        id: '1',
        testName: 'X-Ray Thorax',
        patientId: 'P-001',
        patientName: 'Ahmad Fauzi',
        doctor: 'Dr. Budi Santoso',
        requestedDate: '2024-04-15',
        completedDate: '',
        status: 'in-progress'
      },
      {
        id: '2',
        testName: 'CT Scan Abdomen',
        patientId: 'P-002',
        patientName: 'Siti Nurhaliza',
        doctor: 'Dr. Ratna Sari',
        requestedDate: '2024-04-16',
        completedDate: '2024-04-17',
        status: 'completed',
        result: 'No significant findings. Normal CT scan abdomen.',
        imageFiles: ['ct-scan-1.jpg', 'ct-scan-2.jpg']
      },
      {
        id: '3',
        testName: 'MRI Brain',
        patientId: 'P-003',
        patientName: 'Budi Santoso',
        doctor: 'Dr. Andi Pratama',
        requestedDate: '2024-04-10',
        completedDate: '',
        status: 'requested'
      },
      {
        id: '4',
        testName: 'Ultrasound Abdomen',
        patientId: 'P-004',
        patientName: 'Rina Kartika',
        doctor: 'Dr. Maya Putri',
        requestedDate: '2024-04-17',
        completedDate: '',
        status: 'requested'
      }
    ];
    
    setImagingRequests(mockImagingRequests);
    setFilteredImagingRequests(mockImagingRequests);
  }, []);

  useEffect(() => {
    const results = imagingRequests.filter(request =>
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImagingRequests(results);
  }, [searchTerm, imagingRequests]);

  const handleViewImagingRequest = (request: ImagingRequest) => {
    setSelectedImagingRequest(request);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, status: 'requested' | 'in-progress' | 'completed' | 'cancelled') => {
    setImagingRequests(imagingRequests.map(request => 
      request.id === id ? { ...request, status } : request
    ));
    setFilteredImagingRequests(filteredImagingRequests.map(request => 
      request.id === id ? { ...request, status } : request
    ));
  };

  const handleAddResult = (id: string, result: string) => {
    setImagingRequests(imagingRequests.map(request => 
      request.id === id ? { ...request, result, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : request
    ));
    setFilteredImagingRequests(filteredImagingRequests.map(request => 
      request.id === id ? { ...request, result, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : request
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Radiologi</h1>
        <p className="text-muted-foreground">
          Kelola permintaan imaging, hasil, dan status
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pasien, uji imaging, dokter..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Uji Imaging
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Permintaan Uji Radiologi Baru</DialogTitle>
              <DialogDescription>
                Tambahkan permintaan uji radiologi untuk pasien
              </DialogDescription>
            </DialogHeader>
            <ImagingRequestForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Uji Radiologi</CardTitle>
          <CardDescription>
            {filteredImagingRequests.length} permintaan uji radiologi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uji Imaging</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Tanggal Diminta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImagingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4" />
                      {request.testName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {request.patientName} (ID: {request.patientId})
                    </div>
                  </TableCell>
                  <TableCell>{request.doctor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(request.requestedDate).toLocaleDateString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        request.status === 'requested' ? 'outline' : 
                        request.status === 'in-progress' ? 'secondary' : 
                        request.status === 'completed' ? 'success' : 
                        'destructive'
                      }
                    >
                      {request.status === 'requested' ? 'Diminta' : 
                       request.status === 'in-progress' ? 'Dalam Proses' : 
                       request.status === 'completed' ? 'Selesai' : 
                       'Dibatalkan'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewImagingRequest(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(request.id, 'completed')}
                        disabled={request.status === 'completed' || request.status === 'cancelled'}
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

      {/* Detail Imaging Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Uji Radiologi</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang uji radiologi
            </DialogDescription>
          </DialogHeader>
          {selectedImagingRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Uji</Label>
                  <p className="mt-1">{selectedImagingRequest.testName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nama Pasien</Label>
                  <p className="mt-1">{selectedImagingRequest.patientName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID Pasien</Label>
                  <p className="mt-1">{selectedImagingRequest.patientId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dokter Penanggung Jawab</Label>
                  <p className="mt-1">{selectedImagingRequest.doctor}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Diminta</Label>
                  <p className="mt-1">{new Date(selectedImagingRequest.requestedDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Selesai</Label>
                  <p className="mt-1">
                    {selectedImagingRequest.completedDate ? 
                      new Date(selectedImagingRequest.completedDate).toLocaleDateString('id-ID') : 
                      'Belum selesai'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge 
                    variant={
                      selectedImagingRequest.status === 'requested' ? 'outline' : 
                      selectedImagingRequest.status === 'in-progress' ? 'secondary' : 
                      selectedImagingRequest.status === 'completed' ? 'success' : 
                      'destructive'
                    }
                  >
                    {selectedImagingRequest.status === 'requested' ? 'Diminta' : 
                     selectedImagingRequest.status === 'in-progress' ? 'Dalam Proses' : 
                     selectedImagingRequest.status === 'completed' ? 'Selesai' : 
                     'Dibatalkan'}
                  </Badge>
                </div>
              </div>
              
              {selectedImagingRequest.result && (
                <div>
                  <Label className="text-sm font-medium">Hasil Uji</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p>{selectedImagingRequest.result}</p>
                  </div>
                </div>
              )}
              
              {selectedImagingRequest.imageFiles && selectedImagingRequest.imageFiles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">File Gambar</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {selectedImagingRequest.imageFiles.map((file, index) => (
                      <div key={index} className="border rounded p-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2 w-full">
                          Lihat Gambar
                        </Button>
                      </div>
                    ))}
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

// Imaging Request Form Component
const ImagingRequestForm: React.FC = () => {
  const [testName, setTestName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctor, setDoctor] = useState('');

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="testName">Nama Uji Radiologi</Label>
        <Select value={testName} onValueChange={setTestName}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis uji radiologi..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xray-thorax">X-Ray Thorax</SelectItem>
            <SelectItem value="xray-abdomen">X-Ray Abdomen</SelectItem>
            <SelectItem value="ct-scan-brain">CT Scan Brain</SelectItem>
            <SelectItem value="ct-scan-abdomen">CT Scan Abdomen</SelectItem>
            <SelectItem value="mri-brain">MRI Brain</SelectItem>
            <SelectItem value="mri-spine">MRI Spine</SelectItem>
            <SelectItem value="ultrasound-abdomen">Ultrasound Abdomen</SelectItem>
            <SelectItem value="ultrasound-pelvis">Ultrasound Pelvis</SelectItem>
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

export default RadiologyManagement;
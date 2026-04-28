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
  Baby
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Immunization {
  id: string;
  patientId: string;
  patientName: string;
  vaccineType: string;
  batchNumber: string;
  administeredDate: string;
  administeredBy: string;
  nextDueDate?: string;
  notes?: string;
  status: 'completed' | 'scheduled' | 'missed';
}

const ImmunizationManagement: React.FC = () => {
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [filteredImmunizations, setFilteredImmunizations] = useState<Immunization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImmunization, setSelectedImmunization] = useState<Immunization | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockImmunizations: Immunization[] = [
      {
        id: '1',
        patientId: 'P-001',
        patientName: 'Ahmad Fauzi',
        vaccineType: 'Hepatitis B',
        batchNumber: 'HB-2024-001',
        administeredDate: '2024-03-15',
        administeredBy: 'Suster Dewi',
        nextDueDate: '2024-06-15',
        notes: 'Tidak ada reaksi setelah vaksinasi',
        status: 'completed'
      },
      {
        id: '2',
        patientId: 'P-002',
        patientName: 'Siti Nurhaliza',
        vaccineType: 'BCG',
        batchNumber: 'BCG-2024-005',
        administeredDate: '2024-04-10',
        administeredBy: 'Dr. Budi Santoso',
        nextDueDate: '2025-04-10',
        notes: 'Reaksi lokal ringan',
        status: 'completed'
      },
      {
        id: '3',
        patientId: 'P-003',
        patientName: 'Budi Santoso',
        vaccineType: 'Polio',
        batchNumber: 'POL-2024-012',
        administeredDate: '2024-04-18',
        administeredBy: 'Suster Yuni',
        nextDueDate: '2024-07-18',
        status: 'scheduled'
      },
      {
        id: '4',
        patientId: 'P-004',
        patientName: 'Rina Kartika',
        vaccineType: 'Campak',
        batchNumber: 'CAM-2024-008',
        administeredDate: '',
        administeredBy: '',
        nextDueDate: '2024-05-01',
        notes: 'Terlewat karena sakit',
        status: 'missed'
      }
    ];
    
    setImmunizations(mockImmunizations);
    setFilteredImmunizations(mockImmunizations);
  }, []);

  useEffect(() => {
    const results = immunizations.filter(immunization =>
      immunization.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      immunization.vaccineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      immunization.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      immunization.administeredBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImmunizations(results);
  }, [searchTerm, immunizations]);

  const handleViewImmunization = (immunization: Immunization) => {
    setSelectedImmunization(immunization);
    setIsDialogOpen(true);
  };

  const handleMarkAsCompleted = (id: string) => {
    setImmunizations(immunizations.map(immunization => 
      immunization.id === id ? { ...immunization, status: 'completed', administeredDate: new Date().toISOString().split('T')[0] } : immunization
    ));
    setFilteredImmunizations(filteredImmunizations.map(immunization => 
      immunization.id === id ? { ...immunization, status: 'completed', administeredDate: new Date().toISOString().split('T')[0] } : immunization
    ));
  };

  const handleScheduleNext = (id: string, nextDate: string) => {
    setImmunizations(immunizations.map(immunization => 
      immunization.id === id ? { ...immunization, nextDueDate: nextDate } : immunization
    ));
    setFilteredImmunizations(filteredImmunizations.map(immunization => 
      immunization.id === id ? { ...immunization, nextDueDate: nextDate } : immunization
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Imunisasi</h1>
        <p className="text-muted-foreground">
          Kelola program imunisasi, jadwal, dan catatan vaksinasi
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pasien, jenis vaksin, batch..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Jadwal Imunisasi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Permintaan Imunisasi Baru</DialogTitle>
              <DialogDescription>
                Tambahkan jadwal imunisasi untuk pasien
              </DialogDescription>
            </DialogHeader>
            <ImmunizationForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal Imunisasi</CardTitle>
          <CardDescription>
            {filteredImmunizations.length} catatan imunisasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasien</TableHead>
                <TableHead>Jenis Vaksin</TableHead>
                <TableHead>No Batch</TableHead>
                <TableHead>Tanggal Dilaksanakan</TableHead>
                <TableHead>Diberikan Oleh</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImmunizations.map((immunization) => (
                <TableRow key={immunization.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {immunization.patientName} (ID: {immunization.patientId})
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Syringe className="h-4 w-4" />
                      {immunization.vaccineType}
                    </div>
                  </TableCell>
                  <TableCell>{immunization.batchNumber}</TableCell>
                  <TableCell>
                    {immunization.administeredDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(immunization.administeredDate).toLocaleDateString('id-ID')}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>{immunization.administeredBy}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        immunization.status === 'completed' ? 'success' : 
                        immunization.status === 'scheduled' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {immunization.status === 'completed' ? 'Selesai' : 
                       immunization.status === 'scheduled' ? 'Terjadwal' : 
                       'Terlewat'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewImmunization(immunization)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkAsCompleted(immunization.id)}
                        disabled={immunization.status === 'completed'}
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

      {/* Detail Immunization Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Imunisasi</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang imunisasi
            </DialogDescription>
          </DialogHeader>
          {selectedImmunization && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Pasien</Label>
                  <p className="mt-1">{selectedImmunization.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ID Pasien</Label>
                  <p className="mt-1">{selectedImmunization.patientId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Vaksin</Label>
                  <p className="mt-1">{selectedImmunization.vaccineType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nomor Batch</Label>
                  <p className="mt-1">{selectedImmunization.batchNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Dilaksanakan</Label>
                  <p className="mt-1">
                    {selectedImmunization.administeredDate ? 
                      new Date(selectedImmunization.administeredDate).toLocaleDateString('id-ID') : 
                      'Belum dilaksanakan'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Diberikan Oleh</Label>
                  <p className="mt-1">{selectedImmunization.administeredBy || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Berikutnya</Label>
                  <p className="mt-1">
                    {selectedImmunization.nextDueDate ? 
                      new Date(selectedImmunization.nextDueDate).toLocaleDateString('id-ID') : 
                      'Tidak ada jadwal'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={
                        selectedImmunization.status === 'completed' ? 'success' : 
                        selectedImmunization.status === 'scheduled' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {selectedImmunization.status === 'completed' ? 'Selesai' : 
                       selectedImmunization.status === 'scheduled' ? 'Terjadwal' : 
                       'Terlewat'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedImmunization.notes && (
                <div>
                  <Label className="text-sm font-medium">Catatan</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p>{selectedImmunization.notes}</p>
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

// Immunization Form Component
const ImmunizationForm: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [administeredDate, setAdministeredDate] = useState('');
  const [administeredBy, setAdministeredBy] = useState('');

  return (
    <div className="grid gap-4 py-4">
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
        <Label htmlFor="vaccineType">Jenis Vaksin</Label>
        <Select value={vaccineType} onValueChange={setVaccineType}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis vaksin..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepatitis-b">Hepatitis B</SelectItem>
            <SelectItem value="bcg">BCG</SelectItem>
            <SelectItem value="polio">Polio (IPV/OPV)</SelectItem>
            <SelectItem value="dpt">DPT</SelectItem>
            <SelectItem value="campak">Campak</SelectItem>
            <SelectItem value="hib">Hib</SelectItem>
            <SelectItem value="pneumonia">Pneumonia (PCV)</SelectItem>
            <SelectItem value="rotavirus">Rotavirus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="batchNumber">Nomor Batch Vaksin</Label>
        <Input 
          id="batchNumber" 
          value={batchNumber} 
          onChange={(e) => setBatchNumber(e.target.value)} 
          placeholder="Contoh: HB-2024-001" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="administeredDate">Tanggal Dilaksanakan</Label>
          <Input 
            id="administeredDate" 
            type="date" 
            value={administeredDate} 
            onChange={(e) => setAdministeredDate(e.target.value)} 
          />
        </div>
        
        <div>
          <Label htmlFor="administeredBy">Diberikan Oleh</Label>
          <Select value={administeredBy} onValueChange={setAdministeredBy}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih petugas..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-budi">Dr. Budi Santoso</SelectItem>
              <SelectItem value="suster-dewi">Suster Dewi</SelectItem>
              <SelectItem value="suster-yuni">Suster Yuni</SelectItem>
              <SelectItem value="dr-maya">Dr. Maya Putri</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationManagement;
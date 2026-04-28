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
  Users,
  FileText,
  Eye,
  Baby,
  Heart,
  Droplets
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KIARecord {
  id: string;
  motherId: string;
  motherName: string;
  childName?: string;
  pregnancyWeek: number;
  dueDate?: string;
  birthDate?: string;
  status: 'pregnant' | 'delivered' | 'postpartum';
  lastCheckup: string;
  nextAppointment: string;
  healthNotes?: string;
  riskFactors?: string[];
}

const KIAManagement: React.FC = () => {
  const [kiaRecords, setKiaRecords] = useState<KIARecord[]>([]);
  const [filteredKiaRecords, setFilteredKiaRecords] = useState<KIARecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKiaRecord, setSelectedKiaRecord] = useState<KIARecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockKIARrecords: KIARecord[] = [
      {
        id: '1',
        motherId: 'M-001',
        motherName: 'Siti Aminah',
        childName: 'Arif Pratama',
        pregnancyWeek: 36,
        dueDate: '2024-05-20',
        birthDate: '2024-05-15',
        status: 'delivered',
        lastCheckup: '2024-05-10',
        nextAppointment: '',
        healthNotes: 'Persalinan normal, bayi sehat',
        riskFactors: []
      },
      {
        id: '2',
        motherId: 'M-002',
        motherName: 'Rina Kartika',
        pregnancyWeek: 28,
        dueDate: '2024-07-15',
        status: 'pregnant',
        lastCheckup: '2024-04-10',
        nextAppointment: '2024-04-24',
        healthNotes: 'Kehamilan normal, tekanan darah stabil',
        riskFactors: ['anemia']
      },
      {
        id: '3',
        motherId: 'M-003',
        motherName: 'Dewi Lestari',
        pregnancyWeek: 12,
        dueDate: '2024-09-05',
        status: 'pregnant',
        lastCheckup: '2024-04-05',
        nextAppointment: '2024-04-19',
        healthNotes: 'Kehamilan normal, perlu kontrol gula darah',
        riskFactors: ['diabetes']
      },
      {
        id: '4',
        motherId: 'M-004',
        motherName: 'Yuni Susanti',
        childName: 'Bunga Citra',
        pregnancyWeek: 40,
        dueDate: '2024-04-20',
        birthDate: '',
        status: 'postpartum',
        lastCheckup: '2024-04-18',
        nextAppointment: '2024-04-25',
        healthNotes: 'Menyusui aktif, kondisi ibu baik',
        riskFactors: []
      }
    ];
    
    setKiaRecords(mockKIARrecords);
    setFilteredKiaRecords(mockKIARrecords);
  }, []);

  useEffect(() => {
    const results = kiaRecords.filter(record =>
      record.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.childName && record.childName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.motherId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKiaRecords(results);
  }, [searchTerm, kiaRecords]);

  const handleViewKIARecord = (record: KIARecord) => {
    setSelectedKiaRecord(record);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, status: 'pregnant' | 'delivered' | 'postpartum') => {
    setKiaRecords(kiaRecords.map(record => 
      record.id === id ? { ...record, status } : record
    ));
    setFilteredKiaRecords(filteredKiaRecords.map(record => 
      record.id === id ? { ...record, status } : record
    ));
  };

  const handleScheduleAppointment = (id: string, appointmentDate: string) => {
    setKiaRecords(kiaRecords.map(record => 
      record.id === id ? { ...record, nextAppointment: appointmentDate } : record
    ));
    setFilteredKiaRecords(filteredKiaRecords.map(record => 
      record.id === id ? { ...record, nextAppointment: appointmentDate } : record
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen KIA (Kartu Ibu dan Anak)</h1>
        <p className="text-muted-foreground">
          Kelola kartu ibu dan anak, pemeriksaan kehamilan, dan data kelahiran
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari ibu, anak, nomor rekam..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Rekam KIA
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Rekam KIA Baru</DialogTitle>
              <DialogDescription>
                Tambahkan rekam kartu ibu dan anak baru
              </DialogDescription>
            </DialogHeader>
            <KIAForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Rekam KIA</CardTitle>
          <CardDescription>
            {filteredKiaRecords.length} rekam kartu ibu dan anak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ibu</TableHead>
                <TableHead>Anak</TableHead>
                <TableHead>Minggu Kehamilan</TableHead>
                <TableHead>Tanggal Perkiraan Lahir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKiaRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {record.motherName} (ID: {record.motherId})
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.childName ? (
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4" />
                        {record.childName}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.pregnancyWeek} minggu
                  </TableCell>
                  <TableCell>
                    {record.dueDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(record.dueDate).toLocaleDateString('id-ID')}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        record.status === 'pregnant' ? 'secondary' : 
                        record.status === 'delivered' ? 'success' : 
                        'outline'
                      }
                    >
                      {record.status === 'pregnant' ? 'Hamil' : 
                       record.status === 'delivered' ? 'Telah Melahirkan' : 
                       'Masa Nifas'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewKIARecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(record.id, 'delivered')}
                        disabled={record.status === 'delivered'}
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

      {/* Detail KIA Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Rekam KIA</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang kartu ibu dan anak
            </DialogDescription>
          </DialogHeader>
          {selectedKiaRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Ibu</Label>
                  <p className="mt-1">{selectedKiaRecord.motherName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ID Ibu</Label>
                  <p className="mt-1">{selectedKiaRecord.motherId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Anak</Label>
                  <p className="mt-1">{selectedKiaRecord.childName || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Minggu Kehamilan</Label>
                  <p className="mt-1">{selectedKiaRecord.pregnancyWeek} minggu</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Perkiraan Lahir</Label>
                  <p className="mt-1">
                    {selectedKiaRecord.dueDate ? 
                      new Date(selectedKiaRecord.dueDate).toLocaleDateString('id-ID') : 
                      'Belum ditentukan'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Lahir</Label>
                  <p className="mt-1">
                    {selectedKiaRecord.birthDate ? 
                      new Date(selectedKiaRecord.birthDate).toLocaleDateString('id-ID') : 
                      'Belum lahir'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={
                        selectedKiaRecord.status === 'pregnant' ? 'secondary' : 
                        selectedKiaRecord.status === 'delivered' ? 'success' : 
                        'outline'
                      }
                    >
                      {selectedKiaRecord.status === 'pregnant' ? 'Hamil' : 
                       selectedKiaRecord.status === 'delivered' ? 'Telah Melahirkan' : 
                       'Masa Nifas'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pemeriksaan Terakhir</Label>
                  <p className="mt-1">{new Date(selectedKiaRecord.lastCheckup).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Janji Berikutnya</Label>
                  <p className="mt-1">
                    {selectedKiaRecord.nextAppointment ? 
                      new Date(selectedKiaRecord.nextAppointment).toLocaleDateString('id-ID') : 
                      'Tidak ada jadwal'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Faktor Risiko</Label>
                  <div className="mt-1">
                    {selectedKiaRecord.riskFactors && selectedKiaRecord.riskFactors.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedKiaRecord.riskFactors.map((factor, idx) => (
                          <Badge key={idx} variant="destructive">{factor}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span>Tidak ada faktor risiko</span>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedKiaRecord.healthNotes && (
                <div>
                  <Label className="text-sm font-medium">Catatan Kesehatan</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p>{selectedKiaRecord.healthNotes}</p>
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

// KIA Form Component
const KIAForm: React.FC = () => {
  const [motherId, setMotherId] = useState('');
  const [motherName, setMotherName] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lastCheckup, setLastCheckup] = useState('');

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="motherName">Nama Ibu</Label>
        <Input 
          id="motherName" 
          value={motherName} 
          onChange={(e) => setMotherName(e.target.value)} 
          placeholder="Nama lengkap ibu" 
        />
      </div>
      
      <div>
        <Label htmlFor="motherId">ID Ibu</Label>
        <Input 
          id="motherId" 
          value={motherId} 
          onChange={(e) => setMotherId(e.target.value)} 
          placeholder="Contoh: M-001" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pregnancyWeek">Minggu Kehamilan</Label>
          <Input 
            id="pregnancyWeek" 
            type="number" 
            value={pregnancyWeek} 
            onChange={(e) => setPregnancyWeek(e.target.value)} 
            placeholder="Minggu kehamilan saat ini" 
          />
        </div>
        
        <div>
          <Label htmlFor="dueDate">Tanggal Perkiraan Lahir</Label>
          <Input 
            id="dueDate" 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="lastCheckup">Tanggal Pemeriksaan Terakhir</Label>
        <Input 
          id="lastCheckup" 
          type="date" 
          value={lastCheckup} 
          onChange={(e) => setLastCheckup(e.target.value)} 
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Catatan Kesehatan</Label>
        <Textarea 
          id="notes" 
          placeholder="Catatan kesehatan ibu hamil" 
        />
      </div>
    </div>
  );
};

export default KIAManagement;
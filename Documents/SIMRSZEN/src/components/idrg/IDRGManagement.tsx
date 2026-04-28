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
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  FileText,
  Calculator,
  DollarSign
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface IDRGRule {
  id: string;
  code: string;
  description: string;
  baseWeight: number;
  adjustmentFactor?: number;
  group: string;
  subGroup?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IDRGPatientCase {
  id: string;
  patientId: string;
  medicalRecordId: string;
  idrgRuleId: string;
  admissionDate: string;
  dischargeDate: string;
  diagnosisCode: string;
  procedureCodes: string[];
  complications?: string;
  comorbidities?: string;
  totalDays: number;
  calculatedWeight: number;
  finalAmount: number;
  status: 'DRAFT' | 'CALCULATED' | 'SUBMITTED' | 'PAID';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    fullName: string;
    nik: string;
  };
  idrgRule: {
    code: string;
    description: string;
  };
}

const IDRGManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'cases'>('rules');
  const [idrgRules, setIdrgRules] = useState<IDRGRule[]>([]);
  const [idrgCases, setIdrgCases] = useState<IDRGPatientCase[]>([]);
  const [filteredRules, setFilteredRules] = useState<IDRGRule[]>([]);
  const [filteredCases, setFilteredCases] = useState<IDRGPatientCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRule, setSelectedRule] = useState<IDRGRule | null>(null);
  const [selectedCase, setSelectedCase] = useState<IDRGPatientCase | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isCaseDialogOpen, setIsCaseDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data untuk demonstrasi
  useEffect(() => {
    const mockRules: IDRGRule[] = [
      {
        id: '1',
        code: 'IDRG-001',
        description: 'Penyakit Jantung Koroner Tanpa Prosedur Mayor',
        baseWeight: 1.25,
        adjustmentFactor: 1.1,
        group: 'CARDIOLOGY',
        subGroup: 'CORONARY',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:45:00Z'
      },
      {
        id: '2',
        code: 'IDRG-002',
        description: 'Fraktur Tulang Panjang Dengan Pembedahan',
        baseWeight: 2.35,
        adjustmentFactor: 1.2,
        group: 'ORTHOPEDICS',
        subGroup: 'FRACTURE',
        isActive: true,
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z'
      }
    ];

    const mockCases: IDRGPatientCase[] = [
      {
        id: 'case-001',
        patientId: 'pat-001',
        medicalRecordId: 'med-001',
        idrgRuleId: '1',
        admissionDate: '2024-02-01T08:00:00Z',
        dischargeDate: '2024-02-05T10:00:00Z',
        diagnosisCode: 'I25.1',
        procedureCodes: ['1-123', '1-456'],
        complications: 'Tidak Ada',
        comorbidities: 'Hipertensi',
        totalDays: 4,
        calculatedWeight: 1.375,
        finalAmount: 5500000,
        status: 'PAID',
        notes: 'Pasien pulih dengan baik',
        createdAt: '2024-02-01T08:00:00Z',
        updatedAt: '2024-02-06T14:00:00Z',
        patient: {
          fullName: 'Ahmad Santoso',
          nik: '3201234567890123'
        },
        idrgRule: {
          code: 'IDRG-001',
          description: 'Penyakit Jantung Koroner Tanpa Prosedur Mayor'
        }
      },
      {
        id: 'case-002',
        patientId: 'pat-002',
        medicalRecordId: 'med-002',
        idrgRuleId: '2',
        admissionDate: '2024-02-10T07:30:00Z',
        dischargeDate: '2024-02-14T09:00:00Z',
        diagnosisCode: 'S72.1',
        procedureCodes: ['1-789'],
        complications: 'Infeksi Luka Operasi',
        comorbidities: 'Diabetes',
        totalDays: 4,
        calculatedWeight: 2.82,
        finalAmount: 11280000,
        status: 'SUBMITTED',
        notes: 'Menunggu pembayaran dari BPJS',
        createdAt: '2024-02-10T07:30:00Z',
        updatedAt: '2024-02-15T11:00:00Z',
        patient: {
          fullName: 'Siti Rahayu',
          nik: '3201234567890124'
        },
        idrgRule: {
          code: 'IDRG-002',
          description: 'Fraktur Tulang Panjang Dengan Pembedahan'
        }
      }
    ];

    setIdrgRules(mockRules);
    setIdrgCases(mockCases);
    setFilteredRules(mockRules);
    setFilteredCases(mockCases);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'rules') {
      const filtered = idrgRules.filter(rule => 
        rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.group.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRules(filtered);
    } else {
      const filtered = idrgCases.filter(cases => 
        cases.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cases.diagnosisCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cases.idrgRule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cases.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCases(filtered);
    }
  }, [searchTerm, activeTab, idrgRules, idrgCases]);

  const handleViewRule = (rule: IDRGRule) => {
    setSelectedRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleViewCase = (cases: IDRGPatientCase) => {
    setSelectedCase(cases);
    setIsCaseDialogOpen(true);
  };

  const handleAddRule = () => {
    // Tambahkan logika untuk menambah aturan iDRG
    toast.success('Fitur tambah aturan iDRG akan segera hadir');
  };

  const handleAddCase = () => {
    // Tambahkan logika untuk menambah kasus pasien iDRG
    toast.success('Fitur tambah kasus pasien iDRG akan segera hadir');
  };

  const handleUpdateCaseStatus = async (caseId: string, status: 'DRAFT' | 'CALCULATED' | 'SUBMITTED' | 'PAID', notes?: string) => {
    try {
      setLoading(true);
      // Simulasikan pemanggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Status kasus berhasil diperbarui menjadi ${status}`);
      
      // Update state lokal
      setIdrgCases(idrgCases.map(cases => 
        cases.id === caseId ? {...cases, status, notes: notes || cases.notes} : cases
      ));
      setFilteredCases(filteredCases.map(cases => 
        cases.id === caseId ? {...cases, status, notes: notes || cases.notes} : cases
      ));
    } catch (error: any) {
      toast.error('Gagal memperbarui status kasus');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'CALCULATED':
        return <Badge variant="default">Dihitung</Badge>;
      case 'SUBMITTED':
        return <Badge variant="outline">Diajukan</Badge>;
      case 'PAID':
        return <Badge variant="success">Dibayar</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Manajemen iDRG</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola aturan Indonesian Diagnosis Related Groups dan kasus pasien
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'rules' | 'cases')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Aturan iDRG</TabsTrigger>
          <TabsTrigger value="cases">Kasus Pasien</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Aturan iDRG</CardTitle>
                  <CardDescription>
                    Daftar aturan untuk klasifikasi kasus berdasarkan diagnosis dan tindakan
                  </CardDescription>
                </div>
                <Button onClick={handleAddRule}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Aturan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari aturan iDRG..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kelompok</TableHead>
                    <TableHead>Bobot Dasar</TableHead>
                    <TableHead>Faktor Penyesuaian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.code}</TableCell>
                      <TableCell>{rule.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.group}</Badge>
                      </TableCell>
                      <TableCell>{rule.baseWeight.toFixed(2)}</TableCell>
                      <TableCell>{rule.adjustmentFactor ? rule.adjustmentFactor.toFixed(2) : '-'}</TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="destructive">Tidak Aktif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Kasus Pasien iDRG</CardTitle>
                  <CardDescription>
                    Daftar kasus pasien yang dikenakan tarif berdasarkan sistem iDRG
                  </CardDescription>
                </div>
                <Button onClick={handleAddCase}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Kasus
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kasus pasien..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Aturan iDRG</TableHead>
                    <TableHead>Lama Hari</TableHead>
                    <TableHead>Bobot</TableHead>
                    <TableHead>Total Biaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((cases) => (
                    <TableRow key={cases.id}>
                      <TableCell className="font-medium">{cases.patient.fullName}</TableCell>
                      <TableCell>{cases.diagnosisCode}</TableCell>
                      <TableCell>{cases.idrgRule.code}</TableCell>
                      <TableCell>{cases.totalDays} hari</TableCell>
                      <TableCell>{cases.calculatedWeight.toFixed(2)}</TableCell>
                      <TableCell>Rp {cases.finalAmount.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        {getStatusBadge(cases.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewCase(cases)}
                          >
                            <Edit className="h-4 w-4" />
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
      </Tabs>

      {/* Detail iDRG Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Aturan iDRG</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang aturan Indonesian Diagnosis Related Groups
            </DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kode iDRG</Label>
                  <p className="mt-1">{selectedRule.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kelompok</Label>
                  <p className="mt-1">{selectedRule.group}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Deskripsi</Label>
                <p className="mt-1">{selectedRule.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Bobot Dasar</Label>
                  <p className="mt-1">{selectedRule.baseWeight.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Faktor Penyesuaian</Label>
                  <p className="mt-1">{selectedRule.adjustmentFactor ? selectedRule.adjustmentFactor.toFixed(2) : '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Subkelompok</Label>
                  <p className="mt-1">{selectedRule.subGroup || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {selectedRule.isActive ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="destructive">Tidak Aktif</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Dibuat Tanggal</Label>
                  <p className="mt-1">{new Date(selectedRule.createdAt).toLocaleDateString('id-ID')} {new Date(selectedRule.createdAt).toLocaleTimeString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Diperbarui Tanggal</Label>
                  <p className="mt-1">{new Date(selectedRule.updatedAt).toLocaleDateString('id-ID')} {new Date(selectedRule.updatedAt).toLocaleTimeString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail iDRG Case Dialog */}
      <Dialog open={isCaseDialogOpen} onOpenChange={setIsCaseDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kasus Pasien iDRG</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang kasus pasien dalam sistem iDRG
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Pasien</Label>
                  <p className="mt-1">{selectedCase.patient.fullName} ({selectedCase.patient.nik})</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Aturan iDRG</Label>
                  <p className="mt-1">{selectedCase.idrgRule.code} - {selectedCase.idrgRule.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Masuk</Label>
                  <p className="mt-1">{new Date(selectedCase.admissionDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Keluar</Label>
                  <p className="mt-1">{new Date(selectedCase.dischargeDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Lama Hari Rawat</Label>
                  <p className="mt-1">{selectedCase.totalDays} hari</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bobot Terhitung</Label>
                  <p className="mt-1">{selectedCase.calculatedWeight.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Kode Diagnosis</Label>
                <p className="mt-1">{selectedCase.diagnosisCode}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Kode Prosedur</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedCase.procedureCodes.map((code, idx) => (
                    <Badge key={idx} variant="outline">{code}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Komplikasi</Label>
                  <p className="mt-1">{selectedCase.complications || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Penyakit Penyerta</Label>
                  <p className="mt-1">{selectedCase.comorbidities || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Biaya</Label>
                  <p className="mt-1 font-semibold">Rp {selectedCase.finalAmount.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedCase.status)}
                  </div>
                </div>
              </div>
              
              {selectedCase.notes && (
                <div>
                  <Label className="text-sm font-medium">Catatan</Label>
                  <p className="mt-1">{selectedCase.notes}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant={selectedCase.status === 'DRAFT' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateCaseStatus(selectedCase.id, 'DRAFT', 'Status diubah menjadi draft')}
                >
                  Draft
                </Button>
                <Button 
                  variant={selectedCase.status === 'CALCULATED' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateCaseStatus(selectedCase.id, 'CALCULATED', 'Biaya telah dihitung')}
                >
                  Dihitung
                </Button>
                <Button 
                  variant={selectedCase.status === 'SUBMITTED' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateCaseStatus(selectedCase.id, 'SUBMITTED', 'Klaim diajukan ke BPJS')}
                >
                  Diajukan
                </Button>
                <Button 
                  variant={selectedCase.status === 'PAID' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateCaseStatus(selectedCase.id, 'PAID', 'Pembayaran diterima')}
                >
                  Dibayar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IDRGManagement;
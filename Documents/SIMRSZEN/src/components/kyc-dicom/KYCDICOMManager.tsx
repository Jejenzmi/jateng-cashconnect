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
  HardDrive,
  Network,
  Eye,
  EyeOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface KYCDocument {
  id: string;
  faskesProfileId: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  filePath: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface DICOMConfig {
  id: string;
  faskesProfileId: string;
  aeTitle: string;
  ipAddress: string;
  port: number;
  protocol: string;
  username?: string;
  password?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const KYCDICOMManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'dicom'>('kyc');
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [dicomConfig, setDicomConfig] = useState<DICOMConfig | null>(null);
  const [filteredKycDocs, setFilteredKycDocs] = useState<KYCDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKycDoc, setSelectedKycDoc] = useState<KYCDocument | null>(null);
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);
  const [isDicomDialogOpen, setIsDicomDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Mock data untuk demonstrasi
  useEffect(() => {
    const mockKycDocs: KYCDocument[] = [
      {
        id: '1',
        faskesProfileId: 'faskes-001',
        documentType: 'SIUP',
        documentNumber: 'SIUP-001-2024',
        issueDate: '2024-01-15',
        expiryDate: '2025-01-15',
        issuer: 'Dinas Kesehatan Provinsi DKI Jakarta',
        filePath: '/documents/siup.pdf',
        status: 'VERIFIED',
        notes: 'Dokumen valid dan lengkap',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:45:00Z'
      },
      {
        id: '2',
        faskesProfileId: 'faskes-001',
        documentType: 'Izin Operasional',
        documentNumber: 'IO-002-2024',
        issueDate: '2024-02-20',
        expiryDate: '2025-02-20',
        issuer: 'Kementerian Kesehatan RI',
        filePath: '/documents/izin-operasional.pdf',
        status: 'PENDING',
        notes: 'Menunggu verifikasi',
        createdAt: '2024-02-20T09:15:00Z',
        updatedAt: '2024-02-20T09:15:00Z'
      }
    ];

    const mockDicomConfig: DICOMConfig = {
      id: 'dicom-001',
      faskesProfileId: 'faskes-001',
      aeTitle: 'HOSPITAL_AETITLE',
      ipAddress: '192.168.1.100',
      port: 104,
      protocol: 'DICOM',
      username: 'dicom_user',
      password: 'dicom_password',
      isEnabled: true,
      createdAt: '2024-01-10T08:30:00Z',
      updatedAt: '2024-01-10T08:30:00Z'
    };

    setKycDocuments(mockKycDocs);
    setDicomConfig(mockDicomConfig);
    setFilteredKycDocs(mockKycDocs);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = kycDocuments.filter(doc => 
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKycDocs(filtered);
  }, [searchTerm, kycDocuments]);

  const handleViewKycDoc = (doc: KYCDocument) => {
    setSelectedKycDoc(doc);
    setIsKycDialogOpen(true);
  };

  const handleAddKycDoc = () => {
    // Tambahkan logika untuk menambah dokumen KYC
    toast.success('Fitur tambah dokumen KYC akan segera hadir');
  };

  const handleUpdateKycStatus = async (docId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED', notes?: string) => {
    try {
      setLoading(true);
      // Simulasikan pemanggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Status dokumen berhasil diperbarui menjadi ${status}`);
      
      // Update state lokal
      setKycDocuments(kycDocuments.map(doc => 
        doc.id === docId ? {...doc, status, notes: notes || doc.notes} : doc
      ));
      setFilteredKycDocs(filteredKycDocs.map(doc => 
        doc.id === docId ? {...doc, status, notes: notes || doc.notes} : doc
      ));
    } catch (error: any) {
      toast.error('Gagal memperbarui status dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDicom = async () => {
    if (!dicomConfig) return;
    
    try {
      setLoading(true);
      // Simulasikan pemanggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = !dicomConfig.isEnabled;
      toast.success(`Konfigurasi DICOM berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      
      setDicomConfig({
        ...dicomConfig,
        isEnabled: newStatus
      });
    } catch (error: any) {
      toast.error('Gagal mengubah status konfigurasi DICOM');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDicomConfig = async () => {
    try {
      setLoading(true);
      // Simulasikan pemanggilan API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Konfigurasi DICOM berhasil disimpan');
    } catch (error: any) {
      toast.error('Gagal menyimpan konfigurasi DICOM');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="success">Terverifikasi</Badge>;
      case 'PENDING':
        return <Badge variant="default">Menunggu</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Ditolak</Badge>;
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
          <HardDrive className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Manajemen KYC & DICOM</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola dokumen KYC dan konfigurasi sistem DICOM untuk integrasi Satu Sehat
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'kyc' | 'dicom')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kyc">Dokumen KYC</TabsTrigger>
          <TabsTrigger value="dicom">Konfigurasi DICOM</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Dokumen KYC</CardTitle>
                  <CardDescription>
                    Dokumen verifikasi identitas fasilitas kesehatan
                  </CardDescription>
                </div>
                <Button onClick={handleAddKycDoc}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Dokumen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari dokumen KYC..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Dokumen</TableHead>
                    <TableHead>Nomor Dokumen</TableHead>
                    <TableHead>Penerbit</TableHead>
                    <TableHead>Berlaku Sampai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKycDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.documentType}</TableCell>
                      <TableCell>{doc.documentNumber}</TableCell>
                      <TableCell>{doc.issuer}</TableCell>
                      <TableCell>{new Date(doc.expiryDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        {getStatusBadge(doc.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewKycDoc(doc)}
                          >
                            <Eye className="h-4 w-4" />
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
        
        <TabsContent value="dicom">
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi DICOM</CardTitle>
              <CardDescription>
                Atur koneksi sistem DICOM untuk integrasi dengan modul radiologi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Status Integrasi</h3>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan integrasi DICOM untuk sistem radiologi
                    </p>
                  </div>
                  <Switch
                    checked={dicomConfig?.isEnabled}
                    onCheckedChange={handleToggleDicom}
                  />
                </div>
                
                {dicomConfig && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aeTitle">AE Title</Label>
                        <Input
                          id="aeTitle"
                          value={dicomConfig.aeTitle}
                          onChange={(e) => setDicomConfig({...dicomConfig, aeTitle: e.target.value})}
                          placeholder="Application Entity Title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ipAddress">IP Address</Label>
                        <Input
                          id="ipAddress"
                          value={dicomConfig.ipAddress}
                          onChange={(e) => setDicomConfig({...dicomConfig, ipAddress: e.target.value})}
                          placeholder="Alamat IP server DICOM"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="port">Port</Label>
                        <Input
                          id="port"
                          type="number"
                          value={dicomConfig.port}
                          onChange={(e) => setDicomConfig({...dicomConfig, port: parseInt(e.target.value)})}
                          placeholder="Port server DICOM"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="protocol">Protokol</Label>
                        <Select 
                          value={dicomConfig.protocol} 
                          onValueChange={(value) => setDicomConfig({...dicomConfig, protocol: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DICOM">DICOM</SelectItem>
                            <SelectItem value="HL7">HL7</SelectItem>
                            <SelectItem value="FHIR">FHIR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={dicomConfig.username || ''}
                          onChange={(e) => setDicomConfig({...dicomConfig, username: e.target.value})}
                          placeholder="Username untuk otentikasi DICOM"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={dicomConfig.password || ''}
                            onChange={(e) => setDicomConfig({...dicomConfig, password: e.target.value})}
                            placeholder="Password untuk otentikasi DICOM"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveDicomConfig} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Simpan Konfigurasi
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail KYC Document Dialog */}
      <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Dokumen KYC</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang dokumen verifikasi KYC
            </DialogDescription>
          </DialogHeader>
          {selectedKycDoc && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Jenis Dokumen</Label>
                  <p className="mt-1">{selectedKycDoc.documentType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nomor Dokumen</Label>
                  <p className="mt-1">{selectedKycDoc.documentNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Terbit</Label>
                  <p className="mt-1">{new Date(selectedKycDoc.issueDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Kadaluarsa</Label>
                  <p className="mt-1">{new Date(selectedKycDoc.expiryDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Penerbit</Label>
                <p className="mt-1">{selectedKycDoc.issuer}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedKycDoc.status)}
                </div>
              </div>
              
              {selectedKycDoc.notes && (
                <div>
                  <Label className="text-sm font-medium">Catatan</Label>
                  <p className="mt-1">{selectedKycDoc.notes}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Lokasi File</Label>
                <p className="mt-1 text-blue-600 underline cursor-pointer">{selectedKycDoc.filePath}</p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant={selectedKycDoc.status === 'VERIFIED' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateKycStatus(selectedKycDoc.id, 'VERIFIED', 'Diverifikasi oleh admin')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verifikasi
                </Button>
                <Button 
                  variant={selectedKycDoc.status === 'PENDING' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateKycStatus(selectedKycDoc.id, 'PENDING', 'Dalam proses verifikasi')}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Pending
                </Button>
                <Button 
                  variant={selectedKycDoc.status === 'REJECTED' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateKycStatus(selectedKycDoc.id, 'REJECTED', 'Dokumen tidak valid atau kadaluarsa')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCDICOMManager;
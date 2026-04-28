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
  Search, 
  Edit, 
  Download,
  RefreshCw,
  Settings,
  FileText,
  BookOpen,
  BookMarked,
  Network
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface ICDCode {
  id: string;
  code: string;
  label: string;
  description?: string;
  score?: number;
}

interface ICDChapter {
  id: string;
  code: string;
  label: string;
  isCategory: boolean;
}

const ICDWHOIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'chapters' | 'settings'>('search');
  const [icdCodes, setIcdCodes] = useState<ICDCode[]>([]);
  const [icdChapters, setIcdChapters] = useState<ICDChapter[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<ICDCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<ICDCode | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Load initial data
  useEffect(() => {
    // Mock data for demonstration
    const mockCodes: ICDCode[] = [
      {
        id: '123456',
        code: 'RA00',
        label: 'COVID-19, virus identified',
        description: 'Disease due to COVID-19 virus',
        score: 0.98
      },
      {
        id: '789012',
        code: 'RA01',
        label: 'COVID-19, virus not identified',
        description: 'Disease due to coronavirus disease 2019',
        score: 0.95
      },
      {
        id: '345678',
        code: 'RA02',
        label: 'Suspected COVID-19',
        description: 'Suspected case of coronavirus disease 2019',
        score: 0.90
      }
    ];
    
    const mockChapters: ICDChapter[] = [
      {
        id: '1',
        code: '1',
        label: 'Certain infectious or parasitic diseases',
        isCategory: false
      },
      {
        id: '2',
        code: '2',
        label: 'Neoplasms',
        isCategory: false
      },
      {
        id: '3',
        code: '3',
        label: 'Diseases of the blood or blood-forming organs',
        isCategory: false
      }
    ];

    setIcdCodes(mockCodes);
    setIcdChapters(mockChapters);
    setFilteredCodes(mockCodes);
  }, []);

  useEffect(() => {
    const filtered = icdCodes.filter(code => 
      code.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCodes(filtered);
  }, [searchTerm, icdCodes]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Silakan masukkan kata kunci pencarian');
      return;
    }

    setLoading(true);
    try {
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/icd-who/search?q=${searchTerm}&limit=10`);
      // setIcdCodes(response.data.data);
      
      toast.success(`Pencarian "${searchTerm}" berhasil`);
    } catch (error: any) {
      toast.error('Gagal melakukan pencarian ICD');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (code: ICDCode) => {
    setLoading(true);
    try {
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/icd-who/details/${code.id}`);
      // setSelectedCode(response.data.data);
      
      setSelectedCode(code);
      setIsDetailsDialogOpen(true);
    } catch (error: any) {
      toast.error('Gagal mendapatkan detail kode ICD');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = async () => {
    if (!clientId || !clientSecret) {
      toast.error('Silakan lengkapi Client ID dan Client Secret');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // await apiClient.post('/icd-who/credentials', { clientId, clientSecret });
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Kredensial ICD WHO berhasil disimpan');
    } catch (error: any) {
      toast.error('Gagal menyimpan kredensial ICD WHO');
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeTab !== 'settings') {
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
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Integrasi ICD WHO</h1>
        </div>
        <p className="text-muted-foreground">
          Integrasi dengan International Classification of Diseases (ICD) milik WHO
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'search' | 'chapters' | 'settings')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Pencarian Kode</TabsTrigger>
          <TabsTrigger value="chapters">Chapter ICD</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Pencarian Kode ICD</CardTitle>
              <CardDescription>
                Cari kode ICD berdasarkan nama penyakit atau gejala
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kode ICD..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari
                    </>
                  )}
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-medium">{code.code}</TableCell>
                      <TableCell>{code.label}</TableCell>
                      <TableCell>{code.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(code)}
                        >
                          <BookMarked className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chapters">
          <Card>
            <CardHeader>
              <CardTitle>Chapter ICD</CardTitle>
              <CardDescription>
                Daftar chapter dalam klasifikasi ICD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Chapter</TableHead>
                    <TableHead>Tipe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {icdChapters.map((chapter) => (
                    <TableRow key={chapter.id}>
                      <TableCell className="font-medium">{chapter.code}</TableCell>
                      <TableCell>{chapter.label}</TableCell>
                      <TableCell>
                        <Badge variant={chapter.isCategory ? "secondary" : "outline"}>
                          {chapter.isCategory ? "Kategori" : "Chapter"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan ICD WHO</CardTitle>
              <CardDescription>
                Atur kredensial untuk mengakses API ICD WHO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Masukkan Client ID dari WHO ICD API"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Textarea
                    id="clientSecret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Masukkan Client Secret dari WHO ICD API"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveCredentials} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Simpan Kredensial
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Informasi Kredensial</h3>
                <p className="text-sm text-muted-foreground">
                  Kredensial ini digunakan untuk mengakses API International Classification of Diseases (ICD) 
                  milik World Health Organization (WHO). Anda dapat mendapatkan kredensial dari{' '}
                  <a 
                    href="https://icd.who.int/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    situs resmi ICD WHO
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail ICD Code Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kode ICD</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang kode klasifikasi penyakit
            </DialogDescription>
          </DialogHeader>
          {selectedCode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kode ICD</Label>
                  <p className="mt-1 font-mono bg-muted p-2 rounded">{selectedCode.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Skor Relevansi</Label>
                  <p className="mt-1">{selectedCode.score ? (selectedCode.score * 100).toFixed(2) + '%' : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Nama Kode</Label>
                <p className="mt-1 text-lg font-medium">{selectedCode.label}</p>
              </div>
              
              {selectedCode.description && (
                <div>
                  <Label className="text-sm font-medium">Deskripsi</Label>
                  <p className="mt-1">{selectedCode.description}</p>
                </div>
              )}
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Catatan</h4>
                <p className="text-sm">
                  Detail lengkap kode ICD akan diambil langsung dari API WHO saat sistem terhubung.
                  Kode ini dapat digunakan dalam rekam medis elektronik dan sistem penagihan.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ICDWHOIntegration;
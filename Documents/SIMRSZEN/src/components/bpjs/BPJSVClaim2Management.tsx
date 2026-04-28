import React, { useState } from 'react';
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
  ShieldCheck,
  Users,
  Calendar,
  Stethoscope,
  MapPin,
  FilePlus,
  FileEdit,
  Trash2,
  PlusCircle,
  MinusCircle,
  Copy,
  Eye,
  EyeOff,
  Building,
  Plus,
  HeartPulse,
  Activity,
  Bed
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const BPJSVClaim2Management: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sep' | 'rujukan' | 'kontrol' | 'referensi'>('sep');
  const [loading, setLoading] = useState(false);
  const [noSEP, setNoSEP] = useState('');
  const [noKartu, setNoKartu] = useState('');
  const [tglSEP, setTglSEP] = useState('');
  const [sepData, setSepData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // State for Rujukan
  const [rujukanForm, setRujukanForm] = useState({
    noSep: '',
    tglRujukan: new Date().toISOString().split('T')[0],
    tglRencanaKunjungan: new Date().toISOString().split('T')[0],
    ppkDirujuk: '',
    jnsPelayanan: '1',
    catatan: '',
    diagRujukan: '',
    tipeRujukan: '0',
    poliRujukan: '',
    user: 'SIMRS ZEN'
  });

  const [rujukanSearchForm, setRujukanSearchForm] = useState({
    noRujukan: '',
    tglMulai: new Date().toISOString().split('T')[0],
    tglAkhir: new Date().toISOString().split('T')[0]
  });

  const [rujukanResults, setRujukanResults] = useState<any[]>([]);
  const [loadingRujukan, setLoadingRujukan] = useState(false);

  // State for SEP form
  const [sepForm, setSepForm] = useState({
    noKartu: '',
    tglSep: new Date().toISOString().split('T')[0],
    ppkPelayanan: '',
    jnsPelayanan: '2',
    klsRawat: '3',
    noMR: '',
    asalRujukan: '1',
    tglRujukan: new Date().toISOString().split('T')[0],
    noRujukan: '',
    ppkRujukan: '',
    catatan: '',
    diagAwal: '',
    poliTujuan: '',
    poliEksekutif: '0',
    cob: '0',
    katarak: '0',
    lakaLantas: '0',
    penjamin: '1',
    tglKejadian: new Date().toISOString().split('T')[0],
    keterangan: '',
    suplesi: '0',
    noSepSuplesi: '',
    kdPropinsi: '',
    kdKabupaten: '',
    kdKecamatan: '',
    noSurat: '',
    kodeDPJP: '',
    noTelp: '',
    user: 'SIMRS ZEN'
  });

  const [sepSearchForm, setSepSearchForm] = useState({
    noSep: '',
    noRujukan: ''
  });

  const [sepResults, setSepResults] = useState<any[]>([]);
  const [loadingSep, setLoadingSep] = useState(false);

  const handleSearchSEP = async () => {
    if (!noSEP) {
      toast.error('Silakan masukkan nomor SEP');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/vclaim2/sep/${noSEP}`);
      // setSepData(response.data.data);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        sep: {
          noSep: noSEP,
          noKartu: '0001234567890',
          nama: 'AHMAD JAINUDIN',
          tglSep: '2023-01-01',
          tglRencanaKunjungan: null,
          jnsPelayanan: '2',
          klsRawat: '3',
          noMR: '20230001',
          dpjp: {
            kode: '12345',
            nama: 'Dr. John Doe, Sp.JP'
          },
          poli: {
            kode: 'INT',
            nama: 'INTERNAL'
          },
          asalRujukan: {
            kode: '1',
            nama: 'Faskes Tk. 1'
          },
          diagnosa: {
            kode: 'A00.1',
            nama: 'KOLERA DENGAN BAKTERI VIBRIO CHOLERAE BIOVAR ELTOR'
          },
          catatan: 'Pasien datang dengan gejala...',
          kunker: {
            kode: '0001R001',
            nama: 'RS JAKARTA MEDICAL CENTER'
          },
          penjamin: {
            kode: '3',
            nama: 'JAMKESOS'
          },
          flagProcedure: null,
          kdPenunjang: null,
          tipeRencanaKunjungan: null
        }
      };
      
      setSepData(mockData);
      toast.success('Data SEP berhasil ditemukan');
    } catch (error: any) {
      toast.error('Gagal mencari data SEP');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPeserta = async () => {
    if (!noKartu || !tglSEP) {
      toast.error('Silakan lengkapi nomor kartu dan tanggal SEP');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/vclaim/peserta/kartu/${noKartu}/${tglSEP}`);
      // setSearchResults([response.data.data]);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        noKartu: noKartu,
        nama: 'AHMAD JAINUDIN',
        nik: '3201234567890123',
        jenisKelamin: 'L',
        tanggalLahir: '1985-05-15',
        statusPeserta: {
          kode: '1',
          nama: 'AKTIF'
        },
        jnsPeserta: {
          kode: '1',
          nama: 'PBI'
        },
        hki: {
          noHKI: '',
          nama: ''
        },
        provUmum: {
          kdProvider: '00001',
          nmProvider: 'RS JAKARTA MEDICAL CENTER'
        },
        cob: {
          nmAsuransi: '-',
          noAsuransi: '-',
          tglTAT: '-',
          tglNA: '-'
        },
        htl: [],
        informasi: {
          alamat: 'JL. MERDEKA NO. 10',
          noHP: '081234567890',
          tglCetakKartu: '2023-01-15',
          tglTAT: '2023-01-01',
          tglNa: '2200-01-01',
          sex: 'L',
          kelasTanggungan: {
            kode: '3',
            nama: 'KELAS III'
          },
          noMr: '20230001',
          ppkRujukan: {
            kdPPK: '0001R001',
            nmPPK: 'RS JAKARTA MEDICAL CENTER'
          },
          provinsi: {
            kdPropinsi: '32',
            nmPropinsi: 'JAWA BARAT'
          },
          kabupaten: {
            kdKabupaten: '3273',
            nmKabupaten: 'KOTA BANDUNG'
          },
          kecamatan: {
            kdKecamatan: '3273070',
            nmKecamatan: 'COBLONG'
          },
          desa: {
            kdDesa: '3273070007',
            nmDesa: 'HEGARMANAH'
          },
          noTelepon: '081234567890'
        }
      };
      
      setSearchResults([mockResult]);
      toast.success('Data peserta berhasil ditemukan');
    } catch (error: any) {
      toast.error('Gagal mencari data peserta');
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes for rujukan
  const handleRujukanFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRujukanForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRujukanSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRujukanSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create rujukan
  const handleCreateRujukan = async () => {
    setLoadingRujukan(true);
    try {
      // In a real implementation, we would call the backend API
      // await apiClient.post('/bpjs/vclaim2/rujukan/insert', rujukanForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Rujukan berhasil dibuat');
      // Reset form
      setRujukanForm({
        noSep: '',
        tglRujukan: new Date().toISOString().split('T')[0],
        tglRencanaKunjungan: new Date().toISOString().split('T')[0],
        ppkDirujuk: '',
        jnsPelayanan: '1',
        catatan: '',
        diagRujukan: '',
        tipeRujukan: '0',
        poliRujukan: '',
        user: 'SIMRS ZEN'
      });
    } catch (error) {
      toast.error('Gagal membuat rujukan');
    } finally {
      setLoadingRujukan(false);
    }
  };

  // Search rujukan by noRujukan
  const handleSearchRujukan = async () => {
    if (!rujukanSearchForm.noRujukan) {
      toast.error('Masukkan nomor rujukan');
      return;
    }
    
    setLoadingRujukan(true);
    try {
      // In a real implementation, we would call the backend API
      // const response = await apiClient.get(`/bpjs/vclaim2/rujukan/${rujukanSearchForm.noRujukan}`);
      // setRujukanResults(response.data.data.response.rujukan ? [response.data.data.response.rujukan] : []);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRujukanResults([{
        noRujukan: rujukanSearchForm.noRujukan,
        noSep: '0301R0010321V000003',
        noKartu: '0001329783085',
        nama: 'FADLAN LISMI AZIZ',
        kelasRawat: '3',
        kelamin: 'L',
        tglLahir: '2006-02-20',
        tglSep: '2021-03-18',
        tglRujukan: rujukanSearchForm.tglMulai,
        tglRencanaKunjungan: '2021-03-19',
        ppkDirujuk: '03010402',
        namaPpkDirujuk: 'PEGAMBIRAN',
        jnsPelayanan: '2',
        catatan: 'TES DEVELOPMENT',
        diagRujukan: 'C46.0',
        namaDiagRujukan: 'Kaposi\'s sarcoma of skin',
        tipeRujukan: '0',
        namaTipeRujukan: 'Rujukan Penuh',
        poliRujukan: 'OBG',
        namaPoliRujukan: 'OBGYN'
      }]);
      
      toast.success('Data rujukan ditemukan');
    } catch (error) {
      toast.error('Gagal mencari rujukan');
    } finally {
      setLoadingRujukan(false);
    }
  };

  // Search rujukan list by date range
  const handleSearchRujukanList = async () => {
    setLoadingRujukan(true);
    try {
      // In a real implementation, we would call the backend API
      // const response = await apiClient.get(`/bpjs/vclaim2/rujukan/list/${rujukanSearchForm.tglMulai}/${rujukanSearchForm.tglAkhir}`);
      // setRujukanResults(response.data.data.response.list);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRujukanResults([
        {
          noRujukan: '1828R0011221B000001',
          tglRujukan: '2021-12-06',
          jnsPelayanan: '2',
          noSep: '1828r0011221v000001',
          noKartu: '0002035020396',
          nama: 'SUSANTI',
          ppkDirujuk: '1820R001',
          namaPpkDirujuk: 'RSUD SAWERIGADING PALOPO'
        },
        {
          noRujukan: '1828R0011221B000006',
          tglRujukan: '2021-12-08',
          jnsPelayanan: '2',
          noSep: '1828R0011221V000013',
          noKartu: '0002059334728',
          nama: 'MARINGAN HALOMOAN NAPITUPULU',
          ppkDirujuk: '0345R001',
          namaPpkDirujuk: 'RSU INCO SOROWAKO'
        }
      ]);
      
      toast.success('Data rujukan ditemukan');
    } catch (error) {
      toast.error('Gagal mencari daftar rujukan');
    } finally {
      setLoadingRujukan(false);
    }
  };

  // Handle form changes for SEP
  const handleSepFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSepForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSepSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSepSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create SEP
  const handleCreateSep = async () => {
    setLoadingSep(true);
    try {
      // In a real implementation, we would call the backend API
      // await apiClient.post('/bpjs/vclaim2/sep/2.0/insert', sepForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('SEP berhasil dibuat');
      // Reset form
      setSepForm({
        noKartu: '',
        tglSep: new Date().toISOString().split('T')[0],
        ppkPelayanan: '',
        jnsPelayanan: '2',
        klsRawat: '3',
        noMR: '',
        asalRujukan: '1',
        tglRujukan: new Date().toISOString().split('T')[0],
        noRujukan: '',
        ppkRujukan: '',
        catatan: '',
        diagAwal: '',
        poliTujuan: '',
        poliEksekutif: '0',
        cob: '0',
        katarak: '0',
        lakaLantas: '0',
        penjamin: '1',
        tglKejadian: new Date().toISOString().split('T')[0],
        keterangan: '',
        suplesi: '0',
        noSepSuplesi: '',
        kdPropinsi: '',
        kdKabupaten: '',
        kdKecamatan: '',
        noSurat: '',
        kodeDPJP: '',
        noTelp: '',
        user: 'SIMRS ZEN'
      });
    } catch (error) {
      toast.error('Gagal membuat SEP');
    } finally {
      setLoadingSep(false);
    }
  };

  // Search SEP by noSEP
  const handleSearchSep = async () => {
    if (!sepSearchForm.noSep) {
      toast.error('Masukkan nomor SEP');
      return;
    }
    
    setLoadingSep(true);
    try {
      // In a real implementation, we would call the backend API
      // const response = await apiClient.get(`/bpjs/vclaim2/sep/${sepSearchForm.noSep}`);
      // setSepResults(response.data.data.response.sep ? [response.data.data.response.sep] : []);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setSepResults([{
        noSep: sepSearchForm.noSep,
        tglSep: '2023-03-30',
        jnsPelayanan: 'Rawat Jalan',
        klsRawat: 'Kelas 3',
        diagnosa: 'Respiratory tuberculosis, bacteriologically and histologically confirmed',
        noRujukan: '0050B1070223P000004',
        poli: 'PENYAKIT DALAM',
        poliEksekutif: '0',
        catatan: 'testinsert RJ',
        penjamin: null,
        peserta: {
          nama: 'ARSTNUU',
          noKartu: '0002802875185',
          jnsPeserta: 'PBI (APBN)',
          kelamin: 'P',
          tglLahir: '1944-02-24',
          noMr: 'MR5185'
        }
      }]);
      
      toast.success('Data SEP ditemukan');
    } catch (error) {
      toast.error('Gagal mencari SEP');
    } finally {
      setLoadingSep(false);
    }
  };

  // Search last SEP by noRujukan
  const handleSearchLastSep = async () => {
    if (!sepSearchForm.noRujukan) {
      toast.error('Masukkan nomor rujukan');
      return;
    }
    
    setLoadingSep(true);
    try {
      // In a real implementation, we would call the backend API
      // const response = await apiClient.get(`/bpjs/vclaim2/sep/lastsep/norujukan/${sepSearchForm.noRujukan}`);
      // setSepResults(response.data.data.response.sep ? [response.data.data.response.sep] : []);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setSepResults([{
        noSep: '0301R0010323V000039',
        tglSep: '2023-03-30',
        jnsPelayanan: 'Rawat Jalan',
        klsRawat: 'Kelas 3',
        diagnosa: 'Respiratory tuberculosis, bacteriologically and histologically confirmed',
        noRujukan: sepSearchForm.noRujukan,
        poli: 'PENYAKIT DALAM',
        poliEksekutif: '0',
        catatan: 'testinsert RJ',
        penjamin: null,
        peserta: {
          nama: 'ARSTNUU',
          noKartu: '0002802875185',
          jnsPeserta: 'PBI (APBN)',
          kelamin: 'P',
          tglLahir: '1944-02-24',
          noMr: 'MR5185'
        }
      }]);
      
      toast.success('Data SEP terakhir ditemukan');
    } catch (error) {
      toast.error('Gagal mencari SEP terakhir');
    } finally {
      setLoadingSep(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Manajemen VClaim 2.0</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola Surat Eligibilitas Peserta (SEP) dan proses rujukan berdasarkan VClaim 2.0
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sep' | 'rujukan' | 'kontrol' | 'referensi')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sep">SEP</TabsTrigger>
          <TabsTrigger value="rujukan">Rujukan</TabsTrigger>
          <TabsTrigger value="kontrol">Kontrol & SPRI</TabsTrigger>
          <TabsTrigger value="referensi">Referensi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sep">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen SEP (Surat Eligibilitas Peserta)</CardTitle>
              <CardDescription>
                Cari, buat, dan kelola Surat Eligibilitas Peserta berdasarkan VClaim 2.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="noSEP">Nomor SEP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="noSEP"
                        value={noSEP}
                        onChange={(e) => setNoSEP(e.target.value)}
                        placeholder="Contoh: 0000010072110001"
                      />
                      <Button onClick={handleSearchSEP} disabled={loading}>
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="noKartu">Nomor Kartu</Label>
                      <Input
                        id="noKartu"
                        value={noKartu}
                        onChange={(e) => setNoKartu(e.target.value)}
                        placeholder="Contoh: 0001234567890"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tglSEP">Tanggal SEP</Label>
                      <Input
                        id="tglSEP"
                        type="date"
                        value={tglSEP}
                        onChange={(e) => setTglSEP(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <FilePlus className="mr-2 h-4 w-4" />
                      Buat SEP Baru
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit SEP
                    </Button>
                    <Button variant="outline" className="flex-1" disabled>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus SEP
                    </Button>
                  </div>
                </div>
                
                {sepData && (
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Detail SEP
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">No. SEP</Label>
                              <p className="mt-1">{sepData.sep.noSep}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">No. Kartu</Label>
                              <p className="mt-1">{sepData.sep.noKartu}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Nama Peserta</Label>
                              <p className="mt-1">{sepData.sep.nama}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Tanggal SEP</Label>
                              <p className="mt-1">{new Date(sepData.sep.tglSep).toLocaleDateString('id-ID')}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Jenis Pelayanan</Label>
                              <p className="mt-1">{sepData.sep.jnsPelayanan === '1' ? 'Rawat Inap' : 'Rawat Jalan'}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">Kelas Rawat</Label>
                              <p className="mt-1">Kelas {sepData.sep.klsRawat}</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">DPJP</Label>
                              <p className="mt-1">{sepData.sep.dpjp.nama} (Kode: {sepData.sep.dpjp.kode})</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">Poli Tujuan</Label>
                              <p className="mt-1">{sepData.sep.poli.nama} (Kode: {sepData.sep.poli.kode})</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">Diagnosa</Label>
                              <p className="mt-1">{sepData.sep.diagnosa.nama} (Kode: {sepData.sep.diagnosa.kode})</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Catatan</Label>
                            <p className="mt-1">{sepData.sep.catatan}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Data Peserta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. Kartu</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Kelas Tanggungan</TableHead>
                          <TableHead>Faskes Rujukan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.noKartu}</TableCell>
                            <TableCell>{result.nama}</TableCell>
                            <TableCell>
                              <Badge variant={result.statusPeserta.kode === '1' ? 'success' : 'destructive'}>
                                {result.statusPeserta.nama}
                              </Badge>
                            </TableCell>
                            <TableCell>{result.informasi.kelasTanggungan.nama}</TableCell>
                            <TableCell>{result.ppkRujukan.nmPPK}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rujukan Tab */}
        <TabsContent value="rujukan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pembuatan Rujukan
              </CardTitle>
              <CardDescription>
                Buat rujukan antar rumah sakit untuk pasien BPJS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noSep">Nomor SEP</Label>
                  <Input
                    id="noSep"
                    name="noSep"
                    value={rujukanForm.noSep}
                    onChange={handleRujukanFormChange}
                    placeholder="Contoh: 0301R0010321V000003"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglRujukan">Tanggal Rujukan</Label>
                  <Input
                    id="tglRujukan"
                    name="tglRujukan"
                    type="date"
                    value={rujukanForm.tglRujukan}
                    onChange={handleRujukanFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglRencanaKunjungan">Tanggal Rencana Kunjungan</Label>
                  <Input
                    id="tglRencanaKunjungan"
                    name="tglRencanaKunjungan"
                    type="date"
                    value={rujukanForm.tglRencanaKunjungan}
                    onChange={handleRujukanFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="ppkDirujuk">PPK Dirujuk</Label>
                  <Input
                    id="ppkDirujuk"
                    name="ppkDirujuk"
                    value={rujukanForm.ppkDirujuk}
                    onChange={handleRujukanFormChange}
                    placeholder="Contoh: 03010402"
                  />
                </div>
                
                <div>
                  <Label htmlFor="jnsPelayanan">Jenis Pelayanan</Label>
                  <Select 
                    value={rujukanForm.jnsPelayanan} 
                    onValueChange={(value) => setRujukanForm({...rujukanForm, jnsPelayanan: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipeRujukan">Tipe Rujukan</Label>
                  <Select 
                    value={rujukanForm.tipeRujukan} 
                    onValueChange={(value) => setRujukanForm({...rujukanForm, tipeRujukan: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Penuh</SelectItem>
                      <SelectItem value="1">Partial</SelectItem>
                      <SelectItem value="2">Balik PRB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="diagRujukan">Diagnosa Rujukan</Label>
                  <Input
                    id="diagRujukan"
                    name="diagRujukan"
                    value={rujukanForm.diagRujukan}
                    onChange={handleRujukanFormChange}
                    placeholder="Contoh: A00.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="poliRujukan">Poli Rujukan</Label>
                  <Input
                    id="poliRujukan"
                    name="poliRujukan"
                    value={rujukanForm.poliRujukan}
                    onChange={handleRujukanFormChange}
                    placeholder="Contoh: INT"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    name="catatan"
                    value={rujukanForm.catatan}
                    onChange={handleRujukanFormChange}
                    placeholder="Catatan rujukan"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCreateRujukan} disabled={loadingRujukan}>
                  {loadingRujukan ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Buat Rujukan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Pencarian Rujukan
              </CardTitle>
              <CardDescription>
                Cari data rujukan berdasarkan nomor rujukan atau rentang tanggal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="noRujukan">Nomor Rujukan</Label>
                  <Input
                    id="noRujukan"
                    name="noRujukan"
                    value={rujukanSearchForm.noRujukan}
                    onChange={handleRujukanSearchChange}
                    placeholder="Contoh: 0301R0011117B001126"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglMulai">Tanggal Mulai</Label>
                  <Input
                    id="tglMulai"
                    name="tglMulai"
                    type="date"
                    value={rujukanSearchForm.tglMulai}
                    onChange={handleRujukanSearchChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglAkhir">Tanggal Akhir</Label>
                  <Input
                    id="tglAkhir"
                    name="tglAkhir"
                    type="date"
                    value={rujukanSearchForm.tglAkhir}
                    onChange={handleRujukanSearchChange}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mb-6">
                <Button onClick={handleSearchRujukan} disabled={loadingRujukan}>
                  <Search className="mr-2 h-4 w-4" />
                  Cari Rujukan
                </Button>
                <Button onClick={handleSearchRujukanList} variant="outline" disabled={loadingRujukan}>
                  <Search className="mr-2 h-4 w-4" />
                  Cari Daftar Rujukan
                </Button>
              </div>
              
              {rujukanResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian Rujukan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No. Rujukan</TableHead>
                            <TableHead>Tanggal Rujukan</TableHead>
                            <TableHead>Nama Pasien</TableHead>
                            <TableHead>PPK Tujuan</TableHead>
                            <TableHead>Jenis Layanan</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rujukanResults.map((rujukan, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{rujukan.noRujukan}</TableCell>
                              <TableCell>{rujukan.tglRujukan}</TableCell>
                              <TableCell>{rujukan.nama}</TableCell>
                              <TableCell>{rujukan.namaPpkDirujuk}</TableCell>
                              <TableCell>
                                {rujukan.jnsPelayanan === '1' ? 'Rawat Inap' : 'Rawat Jalan'}
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEP Tab */}
        <TabsContent value="sep">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pembuatan SEP
              </CardTitle>
              <CardDescription>
                Buat Surat Eligibilitas Peserta untuk pasien BPJS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noKartu">Nomor Kartu</Label>
                  <Input
                    id="noKartu"
                    name="noKartu"
                    value={sepForm.noKartu}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 0001112230666"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglSep">Tanggal SEP</Label>
                  <Input
                    id="tglSep"
                    name="tglSep"
                    type="date"
                    value={sepForm.tglSep}
                    onChange={handleSepFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="ppkPelayanan">PPK Pelayanan</Label>
                  <Input
                    id="ppkPelayanan"
                    name="ppkPelayanan"
                    value={sepForm.ppkPelayanan}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 0301R001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="jnsPelayanan">Jenis Pelayanan</Label>
                  <Select 
                    value={sepForm.jnsPelayanan} 
                    onValueChange={(value) => setSepForm({...sepForm, jnsPelayanan: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="klsRawat">Kelas Rawat</Label>
                  <Select 
                    value={sepForm.klsRawat} 
                    onValueChange={(value) => setSepForm({...sepForm, klsRawat: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Kelas 1</SelectItem>
                      <SelectItem value="2">Kelas 2</SelectItem>
                      <SelectItem value="3">Kelas 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="noMR">Nomor MR</Label>
                  <Input
                    id="noMR"
                    name="noMR"
                    value={sepForm.noMR}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 123456"
                  />
                </div>
                
                <div>
                  <Label htmlFor="asalRujukan">Asal Rujukan</Label>
                  <Select 
                    value={sepForm.asalRujukan} 
                    onValueChange={(value) => setSepForm({...sepForm, asalRujukan: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Faskes 1</SelectItem>
                      <SelectItem value="2">Faskes 2 (RS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tglRujukan">Tanggal Rujukan</Label>
                  <Input
                    id="tglRujukan"
                    name="tglRujukan"
                    type="date"
                    value={sepForm.tglRujukan}
                    onChange={handleSepFormChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="noRujukan">Nomor Rujukan</Label>
                  <Input
                    id="noRujukan"
                    name="noRujukan"
                    value={sepForm.noRujukan}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 1234567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ppkRujukan">PPK Rujukan</Label>
                  <Input
                    id="ppkRujukan"
                    name="ppkRujukan"
                    value={sepForm.ppkRujukan}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 00010001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="diagAwal">Diagnosa Awal</Label>
                  <Input
                    id="diagAwal"
                    name="diagAwal"
                    value={sepForm.diagAwal}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: A00.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="poliTujuan">Poli Tujuan</Label>
                  <Input
                    id="poliTujuan"
                    name="poliTujuan"
                    value={sepForm.poliTujuan}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: INT"
                  />
                </div>
                
                <div>
                  <Label htmlFor="poliEksekutif">Poli Eksekutif</Label>
                  <Select 
                    value={sepForm.poliEksekutif} 
                    onValueChange={(value) => setSepForm({...sepForm, poliEksekutif: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Tidak</SelectItem>
                      <SelectItem value="1">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cob">COB</Label>
                  <Select 
                    value={sepForm.cob} 
                    onValueChange={(value) => setSepForm({...sepForm, cob: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Tidak</SelectItem>
                      <SelectItem value="1">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="katarak">Katarak</Label>
                  <Select 
                    value={sepForm.katarak} 
                    onValueChange={(value) => setSepForm({...sepForm, katarak: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Tidak</SelectItem>
                      <SelectItem value="1">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="lakaLantas">Laka Lantas</Label>
                  <Select 
                    value={sepForm.lakaLantas} 
                    onValueChange={(value) => setSepForm({...sepForm, lakaLantas: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Bukan Kecelakaan</SelectItem>
                      <SelectItem value="1">KLL dan bukan kecelakaan Kerja</SelectItem>
                      <SelectItem value="2">KLL dan KK</SelectItem>
                      <SelectItem value="3">Kecelakaan Kerja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="kodeDPJP">Kode DPJP</Label>
                  <Input
                    id="kodeDPJP"
                    name="kodeDPJP"
                    value={sepForm.kodeDPJP}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 31661"
                  />
                </div>
                
                <div>
                  <Label htmlFor="noTelp">Nomor Telepon</Label>
                  <Input
                    id="noTelp"
                    name="noTelp"
                    value={sepForm.noTelp}
                    onChange={handleSepFormChange}
                    placeholder="Contoh: 081919999"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    name="catatan"
                    value={sepForm.catatan}
                    onChange={handleSepFormChange}
                    placeholder="Catatan peserta"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCreateSep} disabled={loadingSep}>
                  {loadingSep ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Buat SEP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Pencarian SEP
              </CardTitle>
              <CardDescription>
                Cari data SEP berdasarkan nomor SEP atau nomor rujukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noSep">Nomor SEP</Label>
                  <Input
                    id="noSep"
                    name="noSep"
                    value={sepSearchForm.noSep}
                    onChange={handleSepSearchChange}
                    placeholder="Contoh: 0301R0011117V000008"
                  />
                </div>
                
                <div>
                  <Label htmlFor="noRujukan">Nomor Rujukan</Label>
                  <Input
                    id="noRujukan"
                    name="noRujukan"
                    value={sepSearchForm.noRujukan}
                    onChange={handleSepSearchChange}
                    placeholder="Contoh: 1234567"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mb-6">
                <Button onClick={handleSearchSep} disabled={loadingSep}>
                  <Search className="mr-2 h-4 w-4" />
                  Cari SEP
                </Button>
                <Button onClick={handleSearchLastSep} variant="outline" disabled={loadingSep}>
                  <Search className="mr-2 h-4 w-4" />
                  Cari SEP Terakhir
                </Button>
              </div>
              
              {sepResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian SEP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No. SEP</TableHead>
                            <TableHead>Tanggal SEP</TableHead>
                            <TableHead>Nama Pasien</TableHead>
                            <TableHead>Nomor Kartu</TableHead>
                            <TableHead>Jenis Layanan</TableHead>
                            <TableHead>Diagnosa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sepResults.map((sep, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{sep.noSep}</TableCell>
                              <TableCell>{sep.tglSep}</TableCell>
                              <TableCell>{sep.peserta?.nama}</TableCell>
                              <TableCell>{sep.peserta?.noKartu}</TableCell>
                              <TableCell>{sep.jnsPelayanan || sep.jnsPelayanan}</TableCell>
                              <TableCell>{sep.diagnosa}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kontrol">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Surat Kontrol & SPRI</CardTitle>
              <CardDescription>
                Cari, buat, dan kelola surat kontrol dan SPRI berdasarkan VClaim 2.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="noSuratKontrol">Nomor Surat Kontrol/SPRI</Label>
                    <Input
                      id="noSuratKontrol"
                      placeholder="Contoh: 2301R00100001"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tglAwal">Tanggal Awal</Label>
                      <Input id="tglAwal" type="date" />
                    </div>
                    
                    <div>
                      <Label htmlFor="tglAkhir">Tanggal Akhir</Label>
                      <Input id="tglAkhir" type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="filter">Filter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih filter..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tanggal Rencana</SelectItem>
                        <SelectItem value="2">Tanggal Entri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Cari Surat Kontrol
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Plus className="mr-2 h-4 w-4" />
                      Buat Baru
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Jadwal Dokter & Spesialis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Jenis Kontrol</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kontrol..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">SPRI</SelectItem>
                              <SelectItem value="2">Surat Kontrol</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="kdPoli" className="text-sm font-medium">Kode Poli</Label>
                          <Input id="kdPoli" placeholder="Contoh: INT" />
                        </div>
                        
                        <div>
                          <Label htmlFor="tglKontrol" className="text-sm font-medium">Tanggal Rencana</Label>
                          <Input id="tglKontrol" type="date" />
                        </div>
                        
                        <Button className="w-full">
                          <Search className="mr-2 h-4 w-4" />
                          Cari Jadwal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referensi">
          <Card>
            <CardHeader>
              <CardTitle>Referensi VClaim 2.0</CardTitle>
              <CardDescription>
                Data referensi untuk keperluan pembuatan SEP, rujukan, dan kontrol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm">Diagnosa</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <HeartPulse className="h-8 w-8 mb-2" />
                  <span className="text-sm">Poli</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Stethoscope className="h-8 w-8 mb-2" />
                  <span className="text-sm">Dokter</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Building className="h-8 w-8 mb-2" />
                  <span className="text-sm">Faskes</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Activity className="h-8 w-8 mb-2" />
                  <span className="text-sm">Prosedur</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Bed className="h-8 w-8 mb-2" />
                  <span className="text-sm">Kelas Rawat</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BPJSVClaim2Management;
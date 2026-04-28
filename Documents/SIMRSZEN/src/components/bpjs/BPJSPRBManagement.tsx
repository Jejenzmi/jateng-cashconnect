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
  Clock,
  Pill,
  HeartPulse,
  Activity,
  Bed,
  FilePlus,
  ClipboardList,
  Monitor,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const BPJSPRBManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'update' | 'search' | 'summary'>('create');
  const [loading, setLoading] = useState(false);
  
  // State untuk create/update PRB
  const [noSep, setNoSep] = useState('');
  const [noKartu, setNoKartu] = useState('');
  const [alamat, setAlamat] = useState('');
  const [email, setEmail] = useState('');
  const [programPRB, setProgramPRB] = useState('');
  const [kodeDPJP, setKodeDPJP] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [saran, setSaran] = useState('');
  const [user, setUser] = useState('');
  const [obatList, setObatList] = useState([
    { id: 1, kdObat: '', signa1: '', signa2: '', jmlObat: '' }
  ]);
  
  // State untuk search PRB
  const [noSrb, setNoSrb] = useState('');
  const [noSepSearch, setNoSepSearch] = useState('');
  const [tglMulaiSearch, setTglMulaiSearch] = useState('');
  const [tglAkhirSearch, setTglAkhirSearch] = useState('');
  
  // State untuk summary PRB
  const [tahunSummary, setTahunSummary] = useState('');
  const [bulanSummary, setBulanSummary] = useState('');
  
  // State untuk data
  const [prbResult, setPrbResult] = useState<any>(null);
  const [prbList, setPrbList] = useState<any[]>([]);
  const [prbSummary, setPrbSummary] = useState<any[]>([]);

  const handleAddObat = () => {
    setObatList([...obatList, { id: Date.now(), kdObat: '', signa1: '', signa2: '', jmlObat: '' }]);
  };

  const handleRemoveObat = (id: number) => {
    if (obatList.length > 1) {
      setObatList(obatList.filter(obat => obat.id !== id));
    }
  };

  const handleObatChange = (id: number, field: string, value: string) => {
    setObatList(obatList.map(obat => 
      obat.id === id ? { ...obat, [field]: value } : obat
    ));
  };

  const handleCreatePRB = async () => {
    if (!noSep || !noKartu || !alamat || !email || !programPRB || !kodeDPJP || !keterangan || !saran || !user) {
      toast.error('Silakan lengkapi semua field yang wajib diisi');
      return;
    }

    const obatPayload = obatList.map(obat => ({
      kdObat: obat.kdObat,
      signa1: obat.signa1,
      signa2: obat.signa2,
      jmlObat: obat.jmlObat
    }));

    const payload = {
      noSep,
      noKartu,
      alamat,
      email,
      programPRB,
      kodeDPJP,
      keterangan,
      saran,
      user,
      obat: obatPayload
    };

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.post('/bpjs/prb/insert', payload);
      // toast.success('PRB berhasil dibuat');
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        DPJP: {
          kode: kodeDPJP,
          nama: 'Dr. John Doe, Sp.PD'
        },
        keterangan: keterangan,
        noSRB: 'PRB' + Math.floor(Math.random() * 100000),
        obat: {
          list: obatPayload.map(o => ({
            jmlObat: o.jmlObat,
            nmObat: `Obat ${o.kdObat}`,
            signa: `${o.signa1} x ${o.signa2}`
          }))
        },
        peserta: {
          alamat: alamat,
          asalFaskes: {
            kode: '01691101',
            nama: 'Klinik Kesehatan'
          },
          email: email,
          kelamin: 'L',
          nama: 'Ahmad Jainudin',
          noKartu: noKartu,
          noTelepon: '081234567890',
          tglLahir: '1980-01-01'
        },
        programPRB: 'Program Test',
        saran: saran,
        tglSRB: new Date().toISOString().split('T')[0]
      };
      
      setPrbResult(mockResult);
      toast.success('PRB berhasil dibuat (simulasi)');
    } catch (error: any) {
      toast.error('Gagal membuat PRB');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePRB = async () => {
    if (!noSrb || !noSep || !alamat || !email || !kodeDPJP || !keterangan || !saran || !user) {
      toast.error('Silakan lengkapi semua field yang wajib diisi');
      return;
    }

    const obatPayload = obatList.map(obat => ({
      kdObat: obat.kdObat,
      signa1: obat.signa1,
      signa2: obat.signa2,
      jmlObat: obat.jmlObat
    }));

    const payload = {
      noSrb,
      noSep,
      alamat,
      email,
      kodeDPJP,
      keterangan,
      saran,
      user,
      obat: obatPayload
    };

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.put('/bpjs/prb/update', payload);
      // toast.success('PRB berhasil diperbarui');
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('PRB berhasil diperbarui (simulasi)');
    } catch (error: any) {
      toast.error('Gagal memperbarui PRB');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePRB = async () => {
    if (!noSrb || !noSep || !user) {
      toast.error('Silakan lengkapi nomor SRB, SEP, dan user');
      return;
    }

    const payload = {
      noSrb,
      noSep,
      user
    };

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.delete('/bpjs/prb/delete', { data: { request: { t_prb: payload } } });
      // toast.success('PRB berhasil dihapus');
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('PRB berhasil dihapus (simulasi)');
      
      // Reset fields
      setNoSrb('');
      setNoSepSearch('');
      setUser('');
    } catch (error: any) {
      toast.error('Gagal menghapus PRB');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBySrb = async () => {
    if (!noSrb || !noSepSearch) {
      toast.error('Silakan lengkapi nomor SRB dan SEP');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/prb/srb/${noSrb}/nosep/${noSepSearch}`);
      // setPrbResult(response.data.data.response.prb);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        DPJP: {
          kode: '275190',
          nama: 'Dr. Jane Smith, Sp.PD'
        },
        noSEP: noSepSearch,
        noSRB: noSrb,
        obat: {
          obat: [
            {
              jmlObat: "5",
              kdObat: "00019990017",
              nmObat: "Aspirin",
              signa1: "3",
              signa2: "1"
            },
            {
              jmlObat: "10",
              kdObat: "00078990062",
              nmObat: "Paracetamol",
              signa1: "3",
              signa2: "1"
            }
          ]
        },
        peserta: {
          alamat: "Jl. Sehat No. 123",
          asalFaskes: {
            kode: "016999901",
            nama: "Klinik Sehat"
          },
          email: "pasien@example.com",
          kelamin: "P",
          nama: "Siti Aminah",
          noKartu: "0054679979951",
          noTelepon: "089101999101",
          tglLahir: "1990-05-15"
        },
        programPRB: {
          kode: "01",
          nama: "Diabetes Mellitus"
        },
        keterangan: "Kecapekan Kerja",
        saran: "Pasien Harus Cuti, Kebanyakan Kerja",
        tglSRB: "2023-11-15"
      };
      
      setPrbResult(mockResult);
      toast.success('Data PRB berhasil ditemukan');
    } catch (error: any) {
      toast.error('Gagal mencari data PRB');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByDate = async () => {
    if (!tglMulaiSearch || !tglAkhirSearch) {
      toast.error('Silakan lengkapi tanggal mulai dan akhir');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/prb/date/${tglMulaiSearch}/${tglAkhirSearch}`);
      // setPrbList(response.data.data.response.prb.list);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockList = [
        {
          DPJP: {
            kode: '2759111',
            nama: 'Dr. Marwoto, Sp.PD'
          },
          noSEP: "1101R0070118V110086",
          noSRB: "PRB9419118",
          peserta: {
            alamat: "Jl. Merdekah",
            email: "emailkudisadap@gmail.com",
            nama: "SITI RONALD",
            noKartu: "0011079979951",
            noTelepon: "081728191919191"
          },
          programPRB: {
            kode: "01",
            nama: "Diabetes Mellitus"
          },
          keterangan: "Alergi Cuti",
          saran: "Pasien Wajib Berlibur, Jangan Disuruh Kerja",
          tglSRB: "2023-10-08"
        },
        {
          DPJP: {
            kode: '2759112',
            nama: 'Dr. Sari, Sp.PD'
          },
          noSEP: "1101R0070118V110087",
          noSRB: "PRB9419119",
          peserta: {
            alamat: "Jl. Sehat",
            email: "pasien@example.com",
            nama: "BAMBANG SAPUTRA",
            noKartu: "0011079979952",
            noTelepon: "081728191919192"
          },
          programPRB: {
            kode: "02",
            nama: "Hipertensi"
          },
          keterangan: "Tekanan Darah Tinggi",
          saran: "Perlu kontrol rutin",
          tglSRB: "2023-10-09"
        }
      ];
      
      setPrbList(mockList);
      toast.success('Data PRB berhasil ditemukan');
    } catch (error: any) {
      toast.error('Gagal mencari data PRB');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    if (!tahunSummary || !bulanSummary) {
      toast.error('Silakan lengkapi tahun dan bulan');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/prb/potensi/${tahunSummary}/${bulanSummary}`);
      // setPrbSummary(response.data.data.response.list);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSummary = [
        {
          NamaPeserta: "UJI COBA",
          NomorKartu: "0001731124168",
          NOSEP: "0112R0270125V002761",
          TanggalPelayanan: "07/01/2023",
          DiagnosaPotensiPRB: "E11 - Non-insulin-dependent diabetes mellitus",
          KategoriPenyakitPRB: "Diabetes Mellitus"
        },
        {
          NamaPeserta: "PESERTA TEST",
          NomorKartu: "0001731124169",
          NOSEP: "0112R0270125V002762",
          TanggalPelayanan: "08/01/2023",
          DiagnosaPotensiPRB: "I10 - Essential (primary) hypertension",
          KategoriPenyakitPRB: "Hipertensi"
        }
      ];
      
      setPrbSummary(mockSummary);
      toast.success('Rekap PRB berhasil ditemukan');
    } catch (error: any) {
      toast.error('Gagal mencari rekap PRB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">PRB Management</h1>
        </div>
        <p className="text-muted-foreground">
          Program Rujuk Balik (PRB) - Manajemen surat rujuk balik dari rumah sakit ke FKTP
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'create' | 'update' | 'search' | 'summary')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Buat PRB</TabsTrigger>
          <TabsTrigger value="update">Ubah PRB</TabsTrigger>
          <TabsTrigger value="search">Cari PRB</TabsTrigger>
          <TabsTrigger value="summary">Rekap PRB</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Buat Surat Rujuk Balik (PRB)</CardTitle>
              <CardDescription>
                Isi formulir di bawah untuk membuat surat rujuk balik baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noSep">No. SEP *</Label>
                  <Input
                    id="noSep"
                    value={noSep}
                    onChange={(e) => setNoSep(e.target.value)}
                    placeholder="Contoh: 0301R0011017V000015"
                  />
                </div>
                
                <div>
                  <Label htmlFor="noKartu">No. Kartu *</Label>
                  <Input
                    id="noKartu"
                    value={noKartu}
                    onChange={(e) => setNoKartu(e.target.value)}
                    placeholder="Contoh: 0001234567890"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alamat">Alamat *</Label>
                  <Textarea
                    id="alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Alamat lengkap pasien"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: pasien@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="programPRB">Program PRB *</Label>
                  <Input
                    id="programPRB"
                    value={programPRB}
                    onChange={(e) => setProgramPRB(e.target.value)}
                    placeholder="Kode program PRB"
                  />
                </div>
                
                <div>
                  <Label htmlFor="kodeDPJP">Kode DPJP *</Label>
                  <Input
                    id="kodeDPJP"
                    value={kodeDPJP}
                    onChange={(e) => setKodeDPJP(e.target.value)}
                    placeholder="Kode dokter DPJP"
                  />
                </div>
                
                <div>
                  <Label htmlFor="keterangan">Keterangan *</Label>
                  <Input
                    id="keterangan"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Keterangan tentang pasien"
                  />
                </div>
                
                <div>
                  <Label htmlFor="user">User *</Label>
                  <Input
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="User entri (numerik)"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <Label>Daftar Obat</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddObat}>
                    Tambah Obat
                  </Button>
                </div>
                
                {obatList.map((obat) => (
                  <div key={obat.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md">
                    <div>
                      <Label>Kode Obat</Label>
                      <Input
                        value={obat.kdObat}
                        onChange={(e) => handleObatChange(obat.id, 'kdObat', e.target.value)}
                        placeholder="Kode obat"
                      />
                    </div>
                    
                    <div>
                      <Label>Signa 1</Label>
                      <Input
                        value={obat.signa1}
                        onChange={(e) => handleObatChange(obat.id, 'signa1', e.target.value)}
                        placeholder="Signa 1"
                      />
                    </div>
                    
                    <div>
                      <Label>Signa 2</Label>
                      <Input
                        value={obat.signa2}
                        onChange={(e) => handleObatChange(obat.id, 'signa2', e.target.value)}
                        placeholder="Signa 2"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <div className="w-full">
                        <Label>Jumlah Obat</Label>
                        <Input
                          value={obat.jmlObat}
                          onChange={(e) => handleObatChange(obat.id, 'jmlObat', e.target.value)}
                          placeholder="Jumlah"
                        />
                      </div>
                      {obatList.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="ml-2 h-9 w-9" 
                          onClick={() => handleRemoveObat(obat.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <Label htmlFor="saran">Saran *</Label>
                <Textarea
                  id="saran"
                  value={saran}
                  onChange={(e) => setSaran(e.target.value)}
                  placeholder="Saran dari dokter DPJP"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCreatePRB} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Buat PRB
                    </>
                  )}
                </Button>
              </div>
              
              {prbResult && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pembuatan PRB
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>No. SRB:</strong> {prbResult.noSRB}</p>
                        <p><strong>Tanggal SRB:</strong> {prbResult.tglSRB}</p>
                        <p><strong>DPJP:</strong> {prbResult.DPJP.nama} ({prbResult.DPJP.kode})</p>
                        <p><strong>Program PRB:</strong> {prbResult.programPRB}</p>
                        <p><strong>Keterangan:</strong> {prbResult.keterangan}</p>
                      </div>
                      <div>
                        <p><strong>Nama Pasien:</strong> {prbResult.peserta.nama}</p>
                        <p><strong>No. Kartu:</strong> {prbResult.peserta.noKartu}</p>
                        <p><strong>Email:</strong> {prbResult.peserta.email}</p>
                        <p><strong>Alamat:</strong> {prbResult.peserta.alamat}</p>
                        <p><strong>Saran:</strong> {prbResult.saran}</p>
                      </div>
                    </div>
                    
                    {prbResult.obat?.list && prbResult.obat.list.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Daftar Obat:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nama Obat</TableHead>
                              <TableHead>Signa</TableHead>
                              <TableHead>Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prbResult.obat.list.map((obat: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{obat.nmObat}</TableCell>
                                <TableCell>{obat.signa}</TableCell>
                                <TableCell>{obat.jmlObat}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Ubah Surat Rujuk Balik (PRB)</CardTitle>
              <CardDescription>
                Isi formulir di bawah untuk mengubah data surat rujuk balik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noSrbUpdate">No. SRB *</Label>
                  <Input
                    id="noSrbUpdate"
                    value={noSrb}
                    onChange={(e) => setNoSrb(e.target.value)}
                    placeholder="Nomor Surat Rujuk Balik"
                  />
                </div>
                
                <div>
                  <Label htmlFor="noSepUpdate">No. SEP *</Label>
                  <Input
                    id="noSepUpdate"
                    value={noSep}
                    onChange={(e) => setNoSep(e.target.value)}
                    placeholder="Contoh: 0301R0011017V000015"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alamatUpdate">Alamat *</Label>
                  <Textarea
                    id="alamatUpdate"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Alamat lengkap pasien"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailUpdate">Email *</Label>
                  <Input
                    id="emailUpdate"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: pasien@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="kodeDPJPUpdate">Kode DPJP *</Label>
                  <Input
                    id="kodeDPJPUpdate"
                    value={kodeDPJP}
                    onChange={(e) => setKodeDPJP(e.target.value)}
                    placeholder="Kode dokter DPJP"
                  />
                </div>
                
                <div>
                  <Label htmlFor="userUpdate">User *</Label>
                  <Input
                    id="userUpdate"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="User entri (numerik)"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="keteranganUpdate">Keterangan *</Label>
                <Input
                  id="keteranganUpdate"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan tentang pasien"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="saranUpdate">Saran *</Label>
                <Textarea
                  id="saranUpdate"
                  value={saran}
                  onChange={(e) => setSaran(e.target.value)}
                  placeholder="Saran dari dokter DPJP"
                />
              </div>
              
              <div className="flex justify-between">
                <Button onClick={handleDeletePRB} variant="destructive" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Hapus PRB
                    </>
                  )}
                </Button>
                
                <Button onClick={handleUpdatePRB} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Update PRB
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Cari Data PRB</CardTitle>
              <CardDescription>
                Cari data surat rujuk balik berdasarkan nomor atau rentang tanggal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="noSrbSearch">No. SRB</Label>
                  <Input
                    id="noSrbSearch"
                    value={noSrb}
                    onChange={(e) => setNoSrb(e.target.value)}
                    placeholder="Nomor Surat Rujuk Balik"
                  />
                </div>
                
                <div>
                  <Label htmlFor="noSepSearch">No. SEP</Label>
                  <Input
                    id="noSepSearch"
                    value={noSepSearch}
                    onChange={(e) => setNoSepSearch(e.target.value)}
                    placeholder="Nomor SEP"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglMulaiSearch">Tanggal Mulai</Label>
                  <Input
                    id="tglMulaiSearch"
                    type="date"
                    value={tglMulaiSearch}
                    onChange={(e) => setTglMulaiSearch(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglAkhirSearch">Tanggal Akhir</Label>
                  <Input
                    id="tglAkhirSearch"
                    type="date"
                    value={tglAkhirSearch}
                    onChange={(e) => setTglAkhirSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <Button onClick={handleSearchBySrb} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Berdasarkan SRB
                    </>
                  )}
                </Button>
                
                <Button onClick={handleSearchByDate} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Cari Berdasarkan Tanggal
                    </>
                  )}
                </Button>
              </div>
              
              {prbResult && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Detail PRB
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>No. SRB:</strong> {prbResult.noSRB}</p>
                        <p><strong>No. SEP:</strong> {prbResult.noSEP}</p>
                        <p><strong>Tanggal SRB:</strong> {prbResult.tglSRB}</p>
                        <p><strong>DPJP:</strong> {prbResult.DPJP.nama} ({prbResult.DPJP.kode})</p>
                        <p><strong>Program PRB:</strong> {prbResult.programPRB.nama}</p>
                        <p><strong>Keterangan:</strong> {prbResult.keterangan}</p>
                      </div>
                      <div>
                        <p><strong>Nama Pasien:</strong> {prbResult.peserta.nama}</p>
                        <p><strong>No. Kartu:</strong> {prbResult.peserta.noKartu}</p>
                        <p><strong>Email:</strong> {prbResult.peserta.email}</p>
                        <p><strong>Alamat:</strong> {prbResult.peserta.alamat}</p>
                        <p><strong>Saran:</strong> {prbResult.saran}</p>
                      </div>
                    </div>
                    
                    {prbResult.obat?.obat && prbResult.obat.obat.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Daftar Obat:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nama Obat</TableHead>
                              <TableHead>Kode Obat</TableHead>
                              <TableHead>Signa</TableHead>
                              <TableHead>Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prbResult.obat.obat.map((obat: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{obat.nmObat}</TableCell>
                                <TableCell>{obat.kdObat}</TableCell>
                                <TableCell>{obat.signa1} x {obat.signa2}</TableCell>
                                <TableCell>{obat.jmlObat}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {prbList.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Daftar PRB Berdasarkan Tanggal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. SRB</TableHead>
                          <TableHead>No. SEP</TableHead>
                          <TableHead>Nama Pasien</TableHead>
                          <TableHead>DPJP</TableHead>
                          <TableHead>Tanggal SRB</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prbList.map((prb, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{prb.noSRB}</TableCell>
                            <TableCell>{prb.noSEP}</TableCell>
                            <TableCell>{prb.peserta.nama}</TableCell>
                            <TableCell>{prb.DPJP.nama}</TableCell>
                            <TableCell>{prb.tglSRB}</TableCell>
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
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Rekap Data Peserta Potensi PRB</CardTitle>
              <CardDescription>
                Rekapitulasi data peserta dengan potensi PRB berdasarkan bulan dan tahun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="tahunSummary">Tahun</Label>
                  <Input
                    id="tahunSummary"
                    type="number"
                    min="2000"
                    max="2030"
                    value={tahunSummary}
                    onChange={(e) => setTahunSummary(e.target.value)}
                    placeholder="Contoh: 2023"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bulanSummary">Bulan</Label>
                  <Select value={bulanSummary} onValueChange={setBulanSummary}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Januari (01)</SelectItem>
                      <SelectItem value="02">Februari (02)</SelectItem>
                      <SelectItem value="03">Maret (03)</SelectItem>
                      <SelectItem value="04">April (04)</SelectItem>
                      <SelectItem value="05">Mei (05)</SelectItem>
                      <SelectItem value="06">Juni (06)</SelectItem>
                      <SelectItem value="07">Juli (07)</SelectItem>
                      <SelectItem value="08">Agustus (08)</SelectItem>
                      <SelectItem value="09">September (09)</SelectItem>
                      <SelectItem value="10">Oktober (10)</SelectItem>
                      <SelectItem value="11">November (11)</SelectItem>
                      <SelectItem value="12">Desember (12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mb-6">
                <Button onClick={handleGetSummary} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Rekap PRB
                    </>
                  )}
                </Button>
              </div>
              
              {prbSummary.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Rekap Peserta Potensi PRB
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Peserta</TableHead>
                          <TableHead>No. Kartu</TableHead>
                          <TableHead>No. SEP</TableHead>
                          <TableHead>Tanggal Pelayanan</TableHead>
                          <TableHead>Diagnosa Potensi PRB</TableHead>
                          <TableHead>Kategori Penyakit PRB</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prbSummary.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.NamaPeserta}</TableCell>
                            <TableCell>{item.NomorKartu}</TableCell>
                            <TableCell>{item.NOSEP}</TableCell>
                            <TableCell>{item.TanggalPelayanan}</TableCell>
                            <TableCell>{item.DiagnosaPotensiPRB}</TableCell>
                            <TableCell>{item.KategoriPenyakitPRB}</TableCell>
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
      </Tabs>
    </div>
  );
};

export default BPJSPRBManagement;
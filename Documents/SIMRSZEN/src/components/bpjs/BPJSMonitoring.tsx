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
  Monitor
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const BPJSMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kunjungan' | 'klaim' | 'histori' | 'jasaraharja'>('kunjungan');
  const [loading, setLoading] = useState(false);
  const [tanggalKunjungan, setTanggalKunjungan] = useState('');
  const [jnsPelayananKunjungan, setJnsPelayananKunjungan] = useState('1');
  const [tanggalKlaim, setTanggalKlaim] = useState('');
  const [jnsPelayananKlaim, setJnsPelayananKlaim] = useState('1');
  const [statusKlaim, setStatusKlaim] = useState('1');
  const [noKartuHistori, setNoKartuHistori] = useState('');
  const [tglMulaiHistori, setTglMulaiHistori] = useState('');
  const [tglAkhirHistori, setTglAkhirHistori] = useState('');
  const [jnsPelayananJR, setJnsPelayananJR] = useState('1');
  const [tglMulaiJR, setTglMulaiJR] = useState('');
  const [tglAkhirJR, setTglAkhirJR] = useState('');
  const [kunjunganData, setKunjunganData] = useState<any[]>([]);
  const [klaimData, setKlaimData] = useState<any[]>([]);
  const [historiData, setHistoriData] = useState<any[]>([]);
  const [jrData, setJrData] = useState<any[]>([]);

  const handleGetDataKunjungan = async () => {
    if (!tanggalKunjungan || !jnsPelayananKunjungan) {
      toast.error('Silakan lengkapi tanggal dan jenis pelayanan');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/monitoring/kunjungan/${tanggalKunjungan}/${jnsPelayananKunjungan}`);
      // setKunjunganData(response.data.data.response.sep || []);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          diagnosa: "A00.1 - Cholera due to Vibrio cholerae 01, biovar eltor",
          jnsPelayanan: jnsPelayananKunjungan === '1' ? 'Rawat Inap' : 'Rawat Jalan',
          kelasRawat: 'Kelas 1',
          nama: 'AHMAD JAINUDIN',
          noKartu: '0001234567890',
          noSep: '0301R0011017V000015',
          noRujukan: '0301U01108180200084',
          poli: 'INTERNAL',
          tglPlgSep: '2023-01-10',
          tglSep: tanggalKunjungan
        },
        {
          diagnosa: "I50.0 - Heart Failure",
          jnsPelayanan: jnsPelayananKunjungan === '1' ? 'Rawat Inap' : 'Rawat Jalan',
          kelasRawat: 'Kelas 3',
          nama: 'SITI AISYAH',
          noKartu: '0002345678901',
          noSep: '0301R0011017V000016',
          noRujukan: '0301U01108180200085',
          poli: 'CARDIOLOGY',
          tglPlgSep: '2023-01-08',
          tglSep: tanggalKunjungan
        }
      ];
      
      setKunjunganData(mockData);
      toast.success('Data kunjungan berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data kunjungan');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDataKlaim = async () => {
    if (!tanggalKlaim || !jnsPelayananKlaim || !statusKlaim) {
      toast.error('Silakan lengkapi semua parameter');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/monitoring/klaim/${tanggalKlaim}/${jnsPelayananKlaim}/${statusKlaim}`);
      // setKlaimData(response.data.data.response.klaim || []);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          Inacbg: {
            kode: "N-3-15-0",
            nama: "DIALYSIS"
          },
          biaya: {
            byPengajuan: "991200",
            bySetujui: "0",
            byTarifGruper: "991200",
            byTarifRS: "1170689",
            byTopup: "0"
          },
          kelasRawat: "3",
          noFPK: "",
          noSEP: "0301R00109170001280",
          peserta: {
            nama: "NUR",
            noKartu: "0033681422715",
            noMR: "974956"
          },
          poli: "Hemodialisa",
          status: statusKlaim === '1' ? 'Proses Verifikasi' : statusKlaim === '2' ? 'Pending Verifikasi' : 'Klaim',
          tglPulang: tanggalKlaim,
          tglSep: tanggalKlaim
        },
        {
          Inacbg: {
            kode: "M-4-20-1",
            nama: "SURGERY"
          },
          biaya: {
            byPengajuan: "1500000",
            bySetujui: "1400000",
            byTarifGruper: "1500000",
            byTarifRS: "1600000",
            byTopup: "0"
          },
          kelasRawat: "2",
          noFPK: "FPK-001",
          noSEP: "0301R00109170001281",
          peserta: {
            nama: "YUSUF",
            noKartu: "0223416974628",
            noMR: "878411"
          },
          poli: "BEDAH",
          status: statusKlaim === '1' ? 'Proses Verifikasi' : statusKlaim === '2' ? 'Pending Verifikasi' : 'Klaim',
          tglPulang: tanggalKlaim,
          tglSep: tanggalKlaim
        }
      ];
      
      setKlaimData(mockData);
      toast.success('Data klaim berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data klaim');
    } finally {
      setLoading(false);
    }
  };

  const handleGetHistoriPelayanan = async () => {
    if (!noKartuHistori || !tglMulaiHistori || !tglAkhirHistori) {
      toast.error('Silakan lengkapi nomor kartu dan rentang tanggal');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/monitoring/histori/${noKartuHistori}/${tglMulaiHistori}/${tglAkhirHistori}`);
      // setHistoriData(response.data.data.response.histori || []);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          diagnosa: "A00.1 - Cholera due to Vibrio cholerae 01, biovar eltor",
          jnsPelayanan: "1",
          kelasRawat: "Kelas 1",
          namaPeserta: 'AHMAD JAINUDIN',
          noKartu: noKartuHistori,
          noSep: "0301R0110818V200084",
          noRujukan: "0301U01108180200084",
          poli: "INTERNAL",
          ppkPelayanan: "RS JAKARTA MEDICAL CENTER",
          tglPlgSep: "2023-01-10",
          tglSep: "2023-01-01"
        },
        {
          diagnosa: "I50.0 - Heart Failure",
          jnsPelayanan: "2",
          kelasRawat: "Kelas 2",
          namaPeserta: 'AHMAD JAINUDIN',
          noKartu: noKartuHistori,
          noSep: "0301R0110818V100085",
          noRujukan: "0301U01108180200085",
          poli: "CARDIOLOGY",
          ppkPelayanan: "RS JAKARTA MEDICAL CENTER",
          tglPlgSep: "2023-01-15",
          tglSep: "2023-01-05"
        }
      ];
      
      setHistoriData(mockData);
      toast.success('Histori pelayanan berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat histori pelayanan');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDataJasaRaharja = async () => {
    if (!jnsPelayananJR || !tglMulaiJR || !tglAkhirJR) {
      toast.error('Silakan lengkapi jenis pelayanan dan rentang tanggal');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/monitoring/jasaraharja/${jnsPelayananJR}/${tglMulaiJR}/${tglAkhirJR}`);
      // setJrData(response.data.data.response.jaminan || []);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          sep: {
            noSEP: "0301R0110818V100085",
            tglSEP: "2023-01-01",
            tglPlgSEP: "2023-01-05",
            noMr: "MR-001",
            jnsPelayanan: jnsPelayananJR,
            poli: "INTERNAL",
            diagnosa: "A00.1",
            peserta: {
              noKartu: "0001161271256",
              nama: "JASA RAHARJA PATIENT",
              noMR: "MR-001"
            }
          },
          jasaRaharja: {
            tglKejadian: "2023-01-01",
            noRegister: "JR-001",
            ketStatusDijamin: "Dijamin",
            ketStatusDikirim: "Sukses",
            biayaDijamin: "1000000",
            plafon: "20000000",
            jmlDibayar: "950000",
            resultsJasaRaharja: "Sukses"
          }
        },
        {
          sep: {
            noSEP: "0301R0110818V100185",
            tglSEP: "2023-01-10",
            tglPlgSEP: "2023-01-15",
            noMr: "MR-002",
            jnsPelayanan: jnsPelayananJR,
            poli: "ORTOPEDI",
            diagnosa: "S82.0",
            peserta: {
              noKartu: "0003361271256",
              nama: "JASA RAHARJA PATIENT 2",
              noMR: "MR-002"
            }
          },
          jasaRaharja: {
            tglKejadian: "2023-01-10",
            noRegister: "JR-002",
            ketStatusDijamin: "Dijamin",
            ketStatusDikirim: "Sukses",
            biayaDijamin: "2500000",
            plafon: "20000000",
            jmlDibayar: "2400000",
            resultsJasaRaharja: "Sukses"
          }
        }
      ];
      
      setJrData(mockData);
      toast.success('Data klaim Jasa Raharja berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data klaim Jasa Raharja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Monitor className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Monitoring BPJS</h1>
        </div>
        <p className="text-muted-foreground">
          Monitoring dan pelaporan data kesehatan dari sistem BPJS Kesehatan
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'kunjungan' | 'klaim' | 'histori' | 'jasaraharja')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
          <TabsTrigger value="klaim">Klaim</TabsTrigger>
          <TabsTrigger value="histori">Histori Peserta</TabsTrigger>
          <TabsTrigger value="jasaraharja">Jasa Raharja</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kunjungan">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Data Kunjungan</CardTitle>
              <CardDescription>
                Data kunjungan pasien berdasarkan tanggal dan jenis pelayanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="tanggalKunjungan">Tanggal SEP</Label>
                  <Input
                    id="tanggalKunjungan"
                    type="date"
                    value={tanggalKunjungan}
                    onChange={(e) => setTanggalKunjungan(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jnsPelayananKunjungan">Jenis Pelayanan</Label>
                  <Select value={jnsPelayananKunjungan} onValueChange={setJnsPelayananKunjungan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pelayanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGetDataKunjungan} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Data Kunjungan
                    </>
                  )}
                </Button>
              </div>
              
              {kunjunganData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Data Kunjungan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. SEP</TableHead>
                          <TableHead>Nama Pasien</TableHead>
                          <TableHead>No. Kartu</TableHead>
                          <TableHead>Diagnosa</TableHead>
                          <TableHead>Jenis Pelayanan</TableHead>
                          <TableHead>Tgl. SEP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kunjunganData.map((kunjungan, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{kunjungan.noSep}</TableCell>
                            <TableCell>{kunjungan.nama}</TableCell>
                            <TableCell>{kunjungan.noKartu}</TableCell>
                            <TableCell>{kunjungan.diagnosa}</TableCell>
                            <TableCell>{kunjungan.jnsPelayanan}</TableCell>
                            <TableCell>{kunjungan.tglSep}</TableCell>
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
        
        <TabsContent value="klaim">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Data Klaim</CardTitle>
              <CardDescription>
                Data klaim berdasarkan tanggal pulang, jenis pelayanan, dan status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="tanggalKlaim">Tanggal Pulang</Label>
                  <Input
                    id="tanggalKlaim"
                    type="date"
                    value={tanggalKlaim}
                    onChange={(e) => setTanggalKlaim(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jnsPelayananKlaim">Jenis Pelayanan</Label>
                  <Select value={jnsPelayananKlaim} onValueChange={setJnsPelayananKlaim}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pelayanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="statusKlaim">Status Klaim</Label>
                  <Select value={statusKlaim} onValueChange={setStatusKlaim}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status klaim" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Proses Verifikasi</SelectItem>
                      <SelectItem value="2">Pending Verifikasi</SelectItem>
                      <SelectItem value="3">Klaim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGetDataKlaim} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Data Klaim
                    </>
                  )}
                </Button>
              </div>
              
              {klaimData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Data Klaim
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. SEP</TableHead>
                          <TableHead>Nama Pasien</TableHead>
                          <TableHead>No. Kartu</TableHead>
                          <TableHead>Poli</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Biaya Diajukan</TableHead>
                          <TableHead>Biaya Disetujui</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {klaimData.map((klaim, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{klaim.noSEP}</TableCell>
                            <TableCell>{klaim.peserta.nama}</TableCell>
                            <TableCell>{klaim.peserta.noKartu}</TableCell>
                            <TableCell>{klaim.poli}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  klaim.status === 'Proses Verifikasi' ? 'default' : 
                                  klaim.status === 'Pending Verifikasi' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {klaim.status}
                              </Badge>
                            </TableCell>
                            <TableCell>Rp {parseInt(klaim.biaya.byPengajuan).toLocaleString()}</TableCell>
                            <TableCell>Rp {parseInt(klaim.biaya.bySetujui).toLocaleString()}</TableCell>
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
        
        <TabsContent value="histori">
          <Card>
            <CardHeader>
              <CardTitle>Histori Pelayanan Peserta</CardTitle>
              <CardDescription>
                Riwayat pelayanan kesehatan peserta berdasarkan nomor kartu dan rentang tanggal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="noKartuHistori">No. Kartu Peserta</Label>
                  <Input
                    id="noKartuHistori"
                    value={noKartuHistori}
                    onChange={(e) => setNoKartuHistori(e.target.value)}
                    placeholder="Contoh: 0001234567890"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglMulaiHistori">Tanggal Mulai</Label>
                  <Input
                    id="tglMulaiHistori"
                    type="date"
                    value={tglMulaiHistori}
                    onChange={(e) => setTglMulaiHistori(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglAkhirHistori">Tanggal Akhir</Label>
                  <Input
                    id="tglAkhirHistori"
                    type="date"
                    value={tglAkhirHistori}
                    onChange={(e) => setTglAkhirHistori(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGetHistoriPelayanan} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Histori Pelayanan
                    </>
                  )}
                </Button>
              </div>
              
              {historiData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Histori Pelayanan Peserta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. SEP</TableHead>
                          <TableHead>Nama Peserta</TableHead>
                          <TableHead>No. Kartu</TableHead>
                          <TableHead>Diagnosa</TableHead>
                          <TableHead>Poli</TableHead>
                          <TableHead>Tgl. SEP</TableHead>
                          <TableHead>PPK Pelayanan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historiData.map((histori, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{histori.noSep}</TableCell>
                            <TableCell>{histori.namaPeserta}</TableCell>
                            <TableCell>{histori.noKartu}</TableCell>
                            <TableCell>{histori.diagnosa}</TableCell>
                            <TableCell>{histori.poli}</TableCell>
                            <TableCell>{histori.tglSep}</TableCell>
                            <TableCell>{histori.ppkPelayanan}</TableCell>
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
        
        <TabsContent value="jasaraharja">
          <Card>
            <CardHeader>
              <CardTitle>Data Klaim Jaminan Jasa Raharja</CardTitle>
              <CardDescription>
                Data klaim jaminan Jasa Raharja berdasarkan jenis pelayanan dan rentang tanggal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="jnsPelayananJR">Jenis Pelayanan</Label>
                  <Select value={jnsPelayananJR} onValueChange={setJnsPelayananJR}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pelayanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tglMulaiJR">Tanggal Mulai</Label>
                  <Input
                    id="tglMulaiJR"
                    type="date"
                    value={tglMulaiJR}
                    onChange={(e) => setTglMulaiJR(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tglAkhirJR">Tanggal Akhir</Label>
                  <Input
                    id="tglAkhirJR"
                    type="date"
                    value={tglAkhirJR}
                    onChange={(e) => setTglAkhirJR(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGetDataJasaRaharja} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Data Jasa Raharja
                    </>
                  )}
                </Button>
              </div>
              
              {jrData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Data Klaim Jaminan Jasa Raharja
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {jrData.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">SEP: {item.sep.noSEP}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p><strong>Nama:</strong> {item.sep.peserta.nama}</p>
                              <p><strong>No. Kartu:</strong> {item.sep.peserta.noKartu}</p>
                              <p><strong>Poli:</strong> {item.sep.poli}</p>
                              <p><strong>Diagnosa:</strong> {item.sep.diagnosa}</p>
                            </div>
                            <div>
                              <p><strong>Tgl. SEP:</strong> {item.sep.tglSEP}</p>
                              <p><strong>Tgl. Pulang:</strong> {item.sep.tglPlgSEP}</p>
                              <p><strong>Jenis Pelayanan:</strong> {item.sep.jnsPelayanan === '1' ? 'Rawat Inap' : 'Rawat Jalan'}</p>
                              <p><strong>No. MR:</strong> {item.sep.noMr}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium mb-2">Detail Jasa Raharja:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p><strong>Tanggal Kejadian:</strong> {item.jasaRaharja.tglKejadian}</p>
                                <p><strong>No. Register:</strong> {item.jasaRaharja.noRegister}</p>
                                <p><strong>Status Dijamin:</strong> {item.jasaRaharja.ketStatusDijamin}</p>
                              </div>
                              <div>
                                <p><strong>Biaya Dijamin:</strong> Rp {parseInt(item.jasaRaharja.biayaDijamin).toLocaleString()}</p>
                                <p><strong>Plafon:</strong> Rp {parseInt(item.jasaRaharja.plafon).toLocaleString()}</p>
                                <p><strong>Jumlah Dibayar:</strong> Rp {parseInt(item.jasaRaharja.jmlDibayar).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default BPJSMonitoring;
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
  ShieldCheck,
  Users,
  Calendar,
  Stethoscope,
  Clock,
  Pill,
  HeartPulse,
  Activity,
  Bed
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import BPJSAvailabilityManagement from './BPJSAvailabilityManagement';
import BPJSVClaim2Management from './BPJSVClaim2Management';

// Import komponen PRB
import BPJSPRBManagement from './BPJSPRBManagement';

// Import komponen monitoring
import BPJSMonitoring from './BPJSMonitoring';

// Import komponen referensi
import BPJSReferenceManagement from './BPJSReferenceManagement';

interface ParticipantData {
  noKartu: string;
  nama: string;
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  statusPeserta: {
    kode: string;
    nama: string;
  };
  jnsPeserta: {
    kode: string;
    nama: string;
  };
  hki: {
    noHKI: string;
    nama: string;
  };
  provUmum: {
    kdProvider: string;
    nmProvider: string;
  };
  cob: {
    nmAsuransi: string;
    noAsuransi: string;
    tglTAT: string;
    tglNA: string;
  };
  htl: Array<{
    tglHtl: string;
    nmHtl: string;
    jnsHtl: string;
  }>;
  informasi: {
    alamat: string;
    noHP: string;
    tglCetakKartu: string;
    tglTAT: string;
    tglNa: string;
    sex: string;
    kelasTanggungan: {
      kode: string;
      nama: string;
    };
    noMr: string;
    ppkRujukan: {
      kdPPK: string;
      nmPPK: string;
    };
    provinsi: {
     kdPropinsi: string;
      nmPropinsi: string;
    };
    kabupaten: {
      kdKabupaten: string;
      nmKabupaten: string;
    };
    kecamatan: {
      kdKecamatan: string;
      nmKecamatan: string;
    };
    desa: {
      kdDesa: string;
      nmDesa: string;
    };
    noTelepon: string;
  };
}

interface Doctor {
  kode: string;
  nama: string;
}

interface Poli {
  kode: string;
  nama: string;
}

interface AntreanData {
  kodebooking: string;
  tanggaloperasi: string;
  jenispasien: string;
  nomorantrean: string;
  estimasidilayani: string;
  sisakuotajkn: number;
  kuotajkn: number;
  sisakuotanonjkn: number;
  kuotanonjkn: number;
}

interface ResepData {
  kodebooking: string;
  nomorantrean: string;
  tanggalresep: string;
  jenisresep: string;
  obat: Array<{
    kode: string;
    nama: string;
    jumlah: number;
    aturan_pakai: string;
  }>;
}

const BPJSIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'antrean' | 'apotek' | 'icare' | 'master' | 'availability' | 'vclaim2' | 'monitoring' | 'prb' | 'reference' | 'rujukan' | 'sep' | 'settings'>('verification');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('RSNUBWI1');
  const [password, setPassword] = useState('@Rsnubwi1');
  const [apiKey, setApiKey] = useState('');
  const [noKartu, setNoKartu] = useState('');
  const [nik, setNik] = useState('');
  const [tanggalPelayanan, setTanggalPelayanan] = useState(new Date().toISOString().split('T')[0]);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [polis, setPolis] = useState<Poli[]>([]);
  const [searchType, setSearchType] = useState<'kartu' | 'nik'>('kartu');
  const [serviceType, setServiceType] = useState<'vclaim' | 'pcare'>('pcare');
  const [tanggalAntrean, setTanggalAntrean] = useState(new Date().toISOString().split('T')[0]);
  const [kodePoliAntrean, setKodePoliAntrean] = useState('');
  const [antreanList, setAntreanList] = useState<AntreanData[]>([]);
  const [kodeBookingResep, setKodeBookingResep] = useState('');
  const [resepData, setResepData] = useState<ResepData | null>(null);

  const handleSaveCredentials = async () => {
    if (!username || !password || !apiKey) {
      toast.error('Silakan lengkapi semua kredensial BPJS');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // await apiClient.post('/bpjs/credentials', { username, password, apiKey });
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Kredensial BPJS Kesehatan berhasil disimpan');
    } catch (error: any) {
      toast.error('Gagal menyimpan kredensial BPJS Kesehatan');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchParticipant = async () => {
    if ((searchType === 'kartu' && !noKartu) || (searchType === 'nik' && !nik)) {
      toast.error(`Silakan masukkan nomor ${searchType === 'kartu' ? 'kartu' : 'NIK'} terlebih dahulu`);
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      let response;
      if (serviceType === 'vclaim') {
        if (searchType === 'kartu') {
          // response = await apiClient.get(`/bpjs/vclaim/peserta/kartu/${noKartu}`);
        } else {
          // response = await apiClient.get(`/bpjs/vclaim/peserta/nik/${nik}`);
        }
      } else {
        if (searchType === 'kartu') {
          // response = await apiClient.get(`/bpjs/pcare/peserta/kartu/${noKartu}/tglPelayanan/${tanggalPelayanan}`);
        } else {
          // response = await apiClient.get(`/bpjs/pcare/peserta/nik/${nik}/tglPelayanan/${tanggalPelayanan}`);
        }
      }
      
      // Simulasi data peserta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: ParticipantData = {
        noKartu: searchType === 'kartu' ? noKartu : '0001234567890',
        nama: 'AHMAD JAINUDIN',
        nik: searchType === 'nik' ? nik : '3201234567890123',
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
      
      setParticipantData(mockData);
      toast.success(`Data peserta ${serviceType.toUpperCase()} ditemukan`);
    } catch (error: any) {
      toast.error(`Gagal mencari data peserta ${serviceType.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAntrean = async () => {
    if (!tanggalAntrean || !kodePoliAntrean) {
      toast.error('Silakan lengkapi tanggal dan kode poli');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/antrean/rs/${tanggalAntrean}/poli/${kodePoliAntrean}`);
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockAntrean: AntreanData[] = [
        {
          kodebooking: '20230101XYZ123',
          tanggaloperasi: '2023-01-01',
          jenispasien: 'JKN',
          nomorantrean: '1',
          estimasidilayani: '2023-01-01 08:00:00',
          sisakuotajkn: 25,
          kuotajkn: 30,
          sisakuotanonjkn: 5,
          kuotanonjkn: 10
        },
        {
          kodebooking: '20230101ABC456',
          tanggaloperasi: '2023-01-01',
          jenispasien: 'NON-JKN',
          nomorantrean: '2',
          estimasidilayani: '2023-01-01 08:15:00',
          sisakuotajkn: 24,
          kuotajkn: 30,
          sisakuotanonjkn: 4,
          kuotanonjkn: 10
        }
      ];
      
      setAntreanList(mockAntrean);
      toast.success('Data antrean berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data antrean');
    } finally {
      setLoading(false);
    }
  };

  const handleGetResep = async () => {
    if (!kodeBookingResep) {
      toast.error('Silakan masukkan kode booking resep');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/apotek/resep/${kodeBookingResep}`);
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockResep: ResepData = {
        kodebooking: kodeBookingResep,
        nomorantrean: '1',
        tanggalresep: '2023-01-01',
        jenisresep: 'Racikan',
        obat: [
          {
            kode: 'OB001',
            nama: 'Paracetamol 500mg',
            jumlah: 10,
            aturan_pakai: '3x1 sehari sebelum makan'
          },
          {
            kode: 'OB002',
            nama: 'Amoxicillin 250mg',
            jumlah: 10,
            aturan_pakai: '3x1 sehari sesudah makan'
          }
        ]
      };
      
      setResepData(mockResep);
      toast.success('Data resep berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data resep');
    } finally {
      setLoading(false);
    }
  };

  const handleGetMasterData = async () => {
    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const dokterResponse = await apiClient.get('/bpjs/dokter');
      // const poliResponse = await apiClient.get('/bpjs/poli');
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockDoctors: Doctor[] = [
        { kode: '001', nama: 'Dr. Ahmad Santoso, Sp.OG' },
        { kode: '002', nama: 'Dr. Siti Rahayu, Sp.PD' },
        { kode: '003', nama: 'Dr. Budiarto, Sp.BM' },
      ];
      
      const mockPolis: Poli[] = [
        { kode: 'INT', nama: 'INTERNAL' },
        { kode: 'BED', nama: 'BEDAH' },
        { kode: 'IGD', nama: 'INSTALASI GAWAT DARURAT' },
      ];
      
      setDoctors(mockDoctors);
      setPolis(mockPolis);
      
      toast.success('Data master BPJS berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat data master BPJS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    handleGetMasterData();
  }, []);

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
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Integrasi BPJS Kesehatan</h1>
        </div>
        <p className="text-muted-foreground">
          Integrasi dengan sistem BPJS Kesehatan untuk verifikasi peserta dan manajemen data
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'verification' | 'antrean' | 'apotek' | 'icare' | 'master' | 'availability' | 'vclaim2' | 'monitoring' | 'prb' | 'reference' | 'rujukan' | 'sep' | 'settings')}>
        <TabsList className="grid w-full grid-cols-13">
          <TabsTrigger value="verification">Verifikasi Peserta</TabsTrigger>
          <TabsTrigger value="antrean">Antrean RS</TabsTrigger>
          <TabsTrigger value="apotek">Apotek</TabsTrigger>
          <TabsTrigger value="icare">iCare</TabsTrigger>
          <TabsTrigger value="master">Data Master</TabsTrigger>
          <TabsTrigger value="availability">Ketersediaan Kamar</TabsTrigger>
          <TabsTrigger value="vclaim2">VClaim 2.0</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="prb">PRB</TabsTrigger>
          <TabsTrigger value="reference">Referensi</TabsTrigger>
          <TabsTrigger value="rujukan">Rujukan</TabsTrigger>
          <TabsTrigger value="sep">SEP</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi Peserta BPJS</CardTitle>
              <CardDescription>
                Verifikasi data peserta BPJS berdasarkan nomor kartu atau NIK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="serviceType">Layanan</Label>
                    <Select value={serviceType} onValueChange={(value: 'vclaim' | 'pcare') => setServiceType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcare">PCare</SelectItem>
                        <SelectItem value="vclaim">VClaim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="searchType">Metode Pencarian</Label>
                    <Select value={searchType} onValueChange={(value: 'kartu' | 'nik') => setSearchType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kartu">Nomor Kartu</SelectItem>
                        <SelectItem value="nik">NIK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {searchType === 'kartu' ? (
                    <div>
                      <Label htmlFor="noKartu">Nomor Kartu BPJS</Label>
                      <Input
                        id="noKartu"
                        value={noKartu}
                        onChange={(e) => setNoKartu(e.target.value)}
                        placeholder="Contoh: 0001234567890"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="nik">NIK Peserta</Label>
                      <Input
                        id="nik"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="Contoh: 3201234567890123"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="tanggalPelayanan">Tanggal Pelayanan</Label>
                    <Input
                      id="tanggalPelayanan"
                      type="date"
                      value={tanggalPelayanan}
                      onChange={(e) => setTanggalPelayanan(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSearchParticipant} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Memeriksa...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Verifikasi Peserta
                      </>
                    )}
                  </Button>
                </div>
                
                {participantData && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Data Peserta Ditemukan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Nomor Kartu</Label>
                          <p className="mt-1 font-mono bg-muted p-2 rounded">{participantData.noKartu}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Nama</Label>
                          <p className="mt-1">{participantData.nama}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">NIK</Label>
                          <p className="mt-1">{participantData.nik}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Jenis Kelamin</Label>
                          <p className="mt-1">{participantData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Tanggal Lahir</Label>
                          <p className="mt-1">{new Date(participantData.tanggalLahir).toLocaleDateString('id-ID')}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Status Peserta</Label>
                          <div className="mt-1">
                            <Badge variant="success">{participantData.statusPeserta.nama}</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Jenis Peserta</Label>
                          <p className="mt-1">{participantData.jnsPeserta.nama}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Kelas Tanggungan</Label>
                          <p className="mt-1">{participantData.informasi.kelasTanggungan.nama}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium">Alamat</Label>
                          <p className="mt-1">{participantData.informasi.alamat}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">No. HP</Label>
                          <p className="mt-1">{participantData.informasi.noHP}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Faskes Rujukan</Label>
                          <p className="mt-1">{participantData.informasi.ppkRujukan.nmPPK}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="antrean">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Antrean RS</CardTitle>
              <CardDescription>
                Informasi antrean pasien di rumah sakit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tanggalAntrean">Tanggal Antrean</Label>
                    <Input
                      id="tanggalAntrean"
                      type="date"
                      value={tanggalAntrean}
                      onChange={(e) => setTanggalAntrean(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="kodePoliAntrean">Kode Poli</Label>
                    <Input
                      id="kodePoliAntrean"
                      value={kodePoliAntrean}
                      onChange={(e) => setKodePoliAntrean(e.target.value)}
                      placeholder="Contoh: INT"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleGetAntrean} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Muat Data Antrean
                      </>
                    )}
                  </Button>
                </div>
                
                {antreanList.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Daftar Antrean
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kode Booking</TableHead>
                            <TableHead>Nomor Antrean</TableHead>
                            <TableHead>Jenis Pasien</TableHead>
                            <TableHead>Estimasi Layanan</TableHead>
                            <TableHead>Sisa Kuota JKN</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {antreanList.map((antrean, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{antrean.kodebooking}</TableCell>
                              <TableCell>{antrean.nomorantrean}</TableCell>
                              <TableCell>{antrean.jenispasien}</TableCell>
                              <TableCell>{antrean.estimasidilayani}</TableCell>
                              <TableCell>{antrean.sisakuotajkn}/{antrean.kuotajkn}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apotek">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Apotek</CardTitle>
              <CardDescription>
                Informasi resep dan obat dari sistem apotek
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="kodeBookingResep">Kode Booking Resep</Label>
                    <Input
                      id="kodeBookingResep"
                      value={kodeBookingResep}
                      onChange={(e) => setKodeBookingResep(e.target.value)}
                      placeholder="Contoh: 20230101XYZ123"
                    />
                  </div>
                  
                  <div className="self-end">
                    <Button onClick={handleGetResep} disabled={loading}>
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          <Pill className="mr-2 h-4 w-4" />
                          Muat Data Resep
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {resepData && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Detail Resep
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Kode Booking</Label>
                          <p className="mt-1">{resepData.kodebooking}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Nomor Antrean</Label>
                          <p className="mt-1">{resepData.nomorantrean}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Tanggal Resep</Label>
                          <p className="mt-1">{new Date(resepData.tanggalresep).toLocaleDateString('id-ID')}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Jenis Resep</Label>
                          <p className="mt-1">{resepData.jenisresep}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium mb-2">Obat</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode Obat</TableHead>
                              <TableHead>Nama Obat</TableHead>
                              <TableHead>Jumlah</TableHead>
                              <TableHead>Aturan Pakai</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {resepData.obat.map((obat, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{obat.kode}</TableCell>
                                <TableCell>{obat.nama}</TableCell>
                                <TableCell>{obat.jumlah}</TableCell>
                                <TableCell>{obat.aturan_pakai}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="icare">
          <Card>
            <CardHeader>
              <CardTitle>iCare JKN</CardTitle>
              <CardDescription>
                Informasi kesehatan pasien dari sistem iCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Modul iCare JKN</h3>
                <p className="text-muted-foreground mb-4">
                  Modul ini digunakan untuk mengakses data kesehatan pasien dari sistem iCare JKN berdasarkan NIK.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nikICare">NIK Pasien</Label>
                    <div className="flex gap-2">
                      <Input
                        id="nikICare"
                        placeholder="Masukkan NIK pasien"
                      />
                      <Button disabled>
                        <Search className="h-4 w-4 mr-2" />
                        Cari
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="master">
          <Card>
            <CardHeader>
              <CardTitle>Data Master BPJS</CardTitle>
              <CardDescription>
                Data master dokter dan poli dari sistem BPJS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Daftar Dokter</h3>
                    <Button variant="outline" size="sm" onClick={handleGetMasterData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Muat Ulang
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Dokter</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.length > 0 ? (
                        doctors.map((doc) => (
                          <TableRow key={doc.kode}>
                            <TableCell className="font-medium">{doc.kode}</TableCell>
                            <TableCell>{doc.nama}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            Tidak ada data dokter
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Daftar Poli</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Poli</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {polis.length > 0 ? (
                        polis.map((poli) => (
                          <TableRow key={poli.kode}>
                            <TableCell className="font-medium">{poli.kode}</TableCell>
                            <TableCell>{poli.nama}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            Tidak ada data poli
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability">
          <BPJSAvailabilityManagement />
        </TabsContent>
        
        <TabsContent value="vclaim2">
          <BPJSVClaim2Management />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <BPJSMonitoring />
        </TabsContent>
        
        <TabsContent value="prb">
          <BPJSPRBManagement />
        </TabsContent>
        
        <TabsContent value="reference">
          <BPJSReferenceManagement />
        </TabsContent>
        
        <TabsContent value="rujukan">
          <BPJSVClaim2Management />
        </TabsContent>
        
        <TabsContent value="sep">
          <BPJSVClaim2Management />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Integrasi BPJS</CardTitle>
              <CardDescription>
                Atur kredensial untuk mengakses API BPJS Kesehatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bpjsUsername">Username</Label>
                  <Input
                    id="bpjsUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username dari BPJS"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bpjsPassword">Password</Label>
                  <Input
                    id="bpjsPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password dari BPJS"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bpjsApiKey">API Key (Cons ID)</Label>
                  <Input
                    id="bpjsApiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Masukkan API Key dari BPJS"
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
                  Kredensial ini digunakan untuk mengakses API BPJS Kesehatan. Pastikan untuk menjaga 
                  kerahasiaan data ini. Untuk informasi lebih lanjut kunjungi{' '}
                  <a 
                    href="https://dvlp.bpjs-kesehatan.go.id:8888/trust-mark/login.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Developer Portal BPJS Kesehatan
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BPJSIntegration;
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
  Plus,
  Trash2,
  Bed
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface BedClass {
  kodekelas: string;
  namakelas: string;
}

interface RoomAvailability {
  kodekelas: string;
  koderuang: string;
  namaruang: string;
  kapasitas: string;
  tersedia: string;
  tersediapria?: string;
  tersediawanita?: string;
  tersediapriawanita?: string;
}

const BPJSAvailabilityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'refkelas' | 'manage' | 'view'>('refkelas');
  const [loading, setLoading] = useState(false);
  const [bedClasses, setBedClasses] = useState<BedClass[]>([]);
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [kodePpk, setKodePpk] = useState('');
  const [start, setStart] = useState('1');
  const [limit, setLimit] = useState('10');
  
  // Form states
  const [formData, setFormData] = useState<Omit<RoomAvailability, 'kodekelas' | 'koderuang'> & { kodekelas: string; koderuang: string }>({
    kodekelas: '',
    koderuang: '',
    namaruang: '',
    kapasitas: '0',
    tersedia: '0',
    tersediapria: '0',
    tersediawanita: '0',
    tersediapriawanita: '0'
  });
  
  const [deleteData, setDeleteData] = useState({ kodekelas: '', koderuang: '' });

  const handleGetBedClassReference = async () => {
    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get('/bpjs/aplicares/ref/kelas');
      // setBedClasses(response.data.data.response.list);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClasses: BedClass[] = [
        { kodekelas: 'VVIP', namakelas: 'VVIP' },
        { kodekelas: 'VIP', namakelas: 'VIP' },
        { kodekelas: 'I', namakelas: 'Kelas I' },
        { kodekelas: 'II', namakelas: 'Kelas II' },
        { kodekelas: 'III', namakelas: 'Kelas III' },
        { kodekelas: 'NON', namakelas: '-' }
      ];
      
      setBedClasses(mockClasses);
      toast.success('Referensi kelas kamar berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat referensi kelas kamar');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRoomAvailability = async () => {
    if (!kodePpk || !start || !limit) {
      toast.error('Silakan lengkapi kode PPK, start, dan limit');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // const response = await apiClient.get(`/bpjs/aplicares/bed/read/${kodePpk}/${start}/${limit}`);
      // setRooms(response.data.data.response.list);
      
      // Simulasi data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRooms: RoomAvailability[] = [
        {
          kodekelas: 'VIP',
          koderuang: 'RG01',
          namaruang: 'Ruang Anggrek VIP',
          kapasitas: '20',
          tersedia: '10',
          tersediapria: '5',
          tersediawanita: '3',
          tersediapriawanita: '2'
        },
        {
          kodekelas: 'I',
          koderuang: 'RG02',
          namaruang: 'Ruang Mawar I',
          kapasitas: '15',
          tersedia: '5',
          tersediapria: '2',
          tersediawanita: '2',
          tersediapriawanita: '1'
        }
      ];
      
      setRooms(mockRooms);
      toast.success('Ketersediaan kamar berhasil dimuat');
    } catch (error: any) {
      toast.error('Gagal memuat ketersediaan kamar');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateRoom = async () => {
    if (!kodePpk) {
      toast.error('Silakan isi kode PPK');
      return;
    }

    if (!formData.kodekelas || !formData.koderuang || !formData.namaruang || 
        !formData.kapasitas || !formData.tersedia) {
      toast.error('Silakan lengkapi semua field wajib');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // Jika update
      // await apiClient.post(`/bpjs/aplicares/bed/update/${kodePpk}`, formData);
      // Jika create
      // await apiClient.post(`/bpjs/aplicares/bed/create/${kodePpk}`, formData);
      
      // Simulasi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(formData.koderuang ? 'Kamar berhasil diperbarui' : 'Kamar baru berhasil ditambahkan');
      setFormData({
        kodekelas: '',
        koderuang: '',
        namaruang: '',
        kapasitas: '0',
        tersedia: '0',
        tersediapria: '0',
        tersediawanita: '0',
        tersediapriawanita: '0'
      });
    } catch (error: any) {
      toast.error('Gagal menyimpan data kamar');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!kodePpk || !deleteData.kodekelas || !deleteData.koderuang) {
      toast.error('Silakan lengkapi kode PPK, kode kelas, dan kode ruang');
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, kita akan memanggil:
      // await apiClient.post(`/bpjs/aplicares/bed/delete/${kodePpk}`, deleteData);
      
      // Simulasi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Kamar berhasil dihapus');
      setDeleteData({ kodekelas: '', koderuang: '' });
    } catch (error: any) {
      toast.error('Gagal menghapus kamar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetBedClassReference();
  }, []);

  if (loading && activeTab !== 'refkelas') {
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
          <Bed className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Ketersediaan Kamar BPJS</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola ketersediaan tempat tidur dan ruangan rumah sakit untuk integrasi dengan BPJS
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'refkelas' | 'manage' | 'view')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="refkelas">Referensi Kelas</TabsTrigger>
          <TabsTrigger value="manage">Kelola Kamar</TabsTrigger>
          <TabsTrigger value="view">Lihat Ketersediaan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="refkelas">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Kelas Kamar</CardTitle>
              <CardDescription>
                Daftar kelas kamar berdasarkan standar BPJS Kesehatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={handleGetBedClassReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Muat Ulang
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Muat Ulang
                    </>
                  )}
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Kelas</TableHead>
                    <TableHead>Nama Kelas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bedClasses.length > 0 ? (
                    bedClasses.map((kelas, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{kelas.kodekelas}</TableCell>
                        <TableCell>{kelas.namakelas}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        Tidak ada data kelas kamar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Kelola Kamar Rawat Inap</CardTitle>
              <CardDescription>
                Tambah, ubah, atau hapus informasi kamar dan ketersediaan tempat tidur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="kodePpk">Kode PPK (Rumah Sakit)</Label>
                    <Input
                      id="kodePpk"
                      value={kodePpk}
                      onChange={(e) => setKodePpk(e.target.value)}
                      placeholder="Contoh: 0001R001"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kodekelas">Kode Kelas *</Label>
                      <Select value={formData.kodekelas} onValueChange={(value) => setFormData({...formData, kodekelas: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {bedClasses.map((kelas, idx) => (
                            <SelectItem key={idx} value={kelas.kodekelas}>
                              {kelas.namakelas}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="koderuang">Kode Ruang *</Label>
                      <Input
                        id="koderuang"
                        value={formData.koderuang}
                        onChange={(e) => setFormData({...formData, koderuang: e.target.value})}
                        placeholder="Contoh: RG01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="namaruang">Nama Ruang *</Label>
                    <Input
                      id="namaruang"
                      value={formData.namaruang}
                      onChange={(e) => setFormData({...formData, namaruang: e.target.value})}
                      placeholder="Contoh: Ruang Anggrek VIP"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kapasitas">Kapasitas *</Label>
                      <Input
                        id="kapasitas"
                        type="number"
                        value={formData.kapasitas}
                        onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
                        placeholder="Total tempat tidur"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tersedia">Tersedia *</Label>
                      <Input
                        id="tersedia"
                        type="number"
                        value={formData.tersedia}
                        onChange={(e) => setFormData({...formData, tersedia: e.target.value})}
                        placeholder="Jumlah tempat tidur kosong"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Untuk rumah sakit yang ingin mencantumkan informasi ketersediaan tempat tidur berdasarkan jenis kelamin pasien
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tersediapria">Tersedia Pria</Label>
                      <Input
                        id="tersediapria"
                        type="number"
                        value={formData.tersediapria}
                        onChange={(e) => setFormData({...formData, tersediapria: e.target.value})}
                        placeholder="Jumlah TT pria"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tersediawanita">Tersedia Wanita</Label>
                      <Input
                        id="tersediawanita"
                        type="number"
                        value={formData.tersediawanita}
                        onChange={(e) => setFormData({...formData, tersediawanita: e.target.value})}
                        placeholder="Jumlah TT wanita"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tersediapriawanita">Pria/Wanita</Label>
                      <Input
                        id="tersediapriawanita"
                        type="number"
                        value={formData.tersediapriawanita}
                        onChange={(e) => setFormData({...formData, tersediapriawanita: e.target.value})}
                        placeholder="Jumlah TT campur"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateOrUpdateRoom} disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Simpan
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          {formData.koderuang ? 'Perbarui Kamar' : 'Tambah Kamar Baru'}
                        </>
                      )}
                    </Button>
                    
                    {formData.koderuang && (
                      <Button 
                        variant="outline" 
                        onClick={() => setFormData({
                          kodekelas: '',
                          koderuang: '',
                          namaruang: '',
                          kapasitas: '0',
                          tersedia: '0',
                          tersediapria: '0',
                          tersediawanita: '0',
                          tersediapriawanita: '0'
                        })}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Hapus Kamar</CardTitle>
                      <CardDescription>
                        Hapus informasi kamar dari sistem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="delKodekelas">Kode Kelas *</Label>
                          <Select 
                            value={deleteData.kodekelas} 
                            onValueChange={(value) => setDeleteData({...deleteData, kodekelas: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {bedClasses.map((kelas, idx) => (
                                <SelectItem key={idx} value={kelas.kodekelas}>
                                  {kelas.namakelas}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="delKoderuang">Kode Ruang *</Label>
                          <Input
                            id="delKoderuang"
                            value={deleteData.koderuang}
                            onChange={(e) => setDeleteData({...deleteData, koderuang: e.target.value})}
                            placeholder="Contoh: RG01"
                          />
                        </div>
                        
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteRoom} 
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Menghapus...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus Kamar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Lihat Ketersediaan Kamar RS</CardTitle>
              <CardDescription>
                Tampilkan data ketersediaan kamar berdasarkan kode PPK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="viewKodePpk">Kode PPK</Label>
                  <Input
                    id="viewKodePpk"
                    value={kodePpk}
                    onChange={(e) => setKodePpk(e.target.value)}
                    placeholder="Contoh: 0001R001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="viewStart">Start</Label>
                  <Input
                    id="viewStart"
                    type="number"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="viewLimit">Limit</Label>
                  <Input
                    id="viewLimit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                  />
                </div>
                
                <div className="self-end">
                  <Button onClick={handleGetRoomAvailability} disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Muat
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Muat Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Kelas</TableHead>
                    <TableHead>Kode Ruang</TableHead>
                    <TableHead>Nama Ruang</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Tersedia</TableHead>
                    <TableHead>Pria</TableHead>
                    <TableHead>Wanita</TableHead>
                    <TableHead>Campur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{room.kodekelas}</TableCell>
                        <TableCell>{room.koderuang}</TableCell>
                        <TableCell>{room.namaruang}</TableCell>
                        <TableCell>{room.kapasitas}</TableCell>
                        <TableCell>{room.tersedia}</TableCell>
                        <TableCell>{room.tersediapria || '0'}</TableCell>
                        <TableCell>{room.tersediawanita || '0'}</TableCell>
                        <TableCell>{room.tersediapriawanita || '0'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        Belum ada data ketersediaan kamar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BPJSAvailabilityManagement;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Building,
  MapPin,
  Phone,
  Globe,
  Users,
  FileText,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FaskesType {
  id: string;
  name: string;
  description: string;
  level: 'primer' | 'sekunder' | 'tersier';
  category: 'rumah_sakit' | 'puskesmas' | 'klinik' | 'laboratorium' | 'radiologi' | 'lainnya';
  isActive: boolean;
}

interface Faskes {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  licenseNumber: string;
  operationalSince: string;
  capacity: number;
  director: string;
  isActive: boolean;
}

const FaskesManagement: React.FC = () => {
  const [faskesTypes, setFaskesTypes] = useState<FaskesType[]>([]);
  const [faskes, setFaskes] = useState<Faskes[]>([]);
  const [filteredFaskes, setFilteredFaskes] = useState<Faskes[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaskes, setSelectedFaskes] = useState<Faskes | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockFaskesTypes: FaskesType[] = [
      {
        id: '1',
        name: 'Rumah Sakit Umum',
        description: 'Rumah sakit yang melayani berbagai bidang medis',
        level: 'tersier',
        category: 'rumah_sakit',
        isActive: true,
      },
      {
        id: '2',
        name: 'Rumah Sakit Khusus',
        description: 'Rumah sakit yang fokus pada bidang medis tertentu',
        level: 'tersier',
        category: 'rumah_sakit',
        isActive: true,
      },
      {
        id: '3',
        name: 'Puskesmas',
        description: 'Pusat Kesehatan Masyarakat',
        level: 'primer',
        category: 'puskesmas',
        isActive: true,
      },
      {
        id: '4',
        name: 'Klinik Pratama',
        description: 'Klinik swasta tingkat dasar',
        level: 'primer',
        category: 'klinik',
        isActive: true,
      },
      {
        id: '5',
        name: 'Klinik Pratama Mandiri',
        description: 'Klinik swasta yang beroperasi mandiri',
        level: 'primer',
        category: 'klinik',
        isActive: true,
      },
      {
        id: '6',
        name: 'Laboratorium Kesehatan',
        description: 'Fasilitas pemeriksaan laboratorium',
        level: 'sekunder',
        category: 'laboratorium',
        isActive: true,
      },
    ];
    
    const mockFaskes: Faskes[] = [
      {
        id: '1',
        name: 'Rumah Sakit Sehat Sentosa',
        type: 'Rumah Sakit Umum',
        address: 'Jl. Kesehatan No. 123',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        phone: '+622112345678',
        email: 'info@rs-sehatsentosa.co.id',
        licenseNumber: '503/RS/2020',
        operationalSince: '2020-01-15',
        capacity: 200,
        director: 'Dr. Ahmad Hidayat',
        isActive: true,
      },
      {
        id: '2',
        name: 'Puskesmas Mekar Jaya',
        type: 'Puskesmas',
        address: 'Jl. Mawar Raya No. 45',
        city: 'Bandung',
        province: 'Jawa Barat',
        phone: '+622287654321',
        email: 'puskesmas@mekarjaya.id',
        licenseNumber: '440/PK/2019',
        operationalSince: '2019-05-20',
        capacity: 50,
        director: 'Ns. Siti Rahayu',
        isActive: true,
      },
      {
        id: '3',
        name: 'Klinik Pratama Medika',
        type: 'Klinik Pratama',
        address: 'Jl. Diponegoro No. 78',
        city: 'Surabaya',
        province: 'Jawa Timur',
        phone: '+623198765432',
        email: 'info@klinikmedika.id',
        licenseNumber: '357/KLN/2021',
        operationalSince: '2021-03-10',
        capacity: 20,
        director: 'Dr. Budi Santoso',
        isActive: true,
      },
    ];
    
    setFaskesTypes(mockFaskesTypes);
    setFaskes(mockFaskes);
    setFilteredFaskes(mockFaskes);
  }, []);

  useEffect(() => {
    const results = faskes.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.director.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaskes(results);
  }, [searchTerm, faskes]);

  const handleViewFaskes = (faskes: Faskes) => {
    setSelectedFaskes(faskes);
    setIsDialogOpen(true);
  };

  const handleEditFaskes = (faskes: Faskes) => {
    navigate(`/faskes/edit/${faskes.id}`);
  };

  const handleDeleteFaskes = (id: string) => {
    setFaskes(faskes.filter(f => f.id !== id));
    setFilteredFaskes(filteredFaskes.filter(f => f.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setFaskes(faskes.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
    setFilteredFaskes(filteredFaskes.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Fasilitas Kesehatan</h1>
        <p className="text-muted-foreground">
          Kelola berbagai tipe fasilitas kesehatan yang terintegrasi dalam SIMRS ZEN
        </p>
      </div>

      <Tabs defaultValue="faskes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faskes">Fasilitas Kesehatan</TabsTrigger>
          <TabsTrigger value="types">Tipe Faskes</TabsTrigger>
          <TabsTrigger value="integration">Integrasi</TabsTrigger>
        </TabsList>

        <TabsContent value="faskes" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, nomor lisensi, atau direktur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Faskes
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Fasilitas Kesehatan Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan fasilitas kesehatan baru ke dalam sistem
                  </DialogDescription>
                </DialogHeader>
                <FaskesForm faskesTypes={faskesTypes} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Fasilitas Kesehatan</CardTitle>
              <CardDescription>
                {filteredFaskes.length} fasilitas kesehatan terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Faskes</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kota</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaskes.map((faskesItem) => (
                    <TableRow key={faskesItem.id}>
                      <TableCell className="font-medium">{faskesItem.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {faskesItem.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{faskesItem.city}</TableCell>
                      <TableCell>{faskesItem.capacity} bed</TableCell>
                      <TableCell>
                        <Badge 
                          variant={faskesItem.isActive ? 'secondary' : 'destructive'}
                        >
                          {faskesItem.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewFaskes(faskesItem)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditFaskes(faskesItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(faskesItem.id)}
                          >
                            {faskesItem.isActive ? (
                              <FileText className="h-4 w-4 text-red-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFaskes(faskesItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="types" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Tipe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tipe Faskes Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan tipe fasilitas kesehatan baru
                  </DialogDescription>
                </DialogHeader>
                <FaskesTypeForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tipe Fasilitas Kesehatan</CardTitle>
              <CardDescription>
                Klasifikasi berbagai tipe fasilitas kesehatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tipe</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Level Pelayanan</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faskesTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {type.category === 'rumah_sakit' && 'Rumah Sakit'}
                          {type.category === 'puskesmas' && 'Puskesmas'}
                          {type.category === 'klinik' && 'Klinik'}
                          {type.category === 'laboratorium' && 'Lab Kesehatan'}
                          {type.category === 'radiologi' && 'Radiologi'}
                          {type.category === 'lainnya' && 'Lainnya'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {type.level === 'primer' && 'Primer'}
                        {type.level === 'sekunder' && 'Sekunder'}
                        {type.level === 'tersier' && 'Tersier'}
                      </TableCell>
                      <TableCell>{type.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={type.isActive ? 'secondary' : 'destructive'}
                        >
                          {type.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrasi Antar Faskes</CardTitle>
              <CardDescription>
                Pengaturan koneksi dan pertukaran data antar fasilitas kesehatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Protokol Komunikasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">HL7 FHIR</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Standar pertukaran data kesehatan internasional
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Building className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">SATU SEHAT</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Integrasi dengan platform SATU SEHAT Kementerian Kesehatan
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <h4 className="font-medium">BPJS</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Integrasi dengan sistem BPJS Kesehatan
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fitur Kolaborasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Rujukan Online</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Proses rujukan digital antar faskes
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        <h4 className="font-medium">Berbagi Rekam Medis</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Berbagi rekam medis dengan persetujuan pasien
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Faskes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Fasilitas Kesehatan</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang fasilitas kesehatan
            </DialogDescription>
          </DialogHeader>
          {selectedFaskes && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Faskes</Label>
                  <p className="mt-1">{selectedFaskes.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipe Faskes</Label>
                  <p className="mt-1">{selectedFaskes.type}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Alamat Lengkap</Label>
                <p className="mt-1">{selectedFaskes.address}, {selectedFaskes.city}, {selectedFaskes.province}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nomor Telepon</Label>
                  <p className="mt-1">{selectedFaskes.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="mt-1">{selectedFaskes.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nomor Lisensi</Label>
                  <p className="mt-1">{selectedFaskes.licenseNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Beroperasi Sejak</Label>
                  <p className="mt-1">{new Date(selectedFaskes.operationalSince).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kapasitas Tempat Tidur</Label>
                  <p className="mt-1">{selectedFaskes.capacity} bed</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Direktur</Label>
                  <p className="mt-1">{selectedFaskes.director}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status Operasional</Label>
                <div className="mt-1">
                  <Badge 
                    variant={selectedFaskes.isActive ? 'secondary' : 'destructive'}
                  >
                    {selectedFaskes.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Faskes Form Component
const FaskesForm: React.FC<{ faskesTypes: FaskesType[] }> = ({ faskesTypes }) => {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="name">Nama Faskes</Label>
        <Input id="name" placeholder="Nama resmi fasilitas kesehatan" />
      </div>
      
      <div>
        <Label htmlFor="type">Tipe Faskes</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe fasilitas kesehatan" />
          </SelectTrigger>
          <SelectContent>
            {faskesTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="address">Alamat Lengkap</Label>
        <Input id="address" placeholder="Alamat jalan, nomor, kelurahan, dll." />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Kota/Kabupaten</Label>
          <Input id="city" placeholder="Nama kota atau kabupaten" />
        </div>
        <div>
          <Label htmlFor="province">Provinsi</Label>
          <Input id="province" placeholder="Nama provinsi" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" placeholder="Nomor telepon utama" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Email resmi faskes" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="licenseNumber">Nomor Lisensi</Label>
          <Input id="licenseNumber" placeholder="Nomor izin operasional" />
        </div>
        <div>
          <Label htmlFor="operationalSince">Beroperasi Sejak</Label>
          <Input id="operationalSince" type="date" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Kapasitas Tempat Tidur</Label>
          <Input id="capacity" type="number" placeholder="Jumlah tempat tidur" />
        </div>
        <div>
          <Label htmlFor="director">Nama Direktur</Label>
          <Input id="director" placeholder="Nama direktur utama" />
        </div>
      </div>
    </div>
  );
};

// Faskes Type Form Component
const FaskesTypeForm: React.FC = () => {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="typeName">Nama Tipe Faskes</Label>
        <Input id="typeName" placeholder="Nama tipe fasilitas kesehatan" />
      </div>
      
      <div>
        <Label htmlFor="category">Kategori</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rumah_sakit">Rumah Sakit</SelectItem>
            <SelectItem value="puskesmas">Puskesmas</SelectItem>
            <SelectItem value="klinik">Klinik</SelectItem>
            <SelectItem value="laboratorium">Laboratorium</SelectItem>
            <SelectItem value="radiologi">Radiologi</SelectItem>
            <SelectItem value="lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="level">Level Pelayanan</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih level pelayanan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primer">Primer</SelectItem>
            <SelectItem value="sekunder">Sekunder</SelectItem>
            <SelectItem value="tersier">Tersier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Input id="description" placeholder="Deskripsi singkat tentang tipe faskes ini" />
      </div>
    </div>
  );
};

export default FaskesManagement;
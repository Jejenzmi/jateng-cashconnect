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
  Globe,
  MapPin,
  User,
  Stethoscope,
  Syringe,
  Pill,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface MasterDataItem {
  id: string;
  name: string;
  code: string;
  type: string;
  parent?: string;
  status: 'active' | 'inactive';
}

const MasterDataManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wilayah' | 'practitioner' | 'kfa' | 'kptl'>('wilayah');
  const [masterData, setMasterData] = useState<MasterDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<MasterDataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data untuk demonstrasi
  useEffect(() => {
    const mockData: MasterDataItem[] = [
      {
        id: '1',
        name: 'DKI Jakarta',
        code: '31',
        type: 'province',
        status: 'active'
      },
      {
        id: '2',
        name: 'Kota Jakarta Selatan',
        code: '3174',
        type: 'city',
        parent: '31',
        status: 'active'
      },
      {
        id: '3',
        name: 'Kecamatan Pesanggrahan',
        code: '317406',
        type: 'district',
        parent: '3174',
        status: 'active'
      },
      {
        id: '4',
        name: 'Dr. Ahmad Yani',
        code: 'PRAC-001',
        type: 'practitioner',
        status: 'active'
      },
      {
        id: '5',
        name: 'Otomatisasi Pendaftaran',
        code: 'KFA-001',
        type: 'kfa',
        status: 'active'
      },
      {
        id: '6',
        name: 'Paracetamol 500mg',
        code: 'KPTL-001',
        type: 'kptl',
        status: 'active'
      }
    ];

    setMasterData(mockData);
    setFilteredData(mockData);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    const filtered = masterData.filter(item => 
      (activeTab === 'wilayah' ? ['province', 'city', 'district', 'village'].includes(item.type) : true) &&
      (activeTab === 'practitioner' ? item.type === 'practitioner' : true) &&
      (activeTab === 'kfa' ? item.type === 'kfa' : true) &&
      (activeTab === 'kptl' ? item.type === 'kptl' : true) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchTerm, activeTab, masterData]);

  const handleViewItem = (item: MasterDataItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSyncWilayah = async () => {
    try {
      setLoading(true);
      // Simulasikan sinkronisasi data wilayah
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data wilayah berhasil disinkronkan dari Satu Sehat');
    } catch (error: any) {
      toast.error('Gagal menyinkronkan data wilayah');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPractitioners = async () => {
    try {
      setLoading(true);
      // Simulasikan sinkronisasi data praktisi
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data praktisi berhasil disinkronkan dari Satu Sehat');
    } catch (error: any) {
      toast.error('Gagal menyinkronkan data praktisi');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncKFA = async () => {
    try {
      setLoading(true);
      // Simulasikan sinkronisasi data KFA
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data KFA berhasil disinkronkan dari Satu Sehat');
    } catch (error: any) {
      toast.error('Gagal menyinkronkan data KFA');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncKPTL = async () => {
    try {
      setLoading(true);
      // Simulasikan sinkronisasi data KPTL
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data KPTL berhasil disinkronkan dari Satu Sehat');
    } catch (error: any) {
      toast.error('Gagal menyinkronkan data KPTL');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'province':
      case 'city':
      case 'district':
      case 'village':
        return <MapPin className="h-4 w-4" />;
      case 'practitioner':
        return <User className="h-4 w-4" />;
      case 'kfa':
        return <Package className="h-4 w-4" />;
      case 'kptl':
        return <Pill className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'success' : 'destructive'}>
        {status === 'active' ? 'Aktif' : 'Tidak Aktif'}
      </Badge>
    );
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
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Master Data Satu Sehat</h1>
        </div>
        <p className="text-muted-foreground">
          Kelola data referensi dari platform Satu Sehat
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Master Data</CardTitle>
          <CardDescription>
            Data referensi untuk wilayah administratif, praktisi, komponen fasilitas/alat, dan produk terstandar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={activeTab === 'wilayah' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('wilayah')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Wilayah Administratif
            </Button>
            <Button 
              variant={activeTab === 'practitioner' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('practitioner')}
            >
              <User className="mr-2 h-4 w-4" />
              Praktisi
            </Button>
            <Button 
              variant={activeTab === 'kfa' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('kfa')}
            >
              <Package className="mr-2 h-4 w-4" />
              KFA
            </Button>
            <Button 
              variant={activeTab === 'kptl' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('kptl')}
            >
              <Pill className="mr-2 h-4 w-4" />
              KPTL
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Cari ${activeTab}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === 'wilayah' && (
              <Button onClick={handleSyncWilayah} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Menyinkronkan...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Sinkronkan Wilayah
                  </>
                )}
              </Button>
            )}
            
            {activeTab === 'practitioner' && (
              <Button onClick={handleSyncPractitioners} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Menyinkronkan...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Sinkronkan Praktisi
                  </>
                )}
              </Button>
            )}
            
            {activeTab === 'kfa' && (
              <Button onClick={handleSyncKFA} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Menyinkronkan...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Sinkronkan KFA
                  </>
                )}
              </Button>
            )}
            
            {activeTab === 'kptl' && (
              <Button onClick={handleSyncKPTL} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Menyinkronkan...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Sinkronkan KPTL
                  </>
                )}
              </Button>
            )}
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.type === 'province' && 'Provinsi'}
                      {item.type === 'city' && 'Kota/Kabupaten'}
                      {item.type === 'district' && 'Kecamatan'}
                      {item.type === 'village' && 'Desa/Kelurahan'}
                      {item.type === 'practitioner' && 'Praktisi'}
                      {item.type === 'kfa' && 'KFA'}
                      {item.type === 'kptl' && 'KPTL'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewItem(item)}
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

      {/* Detail Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Master Data</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang entitas master data
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama</Label>
                  <p className="mt-1">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kode</Label>
                  <p className="mt-1">{selectedItem.code}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipe</Label>
                  <p className="mt-1 capitalize">
                    {selectedItem.type === 'province' && 'Provinsi'}
                    {selectedItem.type === 'city' && 'Kota/Kabupaten'}
                    {selectedItem.type === 'district' && 'Kecamatan'}
                    {selectedItem.type === 'village' && 'Desa/Kelurahan'}
                    {selectedItem.type === 'practitioner' && 'Praktisi'}
                    {selectedItem.type === 'kfa' && 'KFA'}
                    {selectedItem.type === 'kptl' && 'KPTL'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>
              </div>
              
              {selectedItem.parent && (
                <div>
                  <Label className="text-sm font-medium">Induk</Label>
                  <p className="mt-1">{selectedItem.parent}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterDataManager;
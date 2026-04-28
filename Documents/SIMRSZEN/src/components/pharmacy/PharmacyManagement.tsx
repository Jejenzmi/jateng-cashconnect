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
  Package,
  Pill,
  Syringe,
  Droplets,
  FlaskConical,
  Scale,
  Calendar,
  ShoppingCart,
  Receipt,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface Medicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  dosageForm: string;
  dosage: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  manufacturer: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

const PharmacyManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockMedicines: Medicine[] = [
      {
        id: '1',
        code: 'MED001',
        name: 'Paracetamol 500mg',
        genericName: 'Paracetamol',
        dosageForm: 'tablet',
        dosage: '500mg',
        unit: 'strip',
        price: 15000,
        stock: 45,
        minStock: 10,
        category: 'Obat Keras',
        manufacturer: 'Kimia Farma',
        expiryDate: '2027-12-31',
        createdAt: '2026-01-15',
        updatedAt: '2026-04-10',
      },
      {
        id: '2',
        code: 'MED002',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin Trihydrate',
        dosageForm: 'capsule',
        dosage: '250mg',
        unit: 'box',
        price: 25000,
        stock: 12,
        minStock: 15,
        category: 'Obat Keras',
        manufacturer: 'Sanbe',
        expiryDate: '2027-06-30',
        createdAt: '2026-02-20',
        updatedAt: '2026-04-15',
      },
      {
        id: '3',
        code: 'MED003',
        name: 'Salbutamol 2mg',
        genericName: 'Salbutamol Sulfate',
        dosageForm: 'syrup',
        dosage: '2mg/5ml',
        unit: 'botol',
        price: 18000,
        stock: 30,
        minStock: 5,
        category: 'Obat Bebas',
        manufacturer: 'Hexpharm',
        expiryDate: '2027-08-15',
        createdAt: '2026-01-30',
        updatedAt: '2026-04-05',
      },
      {
        id: '4',
        code: 'MED004',
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        dosageForm: 'capsule',
        dosage: '20mg',
        unit: 'strip',
        price: 22000,
        stock: 8,
        minStock: 10,
        category: 'Obat Keras',
        manufacturer: 'Indo Farma',
        expiryDate: '2027-05-20',
        createdAt: '2026-03-10',
        updatedAt: '2026-04-18',
      },
    ];
    setMedicines(mockMedicines);
    setFilteredMedicines(mockMedicines);
  }, []);

  useEffect(() => {
    const results = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(results);
  }, [searchTerm, medicines]);

  const handleViewMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    navigate(`/pharmacy/edit/${medicine.id}`);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
    setFilteredMedicines(filteredMedicines.filter(medicine => medicine.id !== id));
  };

  const handleRestock = (id: string, amount: number) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, stock: med.stock + amount } : med
    ));
    setFilteredMedicines(filteredMedicines.map(med => 
      med.id === id ? { ...med, stock: med.stock + amount } : med
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Farmasi</h1>
        <p className="text-muted-foreground">
          Kelola obat, stok, kedaluwarsa, dan distribusi ke pasien
        </p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventaris Obat</TabsTrigger>
          <TabsTrigger value="dispensing">Pendistribusian</TabsTrigger>
          <TabsTrigger value="receiving">Penerimaan Barang</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari obat berdasarkan nama, kode, atau produsen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Obat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Obat Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan obat baru ke dalam sistem farmasi
                  </DialogDescription>
                </DialogHeader>
                <MedicineForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Obat</CardTitle>
              <CardDescription>
                {filteredMedicines.length} obat dalam inventaris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Bentuk Sediaan</TableHead>
                    <TableHead>Dosis</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow 
                      key={medicine.id} 
                      className={medicine.stock <= medicine.minStock ? "bg-red-50" : ""}
                    >
                      <TableCell className="font-medium">{medicine.code}</TableCell>
                      <TableCell>{medicine.name}</TableCell>
                      <TableCell>{medicine.dosageForm}</TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>Rp {medicine.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{medicine.stock} {medicine.unit}</span>
                          {medicine.stock <= medicine.minStock && (
                            <Badge variant="destructive" className="text-xs">
                              Stok Rendah!
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewMedicine(medicine)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMedicine(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMedicine(medicine.id)}
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

        <TabsContent value="dispensing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pendistribusian Obat</CardTitle>
              <CardDescription>
                Proses pemberian obat kepada pasien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prescription-id">ID Resep</Label>
                    <Input id="prescription-id" placeholder="Masukkan ID resep..." />
                  </div>
                  <div>
                    <Label htmlFor="patient-name">Nama Pasien</Label>
                    <Input id="patient-name" placeholder="Cari nama pasien..." />
                  </div>
                </div>
                
                <div>
                  <Label>Daftar Obat dalam Resep</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Obat</TableHead>
                        <TableHead>Dosis</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Paracetamol 500mg</TableCell>
                        <TableCell>3 kali sehari, 1 tablet</TableCell>
                        <TableCell>30 tablet</TableCell>
                        <TableCell>Rp 15.000</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">Berikan</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Amoxicillin 250mg</TableCell>
                        <TableCell>2 kali sehari, 1 kapsul</TableCell>
                        <TableCell>10 kapsul</TableCell>
                        <TableCell>Rp 25.000</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">Berikan</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Rp 40.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak (10%):</span>
                      <span>Rp 4.000</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>Rp 44.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receiving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Penerimaan Barang Masuk</CardTitle>
              <CardDescription>
                Tambahkan stok obat yang baru diterima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kf">Kimia Farma</SelectItem>
                        <SelectItem value="sanbe">Sanbe</SelectItem>
                        <SelectItem value="hexpharm">Hexpharm</SelectItem>
                        <SelectItem value="indo">Indo Farma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="invoice">Nomor Invoice</Label>
                    <Input id="invoice" placeholder="Masukkan nomor invoice..." />
                  </div>
                </div>
                
                <div>
                  <Label>Daftar Obat yang Diterima</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Obat</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Kadaluarsa</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Paracetamol 500mg</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="50" className="w-24" />
                        </TableCell>
                        <TableCell>
                          <Input type="date" defaultValue="2027-12-31" />
                        </TableCell>
                        <TableCell>Rp 14.000</TableCell>
                        <TableCell className="text-right">Rp 700.000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Omeprazole 20mg</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="30" className="w-24" />
                        </TableCell>
                        <TableCell>
                          <Input type="date" defaultValue="2027-05-20" />
                        </TableCell>
                        <TableCell>Rp 20.000</TableCell>
                        <TableCell className="text-right">Rp 600.000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end mt-4">
                    <Button>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Proses Penerimaan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicines.length}</div>
                <p className="text-xs text-muted-foreground">
                  Jenis obat dalam sistem
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {medicines.filter(m => m.stock <= m.minStock).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Obat perlu direstok
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nilai Inventaris</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {medicines.reduce((sum, med) => sum + (med.price * med.stock), 0).toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimasi nilai total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kadaluarsa Mendekat</CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {medicines.filter(m => new Date(m.expiryDate) < new Date(Date.now() + 30*24*60*60*1000)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Harus dicek segera
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Analisis Stok</CardTitle>
              <CardDescription>
                Distribusi obat berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(
                  medicines.reduce((acc, med) => {
                    const existing = acc.find(item => item.category === med.category);
                    if (existing) {
                      existing.count++;
                      existing.totalValue += med.price * med.stock;
                    } else {
                      acc.push({
                        category: med.category,
                        count: 1,
                        totalValue: med.price * med.stock
                      });
                    }
                    return acc;
                  }, [] as {category: string, count: number, totalValue: number}[])
                ).map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{cat.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {cat.count} obat, Rp {cat.totalValue.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(cat.count / medicines.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Medicine Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Obat</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang obat
            </DialogDescription>
          </DialogHeader>
          {selectedMedicine && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kode Obat</Label>
                  <p className="mt-1">{selectedMedicine.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nama Generik</Label>
                  <p className="mt-1">{selectedMedicine.genericName}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Nama Dagang</Label>
                <p className="mt-1">{selectedMedicine.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Bentuk Sediaan</Label>
                  <p className="mt-1">{selectedMedicine.dosageForm}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dosis</Label>
                  <p className="mt-1">{selectedMedicine.dosage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Satuan</Label>
                  <p className="mt-1">{selectedMedicine.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Harga per {selectedMedicine.unit}</Label>
                  <p className="mt-1">Rp {selectedMedicine.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Stok Saat Ini</Label>
                  <p className="mt-1">{selectedMedicine.stock} {selectedMedicine.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Minimal Stok</Label>
                  <p className="mt-1">{selectedMedicine.minStock} {selectedMedicine.unit}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kategori</Label>
                  <p className="mt-1">{selectedMedicine.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Produsen</Label>
                  <p className="mt-1">{selectedMedicine.manufacturer}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Kadaluarsa</Label>
                  <p className="mt-1">{new Date(selectedMedicine.expiryDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Ditambahkan</Label>
                  <p className="mt-1">{new Date(selectedMedicine.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Medicine Form Component
const MedicineForm: React.FC = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Kode Obat</Label>
          <Input id="code" placeholder="Contoh: MED001" />
        </div>
        <div>
          <Label htmlFor="name">Nama Dagang</Label>
          <Input id="name" placeholder="Nama dagang obat" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="genericName">Nama Generik</Label>
        <Input id="genericName" placeholder="Nama generik obat" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dosageForm">Bentuk Sediaan</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih bentuk sediaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="capsule">Kapsul</SelectItem>
              <SelectItem value="syrup">Sirup</SelectItem>
              <SelectItem value="solution">Larutan</SelectItem>
              <SelectItem value="ointment">Salep</SelectItem>
              <SelectItem value="injection">Injeksi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dosage">Dosis</Label>
          <Input id="dosage" placeholder="Contoh: 500mg" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit">Satuan</Label>
          <Input id="unit" placeholder="Contoh: strip, box, botol" />
        </div>
        <div>
          <Label htmlFor="price">Harga per Satuan</Label>
          <Input id="price" type="number" placeholder="Contoh: 15000" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stok Awal</Label>
          <Input id="stock" type="number" placeholder="Contoh: 50" />
        </div>
        <div>
          <Label htmlFor="minStock">Minimal Stok</Label>
          <Input id="minStock" type="number" placeholder="Contoh: 10" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="obat-keras">Obat Keras</SelectItem>
              <SelectItem value="obat-bebas">Obat Bebas</SelectItem>
              <SelectItem value="obat-narkotika">Narkotika</SelectItem>
              <SelectItem value="obat-psikotropika">Psikotropika</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="manufacturer">Produsen</Label>
          <Input id="manufacturer" placeholder="Nama produsen obat" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
        <Input id="expiryDate" type="date" />
      </div>
    </div>
  );
};

export default PharmacyManagement;
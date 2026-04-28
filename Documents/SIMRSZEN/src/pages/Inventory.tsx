import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
interface Item {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  stock: number;
  min_stock: number;
  price: number;
  supplier: string;
  last_updated: string;
}

interface Transaction {
  id: string;
  item_id: string;
  item_name: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  supplier_customer: string;
  notes: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch items
      const itemsResult = await getApi<Item[]>`
        SELECT 
          id,
          name,
          code,
          category,
          unit,
          stock,
          min_stock,
          price,
          supplier,
          last_updated
        FROM inventory_items
        ORDER BY name
      `;
      
      // Fetch transactions
      const transactionsResult = await getApi<Transaction[]>`
        SELECT 
          id,
          item_id,
          item_name,
          type,
          quantity,
          date,
          supplier_customer,
          notes
        FROM inventory_transactions
        ORDER BY date DESC
        LIMIT 50
      `;
      
      setItems(itemsResult);
      setTransactions(transactionsResult);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast({
        title: "Gagal memuat data inventory",
        description: "Terjadi kesalahan saat memuat data inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Inventaris</CardTitle>
          <CardDescription>
            Pengelolaan stok barang dan transaksi masuk/keluar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="items">Daftar Barang</TabsTrigger>
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Cari barang berdasarkan nama, kode, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      Tambah Barang Baru
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Barang Inventaris</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama Barang</Label>
                        <Input id="name" placeholder="Nama lengkap barang" />
                      </div>
                      
                      <div>
                        <Label htmlFor="code">Kode Barang</Label>
                        <Input id="code" placeholder="Kode unik barang" />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Input id="category" placeholder="Kategori barang" />
                      </div>
                      
                      <div>
                        <Label htmlFor="unit">Satuan</Label>
                        <Input id="unit" placeholder="Satuan barang (buah, kg, liter)" />
                      </div>
                      
                      <div>
                        <Label htmlFor="stock">Stok Awal</Label>
                        <Input id="stock" type="number" placeholder="Jumlah stok awal" />
                      </div>
                      
                      <div>
                        <Label htmlFor="min_stock">Stok Minimum</Label>
                        <Input id="min_stock" type="number" placeholder="Jumlah stok minimum" />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Harga Satuan (Rp)</Label>
                        <Input id="price" type="number" placeholder="Harga per satuan" />
                      </div>
                      
                      <div>
                        <Label htmlFor="supplier">Pemasok</Label>
                        <Input id="supplier" placeholder="Nama pemasok" />
                      </div>
                      
                      <Button>Tambah Barang</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Minimum</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Pemasok</TableHead>
                    <TableHead>Terakhir Diperbarui</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={item.stock <= item.min_stock ? "destructive" : "default"}>
                          {item.stock} {item.unit}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.min_stock} {item.unit}</TableCell>
                      <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{new Date(item.last_updated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="transactions">
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Cari transaksi..."
                  className="max-w-sm"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Catat Transaksi Baru
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Catat Transaksi Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transaction_item">Barang</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih barang" />
                          </SelectTrigger>
                          <SelectContent>
                            {items.map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name} ({item.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="transaction_type">Jenis Transaksi</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis transaksi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">Pemasukan</SelectItem>
                            <SelectItem value="out">Pengeluaran</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="quantity">Jumlah</Label>
                        <Input id="quantity" type="number" placeholder="Jumlah barang" />
                      </div>
                      
                      <div>
                        <Label htmlFor="supplier_customer">Pemasok/Pelanggan</Label>
                        <Input id="supplier_customer" placeholder="Nama pemasok atau pelanggan" />
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Catatan</Label>
                        <textarea
                          id="notes"
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder="Catatan tambahan"
                        />
                      </div>
                      
                      <Button>Catat Transaksi</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Pemasok/Pelanggan</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.item_name}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'in' ? "success" : "destructive"}>
                          {tx.type === 'in' ? 'Masuk' : 'Keluar'}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.quantity}</TableCell>
                      <TableCell>{tx.supplier_customer}</TableCell>
                      <TableCell>{tx.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Inventaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Barang</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Barang Kurang Stok</span>
                <span className="font-medium">
                  {items.filter(i => i.stock <= i.min_stock).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nilai Total Stok</span>
                <span className="font-medium">
                  Rp {items.reduce((sum, item) => sum + (item.stock * item.price), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Stok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items
                .filter(item => item.stock <= item.min_stock)
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                    <span className="text-sm">{item.name}</span>
                    <Badge variant="destructive">{item.stock} {item.unit}</Badge>
                  </div>
                ))
              }
              {items.filter(item => item.stock <= item.min_stock).length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada barang dengan stok rendah</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 3).map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-2 bg-secondary rounded">
                  <div>
                    <p className="text-sm font-medium">{tx.item_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge variant={tx.type === 'in' ? "success" : "destructive"}>
                    {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
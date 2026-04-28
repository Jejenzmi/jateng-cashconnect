import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill, Calendar, FileText, AlertTriangle, 
  Search, Clock, CheckCircle, XCircle, 
  Package, Syringe, Droplets, Eye
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosage: string;
  stock: number;
  unit: string;
  price: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
}

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  medicines: Array<{
    id: string;
    name: string;
    dosage: string;
    quantity: number;
    status: 'pending' | 'dispensed' | 'verified';
  }>;
  date: string;
  status: 'pending' | 'verified' | 'dispensed' | 'completed';
}

interface ExpiredMedicine {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  status: 'expired' | 'near-expiry';
}

export default function PharmacyModule() {
  const [activeTab, setActiveTab] = useState('prescription-management');
  
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 'med-1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesik',
      dosage: '500mg',
      stock: 150,
      unit: 'tablet',
      price: 1500,
      expiryDate: '2027-06-15',
      batchNumber: 'BAT-PC-2026-01',
      supplier: 'Kimia Farma'
    },
    {
      id: 'med-2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotik',
      dosage: '250mg',
      stock: 75,
      unit: 'capsule',
      price: 2000,
      expiryDate: '2027-03-20',
      batchNumber: 'BAT-AM-2026-05',
      supplier: 'Hexpharm'
    },
    {
      id: 'med-3',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Gastrointestinal',
      dosage: '20mg',
      stock: 200,
      unit: 'capsule',
      price: 3500,
      expiryDate: '2027-12-10',
      batchNumber: 'BAT-OM-2026-03',
      supplier: 'Kalbe Farma'
    },
    {
      id: 'med-4',
      name: 'Metformin 500mg',
      genericName: 'Metformin Hydrochloride',
      category: 'Antidiabetik',
      dosage: '500mg',
      stock: 300,
      unit: 'tablet',
      price: 2500,
      expiryDate: '2026-08-05',
      batchNumber: 'BAT-MT-2026-07',
      supplier: 'Sanbe'
    }
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'rx-1',
      patientName: 'Ahmad Fauzi',
      doctorName: 'Dr. Andrianto Sp.PD',
      date: '2026-04-20',
      status: 'pending',
      medicines: [
        { id: 'med-1', name: 'Paracetamol 500mg', dosage: '3x1', quantity: 9, status: 'pending' },
        { id: 'med-4', name: 'Metformin 500mg', dosage: '2x1', quantity: 14, status: 'pending' }
      ]
    },
    {
      id: 'rx-2',
      patientName: 'Siti Nurhaliza',
      doctorName: 'Dr. Siti Aisyah Sp.OG',
      date: '2026-04-20',
      status: 'verified',
      medicines: [
        { id: 'med-2', name: 'Amoxicillin 250mg', dosage: '3x1', quantity: 9, status: 'verified' }
      ]
    },
    {
      id: 'rx-3',
      patientName: 'Budi Santoso',
      doctorName: 'Dr. Bambang Sp.An',
      date: '2026-04-19',
      status: 'dispensed',
      medicines: [
        { id: 'med-1', name: 'Paracetamol 500mg', dosage: '3x1', quantity: 6, status: 'dispensed' },
        { id: 'med-3', name: 'Omeprazole 20mg', dosage: '1x1', quantity: 7, status: 'dispensed' }
      ]
    }
  ]);

  const [expiredMedicines, setExpiredMedicines] = useState<ExpiredMedicine[]>([
    {
      id: 'exp-1',
      name: 'Cefixime 100mg',
      batchNumber: 'BAT-CF-2025-12',
      expiryDate: '2026-03-15',
      quantity: 25,
      status: 'expired'
    },
    {
      id: 'exp-2',
      name: 'Ibuprofen 400mg',
      batchNumber: 'BAT-IB-2026-02',
      expiryDate: '2026-05-10',
      quantity: 40,
      status: 'near-expiry'
    },
    {
      id: 'exp-3',
      name: 'Dexamethasone 0.5mg',
      batchNumber: 'BAT-DX-2026-04',
      expiryDate: '2026-06-20',
      quantity: 15,
      status: 'near-expiry'
    }
  ]);

  const getMedicineStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dispensed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExpiryStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'near-expiry':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const lowStockMedicines = medicines.filter(med => med.stock < 50);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Pill className="h-8 w-8" />
            Farmasi
          </h1>
          <p className="text-muted-foreground">Manajemen obat dan distribusi resep</p>
        </div>
        <Button>
          <Pill className="h-4 w-4 mr-2" />
          Tambah Obat
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Obat</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stok</p>
                <p className="text-2xl font-bold">
                  {medicines.reduce((sum, med) => sum + med.stock, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stok Rendah</p>
                <p className="text-2xl font-bold">{lowStockMedicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kadaluarsa</p>
                <p className="text-2xl font-bold">
                  {expiredMedicines.filter(m => m.status === 'expired').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prescription-management" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Manajemen Resep</span>
          </TabsTrigger>
          <TabsTrigger value="medicine-inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Inventaris Obat</span>
          </TabsTrigger>
          <TabsTrigger value="expired-medicines" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Obat Kadaluarsa</span>
          </TabsTrigger>
          <TabsTrigger value="drug-reconciliation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Rekonsiliasi Obat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prescription-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Resep</CardTitle>
              <CardDescription>Verifikasi dan distribusi resep obat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map(prescription => (
                  <Card key={prescription.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">Resep #{prescription.id}</h3>
                          <p className="text-sm text-muted-foreground">Dokter: {prescription.doctorName}</p>
                          <p className="text-sm">Pasien: {prescription.patientName}</p>
                          <p className="text-sm mt-1">Tanggal: {prescription.date}</p>
                        </div>
                        <Badge className={getMedicineStatusColor(prescription.status)}>
                          {prescription.status === 'pending' && 'Menunggu Verifikasi'}
                          {prescription.status === 'verified' && 'Terverifikasi'}
                          {prescription.status === 'dispensed' && 'Telah Didistribusikan'}
                          {prescription.status === 'completed' && 'Selesai'}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        {prescription.medicines.map(med => (
                          <div key={`${prescription.id}-${med.id}`} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-muted-foreground">{med.dosage} • Qty: {med.quantity}</p>
                            </div>
                            <Badge variant="outline">
                              {med.status === 'pending' && 'Menunggu'}
                              {med.status === 'verified' && 'Terverifikasi'}
                              {med.status === 'dispensed' && 'Didistribusikan'}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        {prescription.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <FileText className="h-4 w-4 mr-2" />
                              Verifikasi
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Package className="h-4 w-4 mr-2" />
                              Distribusikan
                            </Button>
                          </>
                        )}
                        {prescription.status === 'verified' && (
                          <Button size="sm" className="w-full">
                            <Package className="h-4 w-4 mr-2" />
                            Distribusikan
                          </Button>
                        )}
                        {prescription.status === 'dispensed' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesai
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicine-inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventaris Obat</CardTitle>
              <CardDescription>Daftar obat dan stok tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicines.map(medicine => (
                  <Card key={medicine.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                          <p className="text-sm">{medicine.category} • {medicine.dosage}</p>
                          <p className="text-sm mt-1">Batch: {medicine.batchNumber}</p>
                          <p className="text-sm">Supplier: {medicine.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{medicine.stock} {medicine.unit}</p>
                          <p className="text-xs text-muted-foreground">Stok Tersedia</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Harga per {medicine.unit}</p>
                          <p className="font-medium">Rp {medicine.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kadaluarsa</p>
                          <p className="font-medium">{medicine.expiryDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Package className="h-4 w-4 mr-2" />
                          Update Stok
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                          Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired-medicines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Obat Kadaluarsa dan Hampir Kadaluarsa</CardTitle>
              <CardDescription>Pengelolaan obat yang akan kadaluarsa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiredMedicines.map(expMed => (
                  <Card key={expMed.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{expMed.name}</h3>
                          <p className="text-sm">Batch: {expMed.batchNumber}</p>
                          <p className="text-sm">Kadaluarsa: {expMed.expiryDate}</p>
                        </div>
                        <Badge className={getExpiryStatusColor(expMed.status)}>
                          {expMed.status === 'expired' && 'Kadaluarsa'}
                          {expMed.status === 'near-expiry' && 'Hampir Kadaluarsa'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Jumlah</p>
                          <p className="font-bold text-lg">{expMed.quantity} unit</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium">
                            {expMed.status === 'expired' 
                              ? 'Harus didisposisi' 
                              : 'Diprioritaskan untuk distribusi'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {expMed.status === 'expired' ? (
                          <Button variant="destructive" size="sm" className="w-full">
                            <XCircle className="h-4 w-4 mr-2" />
                            Disposisi Obat
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Notifikasi
                            </Button>
                            <Button size="sm">
                              <Package className="h-4 w-4 mr-2" />
                              Distribusi
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drug-reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rekonsiliasi Obat</CardTitle>
              <CardDescription>Pembandingan obat sebelum dan sesudah rawat inap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Proses Rekonsiliasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Obat Sebelum Rawat Inap</h4>
                          <div className="space-y-2">
                            <div className="p-3 border rounded">
                              <p className="font-medium">Paracetamol 500mg</p>
                              <p className="text-sm text-muted-foreground">3x1 sehari • 30 tablet</p>
                            </div>
                            <div className="p-3 border rounded">
                              <p className="font-medium">Metformin 500mg</p>
                              <p className="text-sm text-muted-foreground">2x1 sehari • 60 tablet</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Obat Selama Rawat Inap</h4>
                          <div className="space-y-2">
                            <div className="p-3 border rounded bg-blue-50">
                              <p className="font-medium">Amoxicillin 250mg</p>
                              <p className="text-sm text-muted-foreground">3x1 sehari • 15 tablet</p>
                              <p className="text-xs text-muted-foreground mt-1">Ditambahkan selama rawat</p>
                            </div>
                            <div className="p-3 border rounded bg-amber-50">
                              <p className="font-medium">Paracetamol 500mg</p>
                              <p className="text-sm text-muted-foreground">2x1 sehari • 14 tablet</p>
                              <p className="text-xs text-muted-foreground mt-1">Dosis disesuaikan</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h4 className="font-medium mb-2">Catatan Rekonsiliasi</h4>
                        <div className="p-3 border rounded bg-green-50">
                          <p className="font-medium">Perubahan Penting:</p>
                          <ul className="list-disc pl-5 mt-2 text-sm">
                            <li>Dosis Paracetamol disesuaikan dari 3x1 menjadi 2x1 karena fungsi hati pasien</li>
                            <li>Ditambahkan Amoxicillin untuk infeksi saluran pernapasan</li>
                            <li>Metformin ditunda selama rawat karena pemeriksaan fungsi ginjal</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Cetak Rekonsiliasi
                        </Button>
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verifikasi Rekonsiliasi
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
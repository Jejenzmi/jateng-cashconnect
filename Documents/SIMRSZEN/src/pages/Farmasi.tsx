import { useState, useEffect } from "react";
import { getApi, postApi } from "@/utils/api";
import { Search, Pill, Package, AlertTriangle, TrendingUp, Plus, CheckCircle, QrCode, RefreshCw, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Prescription {
  id: string;
  prescription_number: string;
  patient_name: string;
  doctor_name: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  status: 'pending' | 'dispensed' | 'cancelled';
  payment_type: string;
  item_count: number;
  created_at: string;
  notes?: string;
}

interface Medicine {
  id: string;
  name: string;
  stock: number;
  min_stock: number;
  unit: string;
  category: string;
  price: number;
}

// Mock data - replace with real API when backend medicines/prescriptions endpoints are ready
const mockPrescriptions: Prescription[] = [
  { id: '1', prescription_number: 'RES-2604-001', patient_name: 'Ahmad Fauzi', doctor_name: 'dr. Budi Santoso', medicine_name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '3x1', duration: '5 hari', quantity: 15, status: 'pending', payment_type: 'BPJS', item_count: 3, created_at: new Date().toISOString() },
  { id: '2', prescription_number: 'RES-2604-002', patient_name: 'Siti Rahayu', doctor_name: 'dr. Dewi Lestari', medicine_name: 'Metformin 500mg', dosage: '500mg', frequency: '2x1', duration: '30 hari', quantity: 60, status: 'pending', payment_type: 'Umum', item_count: 2, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: '3', prescription_number: 'RES-2604-003', patient_name: 'Budi Kusuma', doctor_name: 'dr. Eko Prasetyo', medicine_name: 'Amlodipine 5mg', dosage: '5mg', frequency: '1x1', duration: '30 hari', quantity: 30, status: 'dispensed', payment_type: 'BPJS', item_count: 1, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '4', prescription_number: 'RES-2604-004', patient_name: 'Rina Wulandari', doctor_name: 'dr. Budi Santoso', medicine_name: 'Paracetamol 500mg', dosage: '500mg', frequency: '3x1', duration: '3 hari', quantity: 9, status: 'dispensed', payment_type: 'Umum', item_count: 2, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '5', prescription_number: 'RES-2604-005', patient_name: 'Deni Santoso', doctor_name: 'dr. Fitri Handayani', medicine_name: 'Salbutamol 4mg', dosage: '4mg', frequency: '3x1', duration: '7 hari', quantity: 21, status: 'pending', payment_type: 'BPJS', item_count: 4, created_at: new Date(Date.now() - 900000).toISOString() },
];

const mockMedicines: Medicine[] = [
  { id: '1', name: 'Amoxicillin 500mg', stock: 450, min_stock: 100, unit: 'kapsul', category: 'Antibiotik', price: 2500 },
  { id: '2', name: 'Paracetamol 500mg', stock: 1200, min_stock: 200, unit: 'tablet', category: 'Analgesik', price: 500 },
  { id: '3', name: 'Metformin 500mg', stock: 85, min_stock: 150, unit: 'tablet', category: 'Antidiabetik', price: 1500 },
  { id: '4', name: 'Amlodipine 5mg', stock: 320, min_stock: 100, unit: 'tablet', category: 'Antihipertensi', price: 2000 },
  { id: '5', name: 'Salbutamol 4mg', stock: 42, min_stock: 100, unit: 'tablet', category: 'Bronkodilator', price: 3000 },
  { id: '6', name: 'Omeprazole 20mg', stock: 180, min_stock: 100, unit: 'kapsul', category: 'Antasida', price: 3500 },
  { id: '7', name: 'Simvastatin 20mg', stock: 95, min_stock: 120, unit: 'tablet', category: 'Kolesterol', price: 4000 },
  { id: '8', name: 'Cetirizine 10mg', stock: 240, min_stock: 100, unit: 'tablet', category: 'Antihistamin', price: 2000 },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  dispensed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  dispensed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function Farmasi() {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);

  useEffect(() => {
    fetchMedicines();
    // fetchPrescriptions(); // Will be implemented next
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await postApi<Medicine[]>("/unsafe-query", {
        query: `SELECT id, name, stock, "minStock" as min_stock, unit, "genericName" as category, price FROM medicines WHERE "isDeleted" = false`
      });
      if (data && data.length > 0) {
        setMedicines(data);
      }
    } catch (e) {
      console.error("Error fetching medicines from DB:", e);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayPrescriptions = prescriptions.filter(p => p.created_at.startsWith(today));
  const waiting = prescriptions.filter(p => p.status === 'pending');
  const completed = prescriptions.filter(p => p.status === 'dispensed');
  const lowStock = medicines.filter(m => m.stock < m.min_stock);

  const stats = [
    { label: 'Resep Hari Ini', value: todayPrescriptions.length, icon: <Pill className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Menunggu Diproses', value: waiting.length, icon: <Package className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Selesai', value: completed.length, icon: <CheckCircle className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'Stok Menipis', value: lowStock.length, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  ];

  const handleProcess = (prescription: Prescription) => {
    setProcessing(true);
    setTimeout(() => {
      setPrescriptions(prev => prev.map(p =>
        p.id === prescription.id ? { ...p, status: 'dispensed' } : p
      ));
      toast.success(`Resep ${prescription.prescription_number} berhasil diserahkan`);
      setDetailOpen(false);
      setProcessing(false);
    }, 1000);
  };

  const filteredQueue = prescriptions
    .filter(p => p.status === 'pending')
    .filter(p =>
      p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredHistory = prescriptions
    .filter(p => p.status === 'dispensed')
    .filter(p =>
      p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prescription_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pill className="h-7 w-7 text-primary" />
            Farmasi
          </h1>
          <p className="text-muted-foreground">Manajemen resep dan stok obat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLoading(l => !l)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Resep Baru
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm">
            <div className={`p-2.5 rounded-xl ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescriptions */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="queue">
                Antrian Resep
                {waiting.length > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {waiting.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                E-Resep
              </TabsTrigger>
              <TabsTrigger value="history">Riwayat</TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Antrian Resep</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari resep..."
                      className="pl-10 w-52"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="divide-y">
                  {filteredQueue.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30 text-green-500" />
                      <p>Semua resep sudah diproses!</p>
                    </div>
                  ) : (
                    filteredQueue.map((rx) => (
                      <div
                        key={rx.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedPrescription(rx); setDetailOpen(true); }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Pill className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">{rx.prescription_number}</p>
                              <Badge variant="secondary" className={rx.payment_type === "BPJS" ? "bg-primary/10 text-primary text-xs" : "text-xs"}>
                                {rx.payment_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {rx.patient_name} • {rx.doctor_name} • {rx.item_count} item
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge variant="outline" className={statusColors[rx.status]}>
                              {statusLabels[rx.status]}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{formatTime(rx.created_at)}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scanner">
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Scanner E-Resep</h3>
                <p className="text-muted-foreground mb-4">Scan QR Code pada e-resep digital untuk verifikasi dan proses resep</p>
                <Button>
                  <QrCode className="h-4 w-4 mr-2" />
                  Aktifkan Kamera
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Riwayat Resep Selesai</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari riwayat..." className="pl-10 w-52" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="divide-y">
                  {filteredHistory.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Pill className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>Belum ada riwayat resep hari ini</p>
                    </div>
                  ) : (
                    filteredHistory.map((rx) => (
                      <div key={rx.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{rx.prescription_number}</p>
                            <p className="text-sm text-muted-foreground">{rx.patient_name} • {rx.item_count} item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(rx.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl border border-red-100 shadow-sm">
            <div className="p-4 border-b border-red-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Stok Menipis</h3>
                <p className="text-xs text-muted-foreground">Perlu restock segera</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">✅ Semua stok mencukupi</p>
              ) : (
                lowStock.map((med) => (
                  <div key={med.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{med.name}</span>
                      <span className="text-red-500 font-semibold">{med.stock} {med.unit}</span>
                    </div>
                    <Progress value={(med.stock / med.min_stock) * 100} className="h-1.5 [&>div]:bg-red-500" />
                    <p className="text-xs text-muted-foreground">Min: {med.min_stock} {med.unit}</p>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full text-xs h-8 mt-2">Lihat Semua Stok</Button>
            </div>
          </div>

          {/* Statistik */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Statistik Hari Ini</h3>
                <p className="text-xs text-muted-foreground">Performa farmasi</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Resep', value: todayPrescriptions.length, color: '' },
                { label: 'BPJS', value: todayPrescriptions.filter(p => p.payment_type === 'BPJS').length, color: 'text-primary' },
                { label: 'Umum', value: todayPrescriptions.filter(p => p.payment_type === 'Umum').length, color: 'text-blue-500' },
                { label: 'Menunggu', value: waiting.length, color: 'text-yellow-500' },
                { label: 'Selesai', value: completed.length, color: 'text-green-500' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className={`font-semibold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Resep</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl">
                <div><p className="text-xs text-muted-foreground">No. Resep</p><p className="font-semibold text-sm">{selectedPrescription.prescription_number}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant="outline" className={`text-xs ${statusColors[selectedPrescription.status]}`}>{statusLabels[selectedPrescription.status]}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Pasien</p><p className="font-medium text-sm">{selectedPrescription.patient_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Dokter</p><p className="font-medium text-sm">{selectedPrescription.doctor_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Pembayaran</p><Badge variant="secondary" className="text-xs">{selectedPrescription.payment_type}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Waktu</p><p className="font-medium text-sm">{formatTime(selectedPrescription.created_at)}</p></div>
              </div>
              <div className="p-4 bg-muted/20 rounded-xl">
                <h4 className="font-semibold text-sm mb-2">Detail Obat</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Nama: </span><span className="font-medium">{selectedPrescription.medicine_name}</span></div>
                  <div><span className="text-muted-foreground">Dosis: </span><span className="font-medium">{selectedPrescription.dosage}</span></div>
                  <div><span className="text-muted-foreground">Frekuensi: </span><span className="font-medium">{selectedPrescription.frequency}</span></div>
                  <div><span className="text-muted-foreground">Durasi: </span><span className="font-medium">{selectedPrescription.duration}</span></div>
                  <div><span className="text-muted-foreground">Jumlah: </span><span className="font-medium">{selectedPrescription.quantity} pcs</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button>
            {selectedPrescription?.status === 'pending' && (
              <Button onClick={() => handleProcess(selectedPrescription!)} disabled={processing}>
                {processing ? "Memproses..." : "✓ Serahkan Obat"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

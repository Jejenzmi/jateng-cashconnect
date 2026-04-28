import React, { useState } from 'react';
import { Syringe, Calendar, Users, Package, Plus, Search, CheckCircle, Clock, AlertTriangle, ChevronRight, Baby, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const vaccines = [
  { id: '1', name: 'BCG', target: 'Bayi 0-1 bulan', stock: 145, minStock: 50, dose: '0.05 ml', route: 'Intradermal', color: 'bg-blue-500' },
  { id: '2', name: 'Hepatitis B', target: 'Bayi 0-7 hari', stock: 230, minStock: 100, dose: '0.5 ml', route: 'IM', color: 'bg-green-500' },
  { id: '3', name: 'DPT-HB-Hib', target: 'Bayi 2, 3, 4 bulan', stock: 189, minStock: 100, dose: '0.5 ml', route: 'IM', color: 'bg-purple-500' },
  { id: '4', name: 'Polio Oral (OPV)', target: 'Bayi 1, 2, 3, 4 bulan', stock: 310, minStock: 150, dose: '2 tetes', route: 'Oral', color: 'bg-orange-500' },
  { id: '5', name: 'Campak-Rubela', target: 'Anak 9 bulan & 18 bulan', stock: 42, minStock: 80, dose: '0.5 ml', route: 'SC', color: 'bg-red-500' },
  { id: '6', name: 'IPV', target: 'Bayi 4 bulan', stock: 95, minStock: 60, dose: '0.5 ml', route: 'IM', color: 'bg-teal-500' },
  { id: '7', name: 'PCV', target: 'Bayi 2, 3, 12 bulan', stock: 78, minStock: 50, dose: '0.5 ml', route: 'IM', color: 'bg-indigo-500' },
  { id: '8', name: 'Rotavirus', target: 'Bayi 2, 3, 4 bulan', stock: 55, minStock: 40, dose: '1.5 ml', route: 'Oral', color: 'bg-pink-500' },
];

const scheduleData = [
  { id: '1', time: '08:00', patient: 'Aryan Pratama', dob: '2025-10-15', vaccines: ['BCG', 'Hep B'], status: 'hadir', noReg: 'IMN-001' },
  { id: '2', time: '08:30', patient: 'Dewi Safitri', dob: '2025-07-22', vaccines: ['DPT-HB-Hib', 'Polio'], status: 'menunggu', noReg: 'IMN-002' },
  { id: '3', time: '09:00', patient: 'Farhan Maulana', dob: '2026-01-05', vaccines: ['BCG'], status: 'menunggu', noReg: 'IMN-003' },
  { id: '4', time: '09:30', patient: 'Siti Rahayu', dob: '2025-09-10', vaccines: ['Campak-Rubela'], status: 'selesai', noReg: 'IMN-004' },
  { id: '5', time: '10:00', patient: 'Budi Santoso', dob: '2025-04-30', vaccines: ['IPV', 'DPT-HB-Hib'], status: 'tidak hadir', noReg: 'IMN-005' },
];

const historyData = [
  { id: '1', patient: 'Ahmad Fauzi', dob: '2024-05-10', vaccine: 'DPT-HB-Hib Dosis 3', date: '2026-04-20', petugas: 'Bidan Sari', noReg: 'IMN-H-001' },
  { id: '2', patient: 'Nadia Putri', dob: '2024-08-14', vaccine: 'Campak-Rubela', date: '2026-04-21', petugas: 'Bidan Dewi', noReg: 'IMN-H-002' },
  { id: '3', patient: 'Rizal Akbar', dob: '2024-11-02', vaccine: 'Polio Oral', date: '2026-04-22', petugas: 'Bidan Sari', noReg: 'IMN-H-003' },
];

const statusColors: Record<string, string> = {
  hadir: 'bg-blue-100 text-blue-700 border-blue-200',
  menunggu: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  selesai: 'bg-green-100 text-green-700 border-green-200',
  'tidak hadir': 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  hadir: <Users className="h-3 w-3" />,
  menunggu: <Clock className="h-3 w-3" />,
  selesai: <CheckCircle className="h-3 w-3" />,
  'tidak hadir': <AlertTriangle className="h-3 w-3" />,
};

export default function Immunization() {
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Jadwal Hari Ini', value: scheduleData.length, icon: <Calendar className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Sudah Vaksinasi', value: scheduleData.filter(s => s.status === 'selesai').length, icon: <CheckCircle className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'Menunggu', value: scheduleData.filter(s => s.status === 'menunggu').length, icon: <Clock className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Stok Kritis', value: vaccines.filter(v => v.stock < v.minStock).length, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  ];

  const filteredSchedule = scheduleData.filter(s =>
    s.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.noReg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Syringe className="h-7 w-7 text-primary" />
            Program Imunisasi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Jadwal Baru
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Input Vaksinasi
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

      {/* Tabs */}
      <Tabs defaultValue="jadwal">
        <TabsList>
          <TabsTrigger value="jadwal">Jadwal Hari Ini</TabsTrigger>
          <TabsTrigger value="stok">Stok Vaksin</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Vaksinasi</TabsTrigger>
          <TabsTrigger value="laporan">Laporan</TabsTrigger>
        </TabsList>

        {/* Jadwal Tab */}
        <TabsContent value="jadwal" className="space-y-4">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h3 className="font-semibold">Daftar Pasien Imunisasi</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau no. registrasi..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="divide-y">
              {filteredSchedule.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {s.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{s.patient}</p>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{s.noReg}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lahir: {new Date(s.dob).toLocaleDateString('id-ID')} •{' '}
                        {s.vaccines.map((v, i) => (
                          <span key={i} className="inline-block bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded mr-1">{v}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${statusColors[s.status]} flex items-center gap-1`}>
                      {statusIcons[s.status]}
                      <span className="capitalize">{s.status}</span>
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {filteredSchedule.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Syringe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Tidak ada jadwal yang sesuai</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Stok Tab */}
        <TabsContent value="stok" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaccines.map((v) => {
              const stockPct = Math.min((v.stock / (v.minStock * 3)) * 100, 100);
              const isLow = v.stock < v.minStock;
              return (
                <div key={v.id} className={`bg-white rounded-xl border shadow-sm p-4 ${isLow ? 'border-red-200' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${v.color} flex items-center justify-center`}>
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{v.name}</h4>
                        <p className="text-xs text-muted-foreground">{v.target}</p>
                      </div>
                    </div>
                    {isLow && (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Stok Kritis
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stok tersedia</span>
                      <span className={`font-medium ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                        {v.stock} dosis
                      </span>
                    </div>
                    <Progress value={stockPct} className={`h-2 ${isLow ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: {v.minStock} dosis</span>
                      <span>Dosis: {v.dose} ({v.route})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Riwayat Tab */}
        <TabsContent value="riwayat">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Riwayat Vaksinasi</h3>
            </div>
            <div className="divide-y">
              {historyData.map((h) => (
                <div key={h.id} className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{h.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        {h.vaccine} • {new Date(h.date).toLocaleDateString('id-ID')} • {h.petugas}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{h.noReg}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Laporan Tab */}
        <TabsContent value="laporan">
          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <Baby className="h-12 w-12 mx-auto text-primary/40 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Laporan Cakupan Imunisasi</h3>
            <p className="text-muted-foreground mb-4">Laporan PWS-KIA dan cakupan imunisasi sesuai format Kemenkes</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline">Unduh Laporan Bulanan</Button>
              <Button variant="outline">Laporan PWS-KIA</Button>
              <Button>Generate Laporan</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
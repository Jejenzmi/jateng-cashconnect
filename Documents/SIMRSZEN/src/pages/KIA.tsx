import React, { useState } from 'react';
import { Heart, Baby, Calendar, Users, Plus, Search, CheckCircle, Clock, Stethoscope, ChevronRight, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const kunjunganData = [
  { id: '1', noReg: 'KIA-001', nama: 'Anisa Wulandari', usia: '28 tahun', hpht: '2025-07-15', usiaKehamilan: '38 minggu', kunjunganKe: 4, status: 'hadir', jenis: 'ANC', petugas: 'Bidan Sari', pukul: '08:30' },
  { id: '2', noReg: 'KIA-002', nama: 'Ratna Dewi', usia: '31 tahun', hpht: '2026-01-20', usiaKehamilan: '13 minggu', kunjunganKe: 1, status: 'menunggu', jenis: 'ANC', petugas: 'Bidan Dewi', pukul: '09:00' },
  { id: '3', noReg: 'KIA-003', nama: 'Mei Susanti', usia: '24 tahun', hpht: '2025-09-05', usiaKehamilan: '28 minggu', kunjunganKe: 2, status: 'selesai', jenis: 'ANC', petugas: 'Bidan Sari', pukul: '10:00' },
  { id: '4', noReg: 'KIA-004', nama: 'Bayi Ny. Suhartini', usia: '3 bulan', hpht: '-', usiaKehamilan: '-', kunjunganKe: 2, status: 'menunggu', jenis: 'MTBS', petugas: 'Dokter Anak', pukul: '10:30' },
  { id: '5', noReg: 'KIA-005', nama: 'Sri Wahyuni', usia: '22 tahun', hpht: '2025-11-30', usiaKehamilan: '20 minggu', kunjunganKe: 2, status: 'hadir', jenis: 'ANC', petugas: 'Bidan Dewi', pukul: '11:00' },
];

const risikoData = [
  { id: '1', nama: 'Fatimah Azzahra', risikoLevel: 'Tinggi', faktor: ['Hipertensi', 'Usia >35 tahun'], usiaKehamilan: '32 minggu', lastVisit: '2026-04-18' },
  { id: '2', nama: 'Yuliana Putri', risikoLevel: 'Sedang', faktor: ['Anemia Ringan'], usiaKehamilan: '24 minggu', lastVisit: '2026-04-20' },
  { id: '3', nama: 'Dewi Rahmawati', risikoLevel: 'Tinggi', faktor: ['DM Gestasional', 'BB Lebih'], usiaKehamilan: '28 minggu', lastVisit: '2026-04-15' },
];

const statusColors: Record<string, string> = {
  hadir: 'bg-blue-100 text-blue-700 border-blue-200',
  menunggu: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  selesai: 'bg-green-100 text-green-700 border-green-200',
};

const jenisColors: Record<string, string> = {
  ANC: 'bg-pink-100 text-pink-700',
  PNC: 'bg-purple-100 text-purple-700',
  MTBS: 'bg-teal-100 text-teal-700',
  KB: 'bg-indigo-100 text-indigo-700',
};

export default function KIA() {
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Kunjungan Hari Ini', value: kunjunganData.length, icon: <Calendar className="h-5 w-5 text-pink-500" />, bg: 'bg-pink-50' },
    { label: 'Bumil Berisiko', value: risikoData.filter(r => r.risikoLevel === 'Tinggi').length, icon: <Heart className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
    { label: 'Pemeriksaan ANC', value: kunjunganData.filter(k => k.jenis === 'ANC').length, icon: <Stethoscope className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'MTBS Hari Ini', value: kunjunganData.filter(k => k.jenis === 'MTBS').length, icon: <Baby className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
  ];

  const filteredKunjungan = kunjunganData.filter(k =>
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.noReg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-7 w-7 text-pink-500" />
            Kesehatan Ibu dan Anak (KIA)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Laporan KIA
          </Button>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Kunjungan Baru
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Kunjungan List */}
        <div className="xl:col-span-2">
          <Tabs defaultValue="kunjungan">
            <TabsList>
              <TabsTrigger value="kunjungan">Kunjungan Hari Ini</TabsTrigger>
              <TabsTrigger value="anc">Pemeriksaan ANC</TabsTrigger>
              <TabsTrigger value="mtbs">MTBS Balita</TabsTrigger>
              <TabsTrigger value="kb">KB</TabsTrigger>
            </TabsList>

            <TabsContent value="kunjungan">
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b flex gap-3 items-center justify-between">
                  <h3 className="font-semibold">Daftar Kunjungan KIA</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari pasien..."
                      className="pl-10 w-56"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="divide-y">
                  {filteredKunjungan.map((k) => (
                    <div key={k.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 font-semibold text-sm">
                          {k.pukul}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{k.nama}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${jenisColors[k.jenis] || 'bg-gray-100 text-gray-600'}`}>
                              {k.jenis}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {k.usia}
                            {k.usiaKehamilan !== '-' && ` • ${k.usiaKehamilan} • K${k.kunjunganKe}`}
                            {' • '}{k.petugas}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[k.status] || 'bg-gray-100'}>
                          {k.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="anc">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Pemeriksaan Antenatal Care (ANC)</h3>
                    <p className="text-sm text-muted-foreground">Standar 10T Kemenkes</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['T1: Timbang BB/TB', 'T2: Ukur LILA', 'T3: Tekanan Darah', 'T4: TFU', 'T5: Presentasi Janin',
                    'T6: Imunisasi TT', 'T7: Tablet Fe', 'T8: Laboratorium', 'T9: Tatalaksana', 'T10: Konseling'].map((t, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">
                        {i + 1}
                      </div>
                      <p className="text-xs text-blue-700 font-medium leading-tight">{t.split(': ')[1]}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Klik "Kunjungan Baru" untuk mengisi form pemeriksaan ANC lengkap
                </p>
              </div>
            </TabsContent>

            <TabsContent value="mtbs">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Baby className="h-6 w-6 text-teal-500" />
                  <div>
                    <h3 className="font-semibold">Manajemen Terpadu Balita Sakit (MTBS)</h3>
                    <p className="text-sm text-muted-foreground">Untuk anak usia 2 bulan – 5 tahun</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Pneumonia', 'Diare', 'Demam/Malaria', 'Campak', 'Malnutrisi', 'Anemia'].map((k, i) => (
                    <div key={i} className="border rounded-lg p-3 hover:border-teal-300 cursor-pointer transition-colors">
                      <p className="font-medium text-sm">{k}</p>
                      <p className="text-xs text-muted-foreground mt-1">Klasifikasi & Tatalaksana</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kb">
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
                <Activity className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pelayanan Keluarga Berencana</h3>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-4">
                  {['IUD', 'Implan', 'Suntik', 'Pil', 'Kondom', 'MOW/MOP'].map((m, i) => (
                    <div key={i} className="border rounded-lg p-3 text-center hover:border-indigo-300 cursor-pointer">
                      <p className="font-medium text-sm">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side: Bumil Risiko Tinggi */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <h3 className="font-semibold">Bumil Risiko Tinggi</h3>
            </div>
            <div className="divide-y">
              {risikoData.map((r) => (
                <div key={r.id} className="p-4 hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{r.nama}</p>
                    <Badge variant="outline" className={r.risikoLevel === 'Tinggi' ? 'bg-red-50 text-red-600 border-red-200 text-xs' : 'bg-yellow-50 text-yellow-600 border-yellow-200 text-xs'}>
                      {r.risikoLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{r.usiaKehamilan}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.faktor.map((f, i) => (
                      <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-100">{f}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Kunjungan: {new Date(r.lastVisit).toLocaleDateString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grafik Kunjungan */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-semibold mb-3">Cakupan Kunjungan ANC</h3>
            {[
              { label: 'K1', target: 100, pencapaian: 92 },
              { label: 'K4', target: 100, pencapaian: 78 },
              { label: 'K6', target: 100, pencapaian: 65 },
            ].map((c, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-muted-foreground">{c.pencapaian}%</span>
                </div>
                <Progress value={c.pencapaian} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
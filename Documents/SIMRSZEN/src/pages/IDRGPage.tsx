import React, { useState } from 'react';
import { Calculator, FileText, Search, Download, ChevronRight, Info, BookOpen, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const claimData = [
  { id: '1', noSEP: 'SEP-2604001', pasien: 'Ahmad Fauzi', noRM: 'RM-001234', diagnosis: 'Z37.0 Persalinan Tunggal Hidup', kelas: 'II', lama: 3, tarif: 4850000, status: 'disetujui', drg: 'O-1-14-I', nama_drg: 'Normal delivery' },
  { id: '2', noSEP: 'SEP-2604002', pasien: 'Budi Santoso', noRM: 'RM-001235', diagnosis: 'I10 Hipertensi Esensial', kelas: 'III', lama: 2, tarif: 1250000, status: 'pending', drg: 'J-4-19-I', nama_drg: 'Hypertension simple' },
  { id: '3', noSEP: 'SEP-2604003', pasien: 'Citra Lestari', noRM: 'RM-001236', diagnosis: 'J18.9 Pneumonia tanpa spesifikasi', kelas: 'I', lama: 5, tarif: 6320000, status: 'ditolak', drg: 'E-4-14-I', nama_drg: 'Pneumonia NOS' },
  { id: '4', noSEP: 'SEP-2604004', pasien: 'Deni Kusuma', noRM: 'RM-001237', diagnosis: 'K35.9 Appendisitis Akut', kelas: 'II', lama: 4, tarif: 7200000, status: 'disetujui', drg: 'G-4-14-I', nama_drg: 'Appendectomy' },
  { id: '5', noSEP: 'SEP-2604005', pasien: 'Eka Putri', noRM: 'RM-001238', diagnosis: 'O82 Persalinan SC', kelas: 'I', lama: 4, tarif: 8500000, status: 'pending', drg: 'O-1-15-I', nama_drg: 'Caesarean delivery' },
];

const drgGroupMap = [
  { kode: 'O-1-14-I', nama: 'Normal delivery', tarif_kelas1: 5200000, tarif_kelas2: 4850000, tarif_kelas3: 3900000 },
  { kode: 'O-1-15-I', nama: 'Caesarean delivery', tarif_kelas1: 9800000, tarif_kelas2: 8500000, tarif_kelas3: 7200000 },
  { kode: 'J-4-19-I', nama: 'Hypertension simple', tarif_kelas1: 1500000, tarif_kelas2: 1250000, tarif_kelas3: 1000000 },
  { kode: 'E-4-14-I', nama: 'Pneumonia NOS', tarif_kelas1: 7500000, tarif_kelas2: 6320000, tarif_kelas3: 5100000 },
  { kode: 'G-4-14-I', nama: 'Appendectomy', tarif_kelas1: 8500000, tarif_kelas2: 7200000, tarif_kelas3: 5800000 },
];

const statusColors: Record<string, string> = {
  disetujui: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ditolak: 'bg-red-100 text-red-700 border-red-200',
};

export default function IDRGPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDRG, setSearchDRG] = useState('');

  const totalApproved = claimData.filter(c => c.status === 'disetujui').reduce((sum, c) => sum + c.tarif, 0);
  const totalPending = claimData.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.tarif, 0);

  const stats = [
    { label: 'Total Klaim', value: claimData.length, desc: 'Bulan ini', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Disetujui', value: claimData.filter(c => c.status === 'disetujui').length, desc: `Rp ${(totalApproved/1e6).toFixed(1)}M`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: claimData.filter(c => c.status === 'pending').length, desc: `Rp ${(totalPending/1e6).toFixed(1)}M`, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Ditolak', value: claimData.filter(c => c.status === 'ditolak').length, desc: 'Perlu koreksi', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const filteredClaims = claimData.filter(c =>
    c.pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.noSEP.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDRG = drgGroupMap.filter(d =>
    d.nama.toLowerCase().includes(searchDRG.toLowerCase()) ||
    d.kode.toLowerCase().includes(searchDRG.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-7 w-7 text-primary" />
            Sistem INA-DRG / iDRG
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Indonesia Diagnosis Related Groups — Sistem Pengelompokan Diagnosis untuk Klaim BPJS
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Klaim
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Buat Klaim Baru
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
              <BarChart3 className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="klaim">
        <TabsList>
          <TabsTrigger value="klaim">Daftar Klaim</TabsTrigger>
          <TabsTrigger value="grouper">Tarif DRG</TabsTrigger>
          <TabsTrigger value="panduan">Panduan Koding</TabsTrigger>
        </TabsList>

        {/* Klaim Tab */}
        <TabsContent value="klaim">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h3 className="font-semibold">Data Klaim INA-DRG</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pasien, SEP, atau diagnosis..."
                  className="pl-10 w-72"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">No SEP</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Pasien</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Diagnosis Utama</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Kode DRG</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Kelas</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Tarif</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredClaims.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20 cursor-pointer transition-colors">
                      <td className="p-3 text-sm font-mono text-blue-600">{c.noSEP}</td>
                      <td className="p-3">
                        <p className="text-sm font-medium">{c.pasien}</p>
                        <p className="text-xs text-muted-foreground">{c.noRM} • {c.lama} hari</p>
                      </td>
                      <td className="p-3 text-sm max-w-[200px]">
                        <p className="truncate">{c.diagnosis}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-mono">{c.drg}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{c.nama_drg}</p>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs">Kelas {c.kelas}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-sm font-semibold">Rp {c.tarif.toLocaleString('id-ID')}</p>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={`text-xs ${statusColors[c.status]}`}>
                          {c.status === 'disetujui' ? <CheckCircle className="h-3 w-3 mr-1 inline" /> : c.status === 'ditolak' ? <AlertTriangle className="h-3 w-3 mr-1 inline" /> : null}
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Grouper Tab */}
        <TabsContent value="grouper">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="font-semibold">Referensi Tarif INA-DRG</h3>
                <p className="text-sm text-muted-foreground">Berdasarkan Permenkes No. 3 Tahun 2023</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kode atau nama DRG..."
                  className="pl-10 w-64"
                  value={searchDRG}
                  onChange={(e) => setSearchDRG(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Kode DRG</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nama DRG</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Kelas I</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Kelas II</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Kelas III</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDRG.map((d, i) => (
                    <tr key={i} className="hover:bg-muted/20 cursor-pointer">
                      <td className="p-3 font-mono text-sm text-primary">{d.kode}</td>
                      <td className="p-3 text-sm font-medium">{d.nama}</td>
                      <td className="p-3 text-right text-sm">Rp {d.tarif_kelas1.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right text-sm">Rp {d.tarif_kelas2.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right text-sm">Rp {d.tarif_kelas3.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Panduan Tab */}
        <TabsContent value="panduan">
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Panduan Koding INA-DRG</h3>
                <p className="text-sm text-muted-foreground">Sesuai ketentuan BPJS Kesehatan</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Diagnosis Utama (PDX)', desc: 'Diagnosis yang merupakan kondisi utama yang dirawat atau diteliti selama episode pelayanan.' },
                { title: 'Diagnosis Sekunder (SDX)', desc: 'Kondisi yang ada bersamaan dengan diagnosis utama dan mempengaruhi manajemen pasien.' },
                { title: 'Prosedur Utama', desc: 'Tindakan bedah atau prosedur utama yang dilakukan selama perawatan.' },
                { title: 'Grouper INA-DRG', desc: 'Sistem pengelompokan diagnosis berdasarkan ICD-10-CM dan ICD-9-CM untuk prosedur.' },
                { title: 'SEP (Surat Eligibilitas Peserta)', desc: 'Dokumen yang menyatakan kelayakan peserta BPJS untuk mendapat pelayanan.' },
                { title: 'Validasi Klaim', desc: 'Proses verifikasi klaim oleh BPJS sebelum pembayaran dilakukan ke faskes.' },
              ].map((item, i) => (
                <div key={i} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
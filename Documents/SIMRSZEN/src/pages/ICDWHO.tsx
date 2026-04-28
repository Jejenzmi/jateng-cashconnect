import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, ExternalLink, Code2, List, Globe, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const icdData = [
  { kode: 'A00', nama: 'Kolera', blok: 'A00-A09', bab: 'I', kategori: 'Penyakit Infeksi Usus', chapter: 'Penyakit Infeksi & Parasit' },
  { kode: 'A01', nama: 'Demam Tifoid dan Paratifoid', blok: 'A00-A09', bab: 'I', kategori: 'Penyakit Infeksi Usus', chapter: 'Penyakit Infeksi & Parasit' },
  { kode: 'A09', nama: 'Diare dan Gastroenteritis Infeksi', blok: 'A00-A09', bab: 'I', kategori: 'Penyakit Infeksi Usus', chapter: 'Penyakit Infeksi & Parasit' },
  { kode: 'I10', nama: 'Hipertensi Esensial (Primer)', blok: 'I10-I16', bab: 'IX', kategori: 'Penyakit Hipertensi', chapter: 'Penyakit Sistem Sirkulasi' },
  { kode: 'I21', nama: 'Infark Miokard Akut', blok: 'I20-I25', bab: 'IX', kategori: 'Penyakit Jantung Iskemik', chapter: 'Penyakit Sistem Sirkulasi' },
  { kode: 'J06', nama: 'Infeksi Saluran Napas Atas Akut', blok: 'J00-J06', bab: 'X', kategori: 'ISPA', chapter: 'Penyakit Sistem Pernapasan' },
  { kode: 'J18', nama: 'Pneumonia', blok: 'J12-J18', bab: 'X', kategori: 'Pneumonia', chapter: 'Penyakit Sistem Pernapasan' },
  { kode: 'K35', nama: 'Appendisitis Akut', blok: 'K35-K38', bab: 'XI', kategori: 'Penyakit Appendiks', chapter: 'Penyakit Sistem Pencernaan' },
  { kode: 'O82', nama: 'Persalinan Seksio Sesarea', blok: 'O60-O75', bab: 'XV', kategori: 'Komplikasi Persalinan', chapter: 'Kehamilan, Persalinan & Nifas' },
  { kode: 'Z37', nama: 'Hasil Kelahiran', blok: 'Z30-Z39', bab: 'XXI', kategori: 'Faktor Status Kesehatan', chapter: 'Faktor Kesehatan & Kontak Layanan' },
  { kode: 'E11', nama: 'Diabetes Mellitus Tipe 2', blok: 'E10-E14', bab: 'IV', kategori: 'DM', chapter: 'Penyakit Endokrin & Metabolik' },
  { kode: 'N18', nama: 'Penyakit Ginjal Kronis', blok: 'N17-N19', bab: 'XIV', kategori: 'Gagal Ginjal', chapter: 'Penyakit Sistem Kemih' },
];

const chapters = [
  { no: 'I', range: 'A00-B99', nama: 'Penyakit Infeksi dan Parasit', count: 421 },
  { no: 'II', range: 'C00-D48', nama: 'Neoplasma', count: 386 },
  { no: 'III', range: 'D50-D89', nama: 'Penyakit Darah & Organ Hematopoetik', count: 78 },
  { no: 'IV', range: 'E00-E90', nama: 'Penyakit Endokrin, Nutrisi & Metabolik', count: 153 },
  { no: 'V', range: 'F00-F99', nama: 'Gangguan Mental dan Perilaku', count: 214 },
  { no: 'VI', range: 'G00-G99', nama: 'Penyakit Sistem Saraf', count: 189 },
  { no: 'IX', range: 'I00-I99', nama: 'Penyakit Sistem Sirkulasi', count: 247 },
  { no: 'X', range: 'J00-J99', nama: 'Penyakit Sistem Pernapasan', count: 156 },
  { no: 'XI', range: 'K00-K93', nama: 'Penyakit Sistem Pencernaan', count: 198 },
  { no: 'XIV', range: 'N00-N99', nama: 'Penyakit Sistem Kemih-Kelamin', count: 167 },
  { no: 'XV', range: 'O00-O99', nama: 'Kehamilan, Persalinan & Nifas', count: 298 },
  { no: 'XXI', range: 'Z00-Z99', nama: 'Faktor Status Kesehatan & Kontak Layanan', count: 263 },
];

export default function ICDWHO() {
  const [search, setSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const filtered = icdData.filter(d =>
    d.kode.toLowerCase().includes(search.toLowerCase()) ||
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.kategori.toLowerCase().includes(search.toLowerCase())
  ).filter(d => !selectedChapter || d.bab === selectedChapter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" />
            ICD-10 WHO (International Classification of Diseases)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Klasifikasi Penyakit Internasional Edisi ke-10 — WHO 2019 Revision
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://icd.who.int" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              ICD Browser WHO
            </a>
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Panduan Penggunaan ICD-10 dalam SIMRS ZEN</p>
          <p className="text-sm text-blue-600 mt-1">
            Kode ICD-10 digunakan untuk diagnosis pasien, klaim BPJS (INA-DRG), laporan morbiditas, 
            dan pelaporan ke Kemenkes melalui Satu Sehat. Pastikan kode yang digunakan sesuai dengan 
            <strong className="text-blue-700"> Buku ICD-10 Volume 3 (Alphabetical Index)</strong>.
          </p>
        </div>
      </div>

      <Tabs defaultValue="cari">
        <TabsList>
          <TabsTrigger value="cari">Pencarian Kode</TabsTrigger>
          <TabsTrigger value="chapter">Daftar Bab (Chapter)</TabsTrigger>
          <TabsTrigger value="panduan">Cara Penggunaan</TabsTrigger>
        </TabsList>

        {/* Pencarian */}
        <TabsContent value="cari" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kode ICD (contoh: I10, J18, Hipertensi, Pneumonia...)"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {selectedChapter && (
              <Button variant="outline" size="sm" onClick={() => setSelectedChapter(null)}>
                <Filter className="h-4 w-4 mr-2" />
                Bab {selectedChapter}
                <span className="ml-2 text-muted-foreground">✕</span>
              </Button>
            )}
          </div>

          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <p className="text-sm text-muted-foreground">
                Menampilkan {filtered.length} dari {icdData.length} kode
                {selectedChapter && ` (Bab ${selectedChapter})`}
              </p>
            </div>
            <div className="divide-y">
              {filtered.map((d, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/20 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm font-mono">{d.kode}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{d.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{d.chapter}</span>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs py-0">{d.kategori}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">Blok {d.blok}</span>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs h-7">
                      Pilih
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Kode ICD tidak ditemukan</p>
                  <p className="text-xs mt-1">Coba kata kunci lain atau lihat Bab ICD</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Chapter List */}
        <TabsContent value="chapter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((c, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:border-primary/40 transition-colors ${selectedChapter === c.no ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => {
                  setSelectedChapter(c.no === selectedChapter ? null : c.no);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">{c.no}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{c.range}</Badge>
                </div>
                <p className="font-medium text-sm leading-tight">{c.nama}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.count} kode</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Panduan */}
        <TabsContent value="panduan">
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5 text-primary" />
                Cara Membaca Kode ICD-10
              </h3>
              <div className="bg-muted/30 rounded-xl p-4 font-mono text-center text-2xl font-bold mb-4">
                <span className="text-red-500">J</span>
                <span className="text-blue-500">18</span>
                <span className="text-green-500">.9</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 font-bold text-lg">J</p>
                  <p className="text-red-700 font-medium">Letter/Huruf</p>
                  <p className="text-xs text-red-600 mt-1">Menunjukkan Bab (Chapter X = Pernapasan)</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-600 font-bold text-lg">18</p>
                  <p className="text-blue-700 font-medium">Angka 2 digit</p>
                  <p className="text-xs text-blue-600 mt-1">Kode kategori spesifik penyakit</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-600 font-bold text-lg">.9</p>
                  <p className="text-green-700 font-medium">Subkategori</p>
                  <p className="text-xs text-green-600 mt-1">Spesifikasi lebih detail (opsional)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <List className="h-4 w-4" />
                Aturan Pemilihan Kode
              </h4>
              <div className="space-y-3">
                {[
                  { no: '1', judul: 'Diagnosis Utama (PDX)', isi: 'Pilih kondisi yang menjadi alasan utama perawatan, bukan komplikasi atau penyakit penyerta.' },
                  { no: '2', judul: 'Spesifisitas Maksimal', isi: 'Gunakan kode yang paling spesifik. Hindari penggunaan kode NOS (.9) jika informasi lebih spesifik tersedia.' },
                  { no: '3', judul: 'Urutan Kode', isi: 'Untuk kondisi ganda, dagger (†) untuk penyakit utama dan asterisk (*) untuk manifestasinya.' },
                  { no: '4', judul: 'Validasi BPJS', isi: 'Pastikan kode diagnosis sesuai dengan prosedur yang dilakukan untuk menghindari penolakan klaim INA-DRG.' },
                ].map((r) => (
                  <div key={r.no} className="flex gap-4 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {r.no}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{r.judul}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.isi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
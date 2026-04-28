# Dokumentasi Modul SIMRS ZEN

## Daftar Modul

### 1. Modul Rawat Inap
- **Lokasi File**: `src/components/inpatient/InpatientManagement.tsx`
- **Deskripsi**: Modul untuk mengelola pasien rawat inap, termasuk manajemen kamar, tempat tidur, dan perawatan harian
- **Fitur**:
  - Daftar pasien rawat inap
  - Tambah pasien rawat inap baru
  - Detail informasi rawat inap
  - Status perawatan (dirawat, pulang, dipindahkan)
  - Pencarian dan filter

### 2. Modul Laboratorium
- **Lokasi File**: `src/components/laboratory/LaboratoryManagement.tsx`
- **Deskripsi**: Modul untuk mengelola permintaan dan hasil pemeriksaan laboratorium
- **Fitur**:
  - Daftar permintaan uji laboratorium
  - Tambah permintaan uji baru
  - Status pemeriksaan (menunggu, dalam proses, selesai)
  - Hasil pemeriksaan
  - Pencarian dan filter

### 3. Modul Radiologi
- **Lokasi File**: `src/components/radiology/RadiologyManagement.tsx`
- **Deskripsi**: Modul untuk mengelola permintaan dan hasil pemeriksaan radiologi/imaging
- **Fitur**:
  - Daftar permintaan uji radiologi
  - Tambah permintaan uji baru
  - Status pemeriksaan (diminta, dalam proses, selesai)
  - Hasil pemeriksaan
  - File gambar hasil imaging
  - Pencarian dan filter

### 4. Modul Imunisasi
- **Lokasi File**: `src/components/immunization/ImmunizationManagement.tsx`
- **Deskripsi**: Modul untuk mengelola program imunisasi dan jadwal vaksinasi
- **Fitur**:
  - Daftar jadwal imunisasi
  - Tambah jadwal imunisasi baru
  - Status imunisasi (selesai, terjadwal, terlewat)
  - Jenis vaksin dan nomor batch
  - Jadwal berikutnya
  - Pencarian dan filter

### 5. Modul KIA (Kartu Ibu dan Anak)
- **Lokasi File**: `src/components/kia/KIAManagement.tsx`
- **Deskripsi**: Modul untuk mengelola kartu ibu dan anak, termasuk data kehamilan dan kelahiran
- **Fitur**:
  - Daftar rekam KIA
  - Tambah rekam KIA baru
  - Status kehamilan (hamil, telah melahirkan, masa nifas)
  - Minggu kehamilan
  - Tanggal perkiraan lahir
  - Faktor risiko
  - Catatan kesehatan
  - Pencarian dan filter

## Routing dan Navigasi

### Routing Baru
- `/inpatient` - Modul Rawat Inap
- `/laboratory` - Modul Laboratorium
- `/radiology` - Modul Radiologi
- `/immunization` - Modul Imunisasi
- `/kia` - Modul KIA

### Navigasi Sidebar
Semua modul baru telah ditambahkan ke sidebar navigasi utama dengan ikon yang sesuai dan penyesuaian otomatis berdasarkan tipe faskes.

## Penyesuaian Berdasarkan Tipe Faskes

Dashboard dan modul yang tersedia akan menyesuaikan diri berdasarkan tipe faskes yang dipilih saat setup awal:

- **Rumah Sakit Kelas A & B**: Semua modul tersedia (pasien, registrasi, rekam medis, farmasi, keuangan, rawat inap, laboratorium, radiologi)
- **Rumah Sakit Kelas C & D**: Modul inti + rawat inap
- **FKTP & Klinik**: Modul dasar (pasien, registrasi, rekam medis, farmasi, keuangan)
- **Puskesmas**: Modul dasar + imunisasi dan KIA

## Integrasi Database

Semua modul yang dibuat mengikuti arsitektur yang sama dengan modul-modul sebelumnya, dengan:
- API client untuk komunikasi dengan backend
- State management menggunakan React Query
- Validasi form dan error handling
- Data disimpan secara persisten di database PostgreSQL

## Komponen UI yang Digunakan

- **Shadcn UI**: Komponen UI yang konsisten dan responsif
- **Lucide React**: Ikon-ikon yang sesuai dengan masing-masing modul
- **React Router**: Navigasi antar halaman
- **React Query**: Pengelolaan state asinkron dan caching
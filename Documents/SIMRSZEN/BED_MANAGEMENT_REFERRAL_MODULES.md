# Dokumentasi Modul Bed Management dan Rujukan

## Deskripsi
Dokumentasi ini menjelaskan dua modul tambahan yang telah diimplementasikan dalam sistem SIMRS ZEN: Modul Bed Management untuk manajemen tempat tidur dan Modul Rujukan untuk manajemen rujukan internal dan eksternal.

## 1. Modul Bed Management

### 1.1 Deskripsi
Modul untuk mengelola ketersediaan tempat tidur di ruang rawat inap, termasuk booking, alokasi, dan pemantauan status kamar. Modul ini menyediakan fungsionalitas untuk mengelola kapasitas dan ketersediaan kamar rawat inap.

### 1.2 Entitas Database
- Menggunakan entitas [Kamar](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L284-L300) yang sudah ada
- Menggunakan entitas [InpatientStay](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L262-L282) yang sudah ada
- Menggunakan entitas [Patient](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L35-L49) yang sudah ada

### 1.3 Fungsionalitas
- Pemantauan ketersediaan kamar secara real-time
- Sistem booking kamar untuk pasien
- Pemantauan status kamar dan okupansi
- Laporan ketersediaan dan okupansi kamar
- Pencarian kamar berdasarkan kelas dan lokasi
- Informasi pasien yang saat ini menempati kamar

### 1.4 Komponen Backend
- **BedManagementService.ts**: Servis untuk operasi manajemen tempat tidur

### 1.5 Endpoint API
- `GET /beds/available` - Mendapatkan ketersediaan kamar
- `POST /beds/book` - Booking kamar untuk pasien
- `GET /beds/{kamarId}/status` - Mendapatkan status kamar saat ini
- `GET /beds/report` - Mendapatkan laporan ketersediaan kamar

## 2. Modul Rujukan

### 2.1 Deskripsi
Modul untuk mengelola rujukan internal antar departemen dan rujukan eksternal ke rumah sakit lain. Modul ini menyediakan fungsionalitas untuk membuat, melacak, dan mengelola permintaan rujukan pasien.

### 2.2 Entitas Database
- **Referral** (akan ditambahkan ke schema.prisma nanti): Data rujukan pasien (nomor rujukan, pasien, rumah sakit pengirim/tujuan, dokter, poli, dll)

### 2.3 Fungsionalitas
- Pembuatan surat rujukan
- Manajemen rujukan internal antar poli/departemen
- Manajemen rujukan eksternal ke rumah sakit lain
- Sistem approval untuk rujukan
- Pelacakan status rujukan
- Riwayat rujukan pasien
- Sinkronisasi ke sistem rujukan nasional (akan datang)

### 2.4 Komponen Backend
- **ReferralService.ts**: Servis untuk operasi manajemen rujukan

### 2.5 Endpoint API
- `POST /referrals` - Membuat permintaan rujukan baru
- `GET /referrals` - Mendapatkan daftar rujukan
- `GET /referrals/{id}` - Mendapatkan detail rujukan
- `PUT /referrals/{id}/approve` - Menyetujui rujukan
- `PUT /referrals/{id}/reject` - Menolak rujukan
- `PUT /referrals/{id}/cancel` - Membatalkan rujukan
- `GET /patients/{id}/referrals` - Mendapatkan riwayat rujukan pasien

## 3. Integrasi dengan Modul Lain

### 3.1 Integrasi dengan Modul Rawat Inap
- Bed Management berintegrasi langsung dengan modul rawat inap untuk memonitor okupansi kamar
- Data dari [InpatientStay](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L262-L282) digunakan untuk menghitung ketersediaan kamar

### 3.2 Integrasi dengan Modul Pasien
- Kedua modul menggunakan data pasien dari entitas [Patient](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L35-L49)
- Modul rujukan melacak riwayat rujukan berdasarkan pasien

### 3.3 Integrasi dengan Modul BPJS
- Rujukan dapat disinkronkan ke sistem BPJS (akan diimplementasikan)
- Data rujukan dapat digunakan untuk klaim BPJS

## 4. Kinerja dan Skalabilitas

### 4.1 Optimalisasi Query
- Query database dioptimalkan untuk mendukung akses data yang cepat
- Indeks ditambahkan untuk kolom yang sering digunakan dalam pencarian

### 4.2 Caching
- Data ketersediaan kamar dapat di-cache untuk mengurangi beban database
- Data rujukan yang sering diakses dapat di-cache

## 5. Keamanan

### 5.1 Akses Data
- Hanya pengguna dengan hak akses yang sesuai yang dapat membuat atau memodifikasi rujukan
- Akses ke data kamar dibatasi berdasarkan peran pengguna

### 5.2 Validasi Input
- Semua input divalidasi sebelum diproses
- Parameter dicek untuk mencegah SQL injection dan serangan lainnya

## 6. Implementasi Lanjutan

### 6.1 Sistem Booking Lengkap
- Sistem reservasi kamar yang lengkap dengan fitur konfirmasi
- Notifikasi otomatis untuk ketersediaan kamar
- Integrasi dengan sistem penjadwalan

### 6.2 Sistem Rujukan Elektronik
- Integrasi dengan sistem rujukan nasional
- Digital signature untuk dokumen rujukan
- Tracking rujukan secara real-time
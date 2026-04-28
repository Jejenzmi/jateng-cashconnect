# Panduan Penggunaan SIMRS ZEN

## Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Login dan Autentikasi](#login-dan-autentikasi)
3. [Modul Pasien](#modul-pasien)
4. [Modul Kunjungan](#modul-kunjungan)
5. [Modul Rekam Medis](#modul-rekam-medis)
6. [Modul Farmasi](#modul-farmasi)
7. [Modul Laboratorium](#modul-laboratorium)
8. [Modul Radiologi](#modul-radiologi)
9. [Modul Keuangan](#modul-keuangan)
10. [Modul BPJS](#modul-bpjs)
11. [Laporan](#laporan)
12. [Manajemen Pengguna](#manajemen-pengguna)

## Pendahuluan

SIMRS ZEN adalah sistem informasi rumah sakit berbasis web yang dirancang untuk mendukung operasional rumah sakit secara menyeluruh. Sistem ini mencakup manajemen pasien, rekam medis, farmasi, laboratorium, radiologi, keuangan, dan integrasi BPJS.

### Persyaratan Sistem
- Browser modern (Chrome, Firefox, Safari, Edge terbaru)
- Koneksi internet stabil
- Hak akses sesuai peran pengguna

## Login dan Autentikasi

1. Buka browser dan akses URL SIMRS ZEN
2. Masukkan email dan password Anda
3. Klik tombol "Login"
4. Sistem akan mengarahkan Anda ke dashboard berdasarkan hak akses Anda

Jika lupa password, klik "Lupa Password" dan ikuti instruksi yang dikirim ke email Anda.

## Modul Pasien

### Mendaftarkan Pasien Baru
1. Klik menu "Pasien" di sidebar
2. Klik tombol "Tambah Pasien"
3. Isi formulir pendaftaran:
   - Nomor Induk Kependudukan (NIK)
   - Nama Lengkap
   - Jenis Kelamin
   - Tanggal Lahir
   - Alamat Lengkap
   - Nomor HP
   - Pekerjaan
4. Klik "Simpan"

### Mencari Data Pasien
1. Pada halaman pasien, gunakan kolom pencarian
2. Masukkan NIK, nama, atau nomor RM
3. Hasil pencarian akan muncul secara otomatis

### Melihat Detail Pasien
1. Klik pada baris data pasien untuk melihat detail
2. Detail mencakup riwayat kunjungan, rekam medis, dan pengobatan sebelumnya

## Modul Kunjungan

### Membuat Kunjungan Baru
1. Klik menu "Kunjungan" di sidebar
2. Klik tombol "Tambah Kunjungan"
3. Pilih pasien dari daftar atau cari menggunakan NIK
4. Pilih poli dan dokter
5. Tambahkan catatan kunjungan jika diperlukan
6. Klik "Simpan"

### Status Kunjungan
- **Terdaftar**: Pasien terdaftar namun belum diperiksa
- **Diperiksa**: Pasien sedang diperiksa dokter
- **Selesai**: Pemeriksaan selesai
- **Dibayar**: Biaya kunjungan sudah diselesaikan

## Modul Rekam Medis

### Membuat Rekam Medis Baru
1. Akses dari menu "Rekam Medis"
2. Klik "Tambah Rekam Medis"
3. Pilih pasien dan kunjungan
4. Isi komponen SOAP:
   - Subjectif: Keluhan pasien
   - Objektif: Hasil pemeriksaan fisik
   - Asesmen: Diagnosis sementara
   - Planning: Rencana pengobatan
5. Klik "Simpan"

### Melihat Riwayat Rekam Medis
Gunakan filter berdasarkan pasien atau rentang tanggal untuk melihat riwayat rekam medis.

## Modul Farmasi

### Membuat Resep Obat
1. Akses dari menu "Farmasi"
2. Pilih pasien dan kunjungan
3. Tambahkan obat dari daftar persediaan
4. Atur dosis, jumlah, dan aturan pakai
5. Klik "Simpan Resep"

### Penyerahan Obat
1. Pada halaman resep, pilih resep yang akan diserahkan
2. Klik "Proses Penyerahan"
3. Verifikasi stok dan pastikan cukup
4. Konfirmasi penyerahan

## Modul Laboratorium

### Membuat Permintaan Lab
1. Akses dari menu "Laboratorium"
2. Pilih pasien dan kunjungan
3. Pilih jenis pemeriksaan
4. Klik "Buat Permintaan"

### Entri Hasil Lab
1. Pada daftar permintaan, pilih yang statusnya "Proses"
2. Klik "Entri Hasil"
3. Isi nilai hasil pemeriksaan
4. Klik "Simpan Hasil"

## Modul Radiologi

### Membuat Permintaan Radiologi
1. Akses dari menu "Radiologi"
2. Pilih pasien dan kunjungan
3. Pilih jenis pemeriksaan radiologi
4. Klik "Buat Permintaan"

### Entri Hasil Radiologi
1. Pada daftar permintaan, pilih yang statusnya "Proses"
2. Klik "Entri Hasil"
3. Isi hasil pemeriksaan dan unggah gambar jika diperlukan
4. Klik "Simpan Hasil"

## Modul Keuangan

### Pendaftaran Pembayaran
1. Akses dari menu "Keuangan" lalu "Pembayaran"
2. Pilih kunjungan pasien
3. Sistem akan menampilkan rincian biaya
4. Pilih metode pembayaran
5. Klik "Proses Pembayaran"

### Laporan Keuangan
1. Akses dari menu "Keuangan" lalu "Laporan"
2. Pilih periode laporan
3. Pilih jenis laporan (harian, mingguan, bulanan)
4. Klik "Generate Laporan"

## Modul BPJS

### Sinkronisasi Data BPJS
1. Akses dari menu "BPJS"
2. Pilih submenu "Sinkronisasi"
3. Pilih jenis data untuk disinkronkan (pasien, kunjungan, dll)
4. Klik "Mulai Sinkronisasi"

### Antrean Online
1. Sistem otomatis membuat antrean BPJS saat pendaftaran
2. Monitor status antrean di submenu "Antrean"
3. Lihat estimasi waktu layanan

## Laporan

### Laporan Harian
1. Akses dari menu "Laporan"
2. Pilih "Laporan Harian"
3. Pilih tanggal
4. Klik "Generate"

### Laporan Bulanan
1. Pilih "Laporan Bulanan"
2. Pilih bulan dan tahun
3. Klik "Generate"

## Manajemen Pengguna

### Tambah Pengguna Baru
1. Akses dari menu "Pengaturan" lalu "Manajemen Pengguna"
2. Klik "Tambah Pengguna"
3. Isi informasi pengguna:
   - Email
   - Nama Lengkap
   - Peran (Admin, Dokter, Perawat, Kasir, dll)
4. Klik "Simpan"

### Atur Hak Akses
1. Klik pada pengguna untuk mengatur hak akses
2. Pilih modul-modul yang dapat diakses
3. Atur izin (lihat, tambah, ubah, hapus)
4. Simpan perubahan
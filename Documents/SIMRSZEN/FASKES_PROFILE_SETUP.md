# Setup Profil Fasilitas Kesehatan (Faskes) - SIMRS ZEN

## Gambaran Umum

Fitur setup profil faskes memungkinkan superadmin untuk mengkonfigurasi identitas dan karakteristik dari fasilitas kesehatan yang menggunakan SIMRS ZEN. Dashboard akan menyesuaikan tampilan dan modul yang tersedia berdasarkan tipe faskes yang dipilih.

## Tipe Fasilitas Kesehatan yang Didukung

- **Rumah Sakit Kelas A (A)**
- **Rumah Sakit Kelas B (B)**
- **Rumah Sakit Kelas C (C)**
- **Rumah Sakit Kelas D (D)**
- **Fasilitas Kesehatan Tingkat Pertama (FKTP)**
- **Klinik (KLINIK)**
- **Puskesmas (PUSKESMAS)**

## Proses Setup Awal

### 1. Akses Halaman Setup
Superadmin dapat mengakses halaman setup melalui menu navigasi "Setup Faskes" atau secara langsung ke `/setup`.

### 2. Isi Informasi Dasar Faskes
- **Nama Faskes**: Nama resmi fasilitas kesehatan
- **Tipe Faskes**: Pilih dari opsi yang tersedia (A, B, C, D, FKTP, KLINIK, PUSKESMAS)
- **Alamat Lengkap**: Alamat fisik faskes
- **Kota/Kabupaten**: Lokasi faskes
- **Provinsi**: Provinsi faskes berada
- **Nomor Telepon**: Kontak utama faskes
- **Email**: Alamat email resmi faskes
- **Nomor Izin Operasional**: Nomor lisensi operasional faskes
- **Beroperasi Sejak**: Tanggal mulai operasional
- **Kapasitas Tempat Tidur**: Jumlah tempat tidur (untuk RS)
- **Nama Direktur**: Nama pimpinan faskes
- **Deskripsi**: Informasi tambahan tentang faskes

### 3. Penyimpanan Data
Informasi profil disimpan ke dalam localStorage browser untuk akses cepat dan efisien. Dalam implementasi backend, data akan disimpan ke dalam database.

## Penyesuaian Dashboard Berdasarkan Tipe Faskes

Setelah profil disimpan, dashboard akan menyesuaikan diri dengan tipe faskes yang dipilih:

### Rumah Sakit Kelas A & B
- Menampilkan modul lengkap: Pasien, Registrasi, Rekam Medis, Farmasi, Keuangan, Rawat Inap, Laboratorium, Radiologi
- Menampilkan statistik khusus: jumlah tempat tidur, okupansi, jumlah staf
- Menyesuaikan jumlah data dan volume operasional

### Rumah Sakit Kelas C & D
- Menampilkan modul inti: Pasien, Registrasi, Rekam Medis, Farmasi, Keuangan, Rawat Inap
- Menampilkan statistik dasar: jumlah pasien, pendapatan, obat
- Menyesuaikan kapasitas dan volume operasional

### FKTP & Klinik
- Menampilkan modul dasar: Pasien, Registrasi, Rekam Medis, Farmasi, Keuangan
- Fokus pada pelayanan rawat jalan
- Menyesuaikan kapasitas dan volume operasional

### Puskesmas
- Menampilkan modul spesifik: Pasien, Registrasi, Rekam Medis, Farmasi, Imunisasi, KIA (Kartu Ibu Anak)
- Menyesuaikan fokus pada pelayanan preventif dan promotif
- Menampilkan modul-program khusus puskesmas

## Akses ke Profil Faskes

Setelah setup awal selesai, superadmin dapat mengakses kembali profil faskes melalui menu "Profil Faskes" atau `/profile` untuk melihat atau mengedit informasi yang telah disimpan.

## Manfaat Sistem

1. **Personalisasi**: Dashboard dan modul menyesuaikan dengan kebutuhan spesifik tipe faskes
2. **Efisiensi**: Menyembunyikan modul yang tidak relevan dengan tipe faskes
3. **Kesesuaian Regulasi**: Menyesuaikan dengan standar dan peraturan untuk masing-masing tipe faskes
4. **Pengalaman Pengguna**: Tampilan yang lebih fokus dan mudah digunakan sesuai dengan fungsi faskes
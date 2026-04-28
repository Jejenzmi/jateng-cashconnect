# Dokumentasi Integrasi ICD WHO - SIMRS ZEN

## Gambaran Umum

Integrasi International Classification of Diseases (ICD) WHO ke dalam sistem SIMRS ZEN memungkinkan rumah sakit untuk menggunakan standar klasifikasi penyakit internasional secara langsung dari sumber resmi. ICD adalah sistem klasifikasi penyakit dan kondisi kesehatan yang digunakan secara global untuk statistik kesehatan, penelitian medis, dan penagihan.

## Tujuan Implementasi

- Menyediakan akses langsung ke klasifikasi penyakit ICD resmi dari WHO
- Memastikan penggunaan kode ICD yang akurat dan mutakhir
- Mempermudah proses dokumentasi medis dan pelaporan
- Mendukung sistem penagihan berbasis ICD (seperti iDRG)

## Arsitektur Sistem

### 1. Model Database

#### ICDCredential
- **id**: String (Primary Key)
- **clientId**: String - ID klien dari registrasi API WHO
- **clientSecret**: String - Kode rahasia klien
- **isActive**: Boolean - Status aktif credential
- **createdAt**: DateTime
- **updatedAt**: DateTime

### 2. Service Layer

#### ICDWHOService
- **setCredentials**: Mengatur kredensial ICD WHO
- **loadCredentials**: Memuat kredensial dari database
- **getAccessToken**: Mendapatkan token akses dari API WHO
- **searchICDCodes**: Mencari kode ICD berdasarkan istilah pencarian
- **getICDDetails**: Mendapatkan detail kode ICD berdasarkan ID
- **getICDChapters**: Mendapatkan daftar chapter ICD

### 3. Controller Layer

#### ICDWHOController
- Menyediakan endpoint API untuk semua fungsi pada service layer
- Menangani validasi input
- Memberikan respon dalam format JSON standar

### 4. Frontend Component

#### ICDWHOIntegration
- Antarmuka pengguna untuk mengelola integrasi ICD WHO
- Terdiri dari tiga tab: Pencarian Kode, Chapter ICD, dan Pengaturan
- Fitur pencarian kode ICD
- Tampilan detail kode ICD
- Form untuk pengaturan kredensial

## Fungsi Utama

### 1. Pencarian Kode ICD
- Mencari kode ICD berdasarkan nama penyakit atau gejala
- Menampilkan hasil pencarian dengan skor relevansi
- Menyediakan detail kode ICD

### 2. Navigasi Chapter
- Menampilkan daftar chapter dalam klasifikasi ICD
- Mengorganisasi kode-kode ICD dalam struktur hierarkis

### 3. Pengaturan Kredensial
- Menyimpan kredensial API ICD WHO (Client ID dan Client Secret)
- Menggunakan database untuk menyimpan kredensial secara aman
- Tidak bergantung pada variabel lingkungan saja

## Endpoint API

- `POST /api/icd-who/credentials`: Mengatur kredensial ICD WHO
- `GET /api/icd-who/search`: Mencari kode ICD
- `GET /api/icd-who/details/:codeId`: Mendapatkan detail kode ICD
- `GET /api/icd-who/chapters`: Mendapatkan daftar chapter ICD

## Proses Otentikasi

1. Sistem menggunakan otentikasi OAuth 2.0 client credentials
2. Kredensial disimpan di database untuk persistensi
3. Token akses diminta sebelum setiap permintaan API
4. Token digunakan dalam header Authorization setiap permintaan

## Integrasi dengan Sistem Lain

- Terhubung dengan modul rekam medis untuk pilihan diagnosis
- Dapat digunakan bersama sistem iDRG untuk klasifikasi kasus
- Membantu dalam pelaporan ke institusi kesehatan nasional

## Keamanan

- Kredensial API disimpan di database, bukan di file konfigurasi
- Enkripsi disarankan untuk kredensial sensitif
- Semua permintaan API dilindungi dengan token akses
- Akses terbatas hanya untuk pengguna dengan hak istimewa

## Konfigurasi

Untuk mengaktifkan integrasi ICD WHO, Anda perlu:

1. Mendaftar ke layanan API ICD WHO di https://icd.who.int/
2. Mendapatkan Client ID dan Client Secret
3. Mengonfigurasi kredensial melalui antarmuka pengaturan
4. Menguji koneksi untuk memastikan integrasi berfungsi
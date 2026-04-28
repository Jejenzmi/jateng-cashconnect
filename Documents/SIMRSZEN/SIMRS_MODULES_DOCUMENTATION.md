# Dokumentasi Modul SIMRS Utama

## Deskripsi
Dokumentasi ini menjelaskan modul-modul SIMRS utama yang telah diimplementasikan dalam sistem SIMRS ZEN, khususnya modul yang berhubungan dengan data pasien dan kunjungan serta integrasi dengan BPJS.

## Modul yang Telah Diimplementasikan

### 1. Modul Manajemen Pasien

#### 1.1 Deskripsi
Modul untuk mengelola data pasien termasuk identitas, data BPJS, dan informasi kontak. Modul ini menyediakan fungsionalitas CRUD (Create, Read, Update, Delete) untuk data pasien.

#### 1.2 Entitas Database
- **Patient**: Data dasar pasien (ID, NIK, No Kartu BPJS, Nama, Jenis Kelamin, Tanggal Lahir, dll)
- **BpjsPatientData**: Data pasien dari sistem BPJS (kelas tanggungan, jenis peserta, dll)

#### 1.3 Fungsionalitas
- Tambah, edit, hapus data pasien
- Sinkronisasi data pasien dengan sistem BPJS
- Validasi data pasien sebelum disimpan

#### 1.4 Komponen Frontend
- **PatientManager.tsx**: Komponen React untuk manajemen data pasien

### 2. Modul Manajemen Kunjungan

#### 2.1 Deskripsi
Modul untuk mengelola kunjungan pasien ke rumah sakit, termasuk pendaftaran, pemeriksaan, dan status kunjungan. Modul ini menyediakan fungsionalitas untuk mencatat pelayanan yang diberikan kepada pasien.

#### 2.2 Entitas Database
- **Visit**: Data kunjungan pasien (pasien, poli, dokter, tanggal periksa, catatan, status, dll)
- **Poli**: Data poliklinik
- **Dokter**: Data dokter
- **Item**: Data obat, tindakan, atau barang
- **Prescription**: Resep obat untuk kunjungan tertentu

#### 2.3 Fungsionalitas
- Tambah, edit, hapus data kunjungan
- Pemilihan pasien, poli, dan dokter
- Pencatatan catatan kunjungan
- Pembaruan status kunjungan

#### 2.4 Komponen Frontend
- **VisitManager.tsx**: Komponen React untuk manajemen kunjungan pasien

### 3. Modul Sinkronisasi BPJS

#### 3.1 Deskripsi
Modul untuk mengotomatiskan sinkronisasi data kunjungan pasien ke sistem BPJS, termasuk pendaftaran, tindakan medis, dan klaim. Modul ini menyediakan mekanisme untuk mengirim data ke berbagai layanan BPJS.

#### 3.2 Entitas Database
- **BpjsSyncRecord**: Catatan sinkronisasi (kunjungan, jenis sinkronisasi, status, respons BPJS, dll)

#### 3.3 Fungsionalitas
- Sinkronisasi data registrasi ke BPJS
- Sinkronisasi data tindakan ke BPJS
- Pelacakan status sinkronisasi
- Penanganan error dan retry

#### 3.4 Komponen Backend
- **BpjsSyncService.ts**: Servis untuk operasi sinkronisasi
- **BpjsSyncController.ts**: Controller untuk endpoint sinkronisasi
- **BpjsSyncRoute.ts**: Definisi route untuk endpoint sinkronisasi

#### 3.5 Komponen Frontend
- Fungsi sinkronisasi di **VisitManager.tsx**

### 4. Modul Antrian Proses BPJS

#### 4.1 Deskripsi
Modul untuk mengelola antrian permintaan ke layanan BPJS, memungkinkan pemrosesan asynchronous dan retry otomatis jika gagal.

#### 4.2 Entitas Database
- **BpjsSyncQueue**: Antrian permintaan ke layanan BPJS

#### 4.3 Fungsionalitas
- Penambahan permintaan ke antrian
- Pemrosesan antrian secara asynchronous
- Mekanisme retry otomatis
- Penjadwalan pemrosesan

### 5. Modul Cache BPJS

#### 5.1 Deskripsi
Modul untuk menyimpan sementara hasil permintaan ke layanan BPJS, mengurangi beban permintaan dan meningkatkan kinerja.

#### 5.2 Entitas Database
- **BpjsCache**: Data cache hasil permintaan BPJS

#### 5.3 Fungsionalitas
- Penyimpanan hasil permintaan
- Pengambilan data dari cache
- Pembersihan cache kadaluarsa
- Manajemen TTL (Time To Live)

## Arsitektur Integrasi

### Alur Sinkronisasi Data
1. Petugas medis mencatat kunjungan pasien di SIMRS ZEN
2. Sistem menyiapkan data untuk dikirim ke BPJS
3. Data ditambahkan ke antrian sinkronisasi
4. Worker memproses antrian dan mengirim ke BPJS
5. Respons BPJS dicatat dan status sinkronisasi diperbarui
6. Log aktivitas dicatat untuk audit trail

### Skalabilitas
- Sistem dirancang untuk menangani volume data besar
- Antrian memungkinkan pemrosesan asynchronous
- Cache mengurangi beban permintaan ke layanan eksternal
- Skema database dioptimalkan untuk query yang efisien

## Endpoint API Terkait

### Endpoint SIMRS
- `/patients` - Manajemen data pasien
- `/visits` - Manajemen kunjungan
- `/polis` - Manajemen poliklinik
- `/dokters` - Manajemen dokter

### Endpoint BPJS
- `/sync/visit/:visitId` - Sinkronisasi kunjungan
- `/sync/registration/:visitId` - Sinkronisasi registrasi
- `/sync/treatment/:visitId` - Sinkronisasi tindakan
- `/sync/history/:visitId` - Riwayat sinkronisasi
- `/queue` - Manajemen antrian
- `/cache` - Manajemen cache

## Keamanan
- Data sensitif dienkripsi di database
- Otentikasi API dengan API Key
- Logging aktivitas untuk audit trail
- Validasi input untuk mencegah injection

## Kinerja
- Indeks database untuk query cepat
- Sistem cache untuk data yang sering diakses
- Antrian untuk pemrosesan asynchronous
- Pagination untuk data dalam jumlah besar
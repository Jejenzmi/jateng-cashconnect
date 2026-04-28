# Dokumentasi Modul SIMRS ZEN

## Deskripsi
Dokumentasi ini menjelaskan modul-modul SIMRS utama yang telah diimplementasikan dalam sistem SIMRS ZEN, mencakup modul SIMRS inti dan integrasi dengan sistem eksternal seperti BPJS.

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

### 3. Modul Rawat Inap

#### 3.1 Deskripsi
Modul untuk mengelola pasien rawat inap, termasuk pendaftaran, pemindahan kamar, dan pemulangan pasien. Modul ini menyediakan fungsionalitas manajemen tempat tidur dan perawatan pasien selama dirawat.

#### 3.2 Entitas Database
- **InpatientStay**: Data rawat inap pasien (pasien, kunjungan, poli, kamar, tanggal masuk/keluar, dll)
- **Kamar**: Data kamar rawat inap (kode, nama, kelas, kapasitas, terisi)
- **InpatientCare**: Catatan perawatan selama rawat inap (tindakan, obat, dll)

#### 3.3 Fungsionalitas
- Pendaftaran pasien rawat inap
- Pemindahan pasien ke kamar lain
- Pemulangan pasien
- Manajemen ketersediaan kamar
- Catatan perawatan selama rawat inap

#### 3.4 Komponen Backend
- **InpatientService.ts**: Servis untuk operasi rawat inap

### 4. Modul Laboratorium

#### 4.1 Deskripsi
Modul untuk mengelola pemeriksaan laboratorium, termasuk permintaan pemeriksaan, pencatatan hasil, dan pelaporan. Modul ini mendukung berbagai jenis pemeriksaan dan parameter uji.

#### 4.2 Entitas Database
- **LaboratoryTest**: Data permintaan pemeriksaan laboratorium
- **LaboratoryResult**: Hasil pemeriksaan untuk masing-masing parameter

#### 4.3 Fungsionalitas
- Pembuatan permintaan pemeriksaan
- Pencatatan hasil pemeriksaan
- Pembatalan pemeriksaan
- Manajemen parameter uji
- Laporan hasil pemeriksaan

#### 4.4 Komponen Backend
- **LaboratoryService.ts**: Servis untuk operasi laboratorium

### 5. Modul Radiologi

#### 5.1 Deskripsi
Modul untuk mengelola pemeriksaan radiologi, termasuk permintaan pemeriksaan, pencatatan hasil, dan manajemen gambar. Modul ini mendukung berbagai jenis pemeriksaan pencitraan.

#### 5.2 Entitas Database
- **RadiologyExam**: Data permintaan pemeriksaan radiologi
- **Gambar**: Referensi ke file gambar hasil pemeriksaan (akan ditambahkan)

#### 5.3 Fungsionalitas
- Pembuatan permintaan pemeriksaan
- Pencatatan hasil pemeriksaan
- Upload dan manajemen file gambar
- Pembatalan pemeriksaan
- Laporan hasil pemeriksaan

#### 5.4 Komponen Backend
- **RadiologyService.ts**: Servis untuk operasi radiologi

### 6. Modul Farmasi

#### 6.1 Deskripsi
Modul untuk mengelola persediaan obat, resep, dan distribusi obat kepada pasien. Modul ini mencakup manajemen stok dan pencatatan pemberian obat.

#### 6.2 Entitas Database
- **Item**: Data obat (kode, nama, jenis, satuan, harga, stok)
- **Prescription**: Resep obat untuk pasien tertentu

#### 6.3 Fungsionalitas
- Manajemen stok obat
- Pembuatan resep
- Pemantauan expired date
- Laporan penggunaan obat
- Penambahan obat ke inventory

#### 6.4 Komponen Backend
- **PharmacyService.ts**: Servis untuk operasi farmasi

### 7. Modul Keuangan

#### 7.1 Deskripsi
Modul untuk mengelola transaksi keuangan rumah sakit, termasuk pembayaran, refund, dan pelaporan keuangan. Modul ini mencakup manajemen pendapatan dan pengeluaran.

#### 7.2 Entitas Database
- **FinancialTransaction**: Data transaksi keuangan (pasien, jenis, metode pembayaran, jumlah, dll)

#### 7.3 Fungsionalitas
- Pencatatan transaksi keuangan
- Pembuatan laporan keuangan
- Pembatalan transaksi
- Ringkasan harian/bulanan
- Manajemen metode pembayaran

#### 7.4 Komponen Backend
- **FinancialService.ts**: Servis untuk operasi keuangan

### 8. Modul SDM (Sumber Daya Manusia)

#### 8.1 Deskripsi
Modul untuk mengelola data pegawai rumah sakit, termasuk presensi, cuti, dan informasi personal. Modul ini mendukung manajemen sumber daya manusia di rumah sakit.

#### 8.2 Entitas Database
- **Pegawai**: Data pegawai (NIP, nama, jabatan, departemen, dll)
- **Presensi**: Data kehadiran pegawai

#### 8.3 Fungsionalitas
- Manajemen data pegawai
- Pencatatan presensi masuk/keluar
- Laporan kehadiran
- Manajemen cuti dan absensi
- Rekapitulasi bulanan

#### 8.4 Komponen Backend
- **HRService.ts**: Servis untuk operasi SDM

### 9. Modul Rekam Medis

#### 9.1 Deskripsi
Modul untuk mengelola rekam medis pasien dengan format SOAP (Subjective, Objective, Assessment, Planning). Modul ini mencakup pencatatan diagnosis dan tindakan medis.

#### 9.2 Entitas Database
- **MedicalRecord**: Data rekam medis (subjektif, objektif, asesmen, planning, ICD-10/ICD-9, dll)

#### 9.3 Fungsionalitas
- Pembuatan rekam medis SOAP
- Pencarian kode ICD-10 dan ICD-9
- Riwayat rekam medis pasien
- Pembaruan rekam medis
- Laporan rekam medis

#### 9.4 Komponen Backend
- **MedicalRecordService.ts**: Servis untuk operasi rekam medis

### 10. Modul Sinkronisasi BPJS

#### 10.1 Deskripsi
Modul untuk mengotomatiskan sinkronisasi data kunjungan pasien ke sistem BPJS, termasuk pendaftaran, tindakan medis, dan klaim. Modul ini menyediakan mekanisme untuk mengirim data ke berbagai layanan BPJS.

#### 10.2 Entitas Database
- **BpjsSyncRecord**: Catatan sinkronisasi (kunjungan, jenis sinkronisasi, status, respons BPJS, dll)

#### 10.3 Fungsionalitas
- Sinkronisasi data registrasi ke BPJS
- Sinkronisasi data tindakan ke BPJS
- Pelacakan status sinkronisasi
- Penanganan error dan retry

#### 10.4 Komponen Backend
- **BpjsSyncService.ts**: Servis untuk operasi sinkronisasi
- **BpjsSyncController.ts**: Controller untuk endpoint sinkronisasi
- **BpjsSyncRoute.ts**: Definisi route untuk endpoint sinkronisasi

#### 10.5 Komponen Frontend
- Fungsi sinkronisasi di **VisitManager.tsx**

### 11. Modul Antrian Proses BPJS

#### 11.1 Deskripsi
Modul untuk mengelola antrian permintaan ke layanan BPJS, memungkinkan pemrosesan asynchronous dan retry otomatis jika gagal.

#### 11.2 Entitas Database
- **BpjsSyncQueue**: Antrian permintaan ke layanan BPJS

#### 11.3 Fungsionalitas
- Penambahan permintaan ke antrian
- Pemrosesan antrian secara asynchronous
- Mekanisme retry otomatis
- Penjadwalan pemrosesan

### 12. Modul Cache BPJS

#### 12.1 Deskripsi
Modul untuk menyimpan sementara hasil permintaan ke layanan BPJS, mengurangi beban permintaan dan meningkatkan kinerja.

#### 12.2 Entitas Database
- **BpjsCache**: Data cache hasil permintaan BPJS

#### 12.3 Fungsionalitas
- Penyimpanan hasil permintaan
- Pengambilan data dari cache
- Pembersihan cache kadaluarsa
- Manajemen TTL (Time To Live)

## Integrasi yang Didukung

### 1. Integrasi BPJS
- Antrean Online
- VClaim
- PCare
- iCare
- E-Claim (akan datang)
- Medical Record

### 2. Integrasi SATU SEHAT (akan datang)
- FHIR R4
- Patient, Encounter, Observation resources
- Bundle document

### 3. Integrasi IDRG (akan datang)
- INA-DRG classification
- Cost calculation
- Claim submission

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
- `/inpatient` - Manajemen rawat inap
- `/laboratory` - Manajemen laboratorium
- `/radiology` - Manajemen radiologi
- `/pharmacy` - Manajemen farmasi
- `/financial` - Manajemen keuangan
- `/hr` - Manajemen SDM
- `/medical-records` - Manajemen rekam medis

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
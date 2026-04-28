# Dokumentasi Sistem iDRG - SIMRS ZEN

## Gambaran Umum

Sistem iDRG (Indonesian Diagnosis Related Groups) adalah sistem klasifikasi kasus pasien berdasarkan diagnosis dan tindakan medis yang digunakan untuk menentukan pembayaran dalam sistem jaminan kesehatan nasional. Sistem ini menggantikan sistem INC CBG (Indonesia National Case Based Group) yang sebelumnya.

## Tujuan Implementasi

- Menggantikan sistem lama INC CBG dengan sistem iDRG yang lebih akurat
- Menyesuaikan dengan regulasi terbaru dari Kementerian Kesehatan RI
- Menyediakan sistem penagihan yang lebih adil dan transparan berdasarkan kompleksitas kasus
- Memfasilitasi klaim BPJS Kesehatan sesuai dengan standar nasional

## Arsitektur Sistem

### 1. Model Database

#### IDRGRule
- **id**: String (Primary Key)
- **code**: String (Unique) - Kode iDRG yang unik
- **description**: String - Deskripsi lengkap dari aturan iDRG
- **baseWeight**: Float - Bobot dasar untuk perhitungan biaya
- **adjustmentFactor**: Float? - Faktor penyesuaian tambahan
- **group**: String - Kelompok besar dari iDRG
- **subGroup**: String? - Subkelompok dari iDRG
- **isActive**: Boolean - Status aktif/non-aktif aturan
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **idrgPatientCases**: IDRGPatientCase[] - Relasi ke kasus pasien

#### IDRGPatientCase
- **id**: String (Primary Key)
- **patientId**: String - ID pasien
- **medicalRecordId**: String - ID rekam medis terkait
- **idrgRuleId**: String - ID aturan iDRG yang digunakan
- **admissionDate**: DateTime - Tanggal masuk pasien
- **dischargeDate**: DateTime - Tanggal keluar pasien
- **diagnosisCode**: String - Kode diagnosis utama
- **procedureCodes**: String[] - Kode-kode tindakan/prosedur
- **complications**: String? - Komplikasi (jika ada)
- **comorbidities**: String? - Penyakit penyerta (jika ada)
- **totalDays**: Int - Lama hari rawat
- **calculatedWeight**: Float - Bobot yang dihitung berdasarkan aturan
- **finalAmount**: Float - Jumlah akhir yang ditagihkan
- **status**: String - Status proses (DRAFT, CALCULATED, SUBMITTED, PAID)
- **notes**: String? - Catatan tambahan
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **patient**: Patient - Relasi ke pasien
- **medicalRecord**: MedicalRecord - Relasi ke rekam medis
- **idrgRule**: IDRGRule - Relasi ke aturan iDRG

### 2. Service Layer

#### IDRGLService
- **createIDRGRule**: Membuat aturan iDRG baru
- **getIDRGRules**: Mendapatkan semua aturan iDRG
- **getIDRGRuleById**: Mendapatkan aturan iDRG berdasarkan ID
- **updateIDRGRule**: Memperbarui aturan iDRG
- **deleteIDRGRule**: Menghapus aturan iDRG
- **createIDRGPatientCase**: Membuat kasus pasien iDRG baru
- **getIDRGPatientCases**: Mendapatkan semua kasus pasien iDRG
- **getIDRGPatientCaseById**: Mendapatkan kasus pasien iDRG berdasarkan ID
- **updateIDRGPatientCaseStatus**: Memperbarui status kasus pasien iDRG
- **recalculateIDRGCost**: Menghitung ulang biaya untuk kasus pasien iDRG

### 3. Controller Layer

#### IDRGLController
- Menyediakan endpoint API untuk semua fungsi pada service layer
- Menangani validasi input menggunakan Zod
- Memberikan respon dalam format JSON standar

### 4. Frontend Component

#### IDRGManagement
- Antarmuka pengguna untuk mengelola aturan iDRG dan kasus pasien
- Terdiri dari dua tab: Aturan iDRG dan Kasus Pasien
- Fitur pencarian dan filter
- Tampilan detail untuk setiap entitas
- Kemampuan untuk mengubah status kasus

## Fungsi Utama

### 1. Manajemen Aturan iDRG
- Membuat, membaca, memperbarui, dan menghapus aturan iDRG
- Mengelompokkan aturan berdasarkan jenis layanan medis
- Menentukan bobot dasar dan faktor penyesuaian untuk setiap aturan

### 2. Manajemen Kasus Pasien
- Membuat kasus pasien berdasarkan aturan iDRG
- Menghitung biaya otomatis berdasarkan bobot dan lama rawat
- Melacak status klaim dari draft hingga pembayaran
- Menyimpan informasi diagnosis dan tindakan medis

### 3. Perhitungan Biaya
- Perhitungan otomatis berdasarkan bobot iDRG dan tarif rumah sakit
- Faktor penyesuaian untuk kasus kompleks
- Integrasi dengan sistem billing SIMRS

## Proses Bisnis

1. Administrator menyiapkan aturan-aturan iDRG sesuai dengan pedoman Kemenkes
2. Saat pasien dirawat, petugas medis menentukan diagnosis utama dan tindakan
3. Sistem mencocokkan kasus dengan aturan iDRG yang sesuai
4. Bobot dan biaya dihitung otomatis berdasarkan aturan yang dipilih
5. Kasus dikirim ke tahap verifikasi dan pengajuan klaim
6. Setelah disetujui, klaim dikirim ke BPJS atau pihak penjamin lainnya

## Integrasi

- Terintegrasi dengan modul rekam medis untuk mendapatkan informasi diagnosis dan tindakan
- Terhubung dengan sistem billing untuk proses penagihan
- Dapat terhubung dengan sistem Satu Sehat untuk pelaporan
- Dapat diintegrasikan dengan sistem BPJS untuk pengajuan klaim otomatis

## Keamanan

- Akses terbatas hanya untuk pengguna dengan hak istimewa
- Log audit untuk semua perubahan penting
- Validasi input ketat untuk mencegah serangan injeksi

## Penyesuaian untuk Fasilitas Kesehatan

Sistem iDRG dapat disesuaikan dengan kebijakan masing-masing rumah sakit:
- Penyesuaian tarif per bobot
- Penambahan faktor penyesuaian lokal
- Kustomisasi alur kerja penagihan
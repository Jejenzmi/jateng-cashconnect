# Dokumentasi KYC dan DICOM - SIMRS ZEN

## Gambaran Umum

Modul KYC (Know Your Customer) dan DICOM (Digital Imaging and Communications in Medicine) adalah bagian penting dari integrasi dengan platform Satu Sehat. Modul ini memungkinkan fasilitas kesehatan untuk:

1. Mengelola dokumen verifikasi identitas (KYC) untuk kepatuhan regulasi
2. Mengkonfigurasi sistem DICOM untuk integrasi dengan modul radiologi

## Arsitektur

### 1. Model Database
- **KYCDocument**: Model untuk menyimpan informasi dokumen KYC dari fasilitas kesehatan
- **DICOMConfig**: Model untuk menyimpan konfigurasi sistem DICOM

### 2. Service Layer
- **KYCDicomService**: Menyediakan fungsi untuk mengelola dokumen KYC dan konfigurasi DICOM
- Validasi input menggunakan Zod

### 3. Controller Layer
- **KYCDicomController**: Menyediakan endpoint API untuk manajemen KYC dan DICOM

### 4. Frontend Component
- **KYCDICOMManager.tsx**: Antarmuka pengguna untuk mengelola dokumen KYC dan konfigurasi DICOM

## Fungsi Utama

### 1. Manajemen Dokumen KYC
- Upload dan manajemen dokumen verifikasi (SIUP, Izin Operasional, Sertifikat Kelayakan)
- Pelacakan status verifikasi (Terverifikasi, Menunggu, Ditolak)
- Pemberian catatan pada dokumen
- Batas waktu berlaku dokumen

### 2. Konfigurasi Sistem DICOM
- Pengaturan AE Title (Application Entity Title)
- Konfigurasi IP Address dan Port server DICOM
- Pemilihan protokol (DICOM, HL7, FHIR)
- Autentikasi (username/password)
- Toggle aktif/non-aktif integrasi

## Endpoint API

### Dokumen KYC
- `POST /api/kyc-dicom/kyc-document`: Membuat dokumen KYC baru
- `GET /api/kyc-dicom/kyc-documents/:faskesProfileId`: Mendapatkan semua dokumen KYC untuk suatu faskes
- `PUT /api/kyc-dicom/kyc-document/:documentId`: Memperbarui status dokumen KYC
- `DELETE /api/kyc-dicom/kyc-document/:documentId`: Menghapus dokumen KYC

### Konfigurasi DICOM
- `POST /api/kyc-dicom/dicom-config`: Membuat atau memperbarui konfigurasi DICOM
- `GET /api/kyc-dicom/dicom-config/:faskesProfileId`: Mendapatkan konfigurasi DICOM untuk suatu faskes
- `PUT /api/kyc-dicom/dicom-config/:configId`: Mengaktifkan/menonaktifkan konfigurasi DICOM
- `DELETE /api/kyc-dicom/dicom-config/:configId`: Menghapus konfigurasi DICOM

## Antarmuka Pengguna

Modul ini menyediakan antarmuka pengguna yang lengkap dengan:

- Tab untuk beralih antara manajemen KYC dan DICOM
- Form untuk upload dan manajemen dokumen KYC
- Status verifikasi dokumen dengan kemampuan untuk mengubah status
- Form konfigurasi DICOM dengan validasi
- Toggle untuk mengaktifkan/menonaktifkan integrasi DICOM
- Tampilan detail dokumen dan konfigurasi

## Integrasi dengan Satu Sehat

- Dokumen KYC digunakan untuk verifikasi identitas fasilitas kesehatan saat mendaftar ke platform Satu Sehat
- Konfigurasi DICOM digunakan untuk mengintegrasikan sistem radiologi dengan platform Satu Sehat
- Kedua fitur ini mendukung kepatuhan terhadap regulasi dan standar interoperabilitas nasional

## Keamanan

- Password DICOM disimpan dengan enkripsi
- Akses ke dokumen KYC dibatasi untuk pengguna terotorisasi
- Semua perubahan dicatat untuk audit trail
- Validasi input ketat untuk mencegah injeksi data berbahaya
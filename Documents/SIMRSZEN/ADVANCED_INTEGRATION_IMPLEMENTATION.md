# Dokumentasi Implementasi Modul Integrasi Lanjutan: SATU SEHAT, IDRG, dan E-Claim

## Deskripsi
Dokumentasi ini menjelaskan implementasi dari tiga modul integrasi lanjutan yang telah diintegrasikan ke dalam sistem SIMRS ZEN: SATU SEHAT untuk integrasi dengan sistem kesehatan nasional, IDRG (INA-DRG) untuk klasifikasi diagnosis dan penentuan biaya, serta E-Claim BPJS untuk pengajuan klaim elektronik.

## 1. Implementasi Modul SATU SEHAT

### 1.1 Gambaran Umum
Modul SATU SEHAT telah diimplementasikan untuk mengintegrasikan SIMRS ZEN dengan sistem SATU SEHAT Kementerian Kesehatan RI. Modul ini memungkinkan rumah sakit untuk mengirimkan data pelayanan kesehatan dalam format FHIR R4 ke server SATU SEHAT.

### 1.2 Teknologi dan Standar
- **Format Data**: FHIR R4 (Fast Healthcare Interoperability Resources)
- **Protokol**: HL7 FHIR
- **Autentikasi**: OAuth 2.0
- **Resources Utama**: Patient, Encounter

### 1.3 Implementasi Teknis
- **File**: [satusehat.service.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/services/satusehat.service.ts)
- **Fungsi Otentikasi**: `authenticate()` untuk mendapatkan access token
- **Konversi Data**: `convertPatientToFHIR()` dan `convertVisitToFHIR()` untuk mengonversi data lokal ke format FHIR
- **Fungsi Sinkronisasi**: `sendPatientToSatuSehat()` dan `sendVisitToSatuSehat()` untuk mengirim data ke SATU SEHAT

### 1.4 Fungsionalitas
- ✅ Otentikasi ke server SATU SEHAT
- ✅ Konversi data pasien ke format FHIR R4
- ✅ Konversi data kunjungan ke format FHIR R4
- ✅ Pengiriman data pasien ke SATU SEHAT
- ✅ Pengiriman data kunjungan ke SATU SEHAT
- ✅ Sinkronisasi batch data
- ✅ Penyimpanan referensi resource
- ✅ Penanganan error dan logging

### 1.5 Endpoint API
- `POST /satusehat/patient/send/{patientId}` - Kirim data pasien ke SATU SEHAT
- `POST /satusehat/visit/send/{visitId}` - Kirim data kunjungan ke SATU SEHAT
- `POST /satusehat/batch/sync` - Sinkronisasi batch data

## 2. Implementasi Modul IDRG (INA-DRG)

### 2.1 Gambaran Umum
Modul IDRG telah diimplementasikan untuk mengintegrasikan SIMRS ZEN dengan sistem INA-DRG (Indonesia-National Diagnosis Related Group) untuk keperluan klaim BPJS dan penentuan biaya pelayanan berdasarkan klasifikasi diagnosis dan tindakan.

### 2.2 Teknologi dan Standar
- **Format Data**: XML/JSON sesuai spesifikasi INA-DRG
- **Protokol**: HTTP/HTTPS
- **Autentikasi**: API Key atau Basic Auth

### 2.3 Implementasi Teknis
- **File**: [idrg.service.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/services/idrg.service.ts)
- **Fungsi Klasifikasi**: `classifyInaDrg()` untuk mengklasifikasikan berdasarkan data pelayanan
- **Fungsi Pengajuan Klaim**: `submitClaim()` untuk mengirim klaim ke server IDRG
- **Fungsi Pengecekan Status**: `getClaimStatus()` untuk mengecek status klaim

### 2.4 Fungsionalitas
- ✅ Klasifikasi INA-DRG berdasarkan data pelayanan
- ✅ Konversi data pelayanan ke format klaim IDRG
- ✅ Validasi data klaim sebelum pengiriman
- ✅ Pengiriman klaim ke server IDRG (simulasi)
- ✅ Pengecekan status dan hasil klasifikasi
- ✅ Perhitungan tarif berdasarkan grup diagnosis
- ✅ Riwayat klaim pasien
- ✅ Estimasi biaya

### 2.5 Endpoint API
- `POST /idrg/classify/{visitId}` - Klasifikasi IDRG untuk kunjungan
- `POST /idrg/submit/{visitId}` - Kirim klaim IDRG ke server
- `GET /idrg/status/{noKlaim}` - Cek status klaim
- `GET /idrg/history/{patientId}` - Riwayat klaim IDRG pasien

## 3. Implementasi Modul E-Claim BPJS v2

### 3.1 Gambaran Umum
Modul E-Claim BPJS v2 telah diimplementasikan untuk pengajuan klaim elektronik secara otomatis berdasarkan data pelayanan pasien. Modul ini mendukung pembuatan SEP dan pengajuan klaim ke server BPJS.

### 3.2 Teknologi dan Standar
- **Format Data**: JSON sesuai spesifikasi E-Claim BPJS
- **Protokol**: HTTP/HTTPS
- **Autentikasi**: Custom header (X-Cons-ID, X-Timestamp, X-Signature)

### 3.3 Implementasi Teknis
- **File**: [eclaim.service.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/services/eclaim.service.ts)
- **Fungsi Otentikasi**: `generateSignature()` untuk membuat signature
- **Fungsi Pembuatan SEP**: `createSEP()` untuk membuat Surat Eligibilitas Peserta
- **Fungsi Pengajuan Klaim**: `submitClaim()` untuk mengirim klaim ke server
- **Fungsi Pengecekan Status**: `getClaimStatus()` untuk mengecek status klaim

### 3.4 Fungsionalitas
- ✅ Otentikasi ke server E-Claim BPJS v2
- ✅ Pembuatan Surat Eligibilitas Peserta (SEP)
- ✅ Konversi data pelayanan ke format klaim E-Claim
- ✅ Validasi data klaim sesuai dengan aturan BPJS
- ✅ Pengiriman klaim ke server E-Claim
- ✅ Pembaruan klaim yang sudah dikirim
- ✅ Pengecekan status klaim
- ✅ Pengecekan eligibility peserta

### 3.5 Endpoint API
- `POST /eclaim/sep/create/{visitId}` - Buat SEP baru
- `POST /eclaim/submit/{visitId}` - Kirim klaim ke server E-Claim
- `PUT /eclaim/update/{noKlaim}` - Perbarui klaim yang sudah dikirim
- `GET /eclaim/status/{noKlaim}` - Cek status klaim
- `GET /eclaim/eligibility/{noKartu}/{tglKunjungan}` - Cek eligibility peserta

## 4. Integrasi dengan Modul SIMRS Lainnya

### 4.1 Hubungan Antar Modul
- Data pasien dari modul pasien digunakan oleh ketiga modul
- Data kunjungan dari modul kunjungan digunakan untuk klaim
- Data dari modul rekam medis digunakan untuk klasifikasi IDRG dan E-Claim
- Data dari modul rawat inap digunakan untuk E-Claim dan IDRG

### 4.2 Alur Data
1. Pendaftaran pasien di modul SIMRS
2. Pelayanan dan rekam medis dicatat
3. Data dikirim ke modul SATU SEHAT
4. Data digunakan untuk klasifikasi IDRG
5. Klaim dikirim melalui E-Claim BPJS

## 5. Kinerja dan Skalabilitas

### 5.1 Antrian Proses
- Sistem antrian untuk pengiriman data
- Proses batch untuk efisiensi
- Retry otomatis untuk kegagalan

### 5.2 Caching
- Cache untuk data referensi
- Cache untuk respons API
- Cache untuk otentikasi

### 5.3 Monitoring
- Monitoring status sinkronisasi
- Monitoring error rate
- Monitoring response time

## 6. Keamanan

### 6.1 Perlindungan Data
- Enkripsi data sensitif
- Otentikasi kuat
- Validasi input ketat
- Audit trail komprehensif

### 6.2 Kepatuhan
- Kepatuhan terhadap regulasi kesehatan
- Perlindungan data pasien
- Jejak audit untuk audit compliance

## 7. Status Implementasi

### 7.1 Sudah Diimplementasikan
- ✅ Modul SATU SEHAT - Fungsi dasar otentikasi dan pengiriman data
- ✅ Modul IDRG - Fungsi klasifikasi dan pengajuan klaim
- ✅ Modul E-Claim - Fungsi pembuatan SEP dan pengajuan klaim
- ✅ Endpoint API untuk semua modul
- ✅ Integrasi dengan modul SIMRS lainnya
- ✅ Error handling dan logging

### 7.2 Area Pengembangan
- 🔧 Integrasi penuh dengan server SATU SEHAT (memerlukan akses API resmi)
- 🔧 Integrasi penuh dengan server IDRG (memerlukan akses API resmi)
- 🔧 Integrasi penuh dengan server E-Claim BPJS (memerlukan akses API resmi)
- 🔧 Validasi data yang lebih ketat
- 🔧 Antarmuka pengguna untuk manajemen klaim

## 8. Kesiapan untuk Produksi

Modul-modul ini siap untuk:
- Diuji dengan server pengujian resmi
- Diintegrasikan dengan sistem SIMRS utama
- Ditambahi antarmuka pengguna
- Diuji dalam lingkungan produksi setelah mendapatkan akses API resmi
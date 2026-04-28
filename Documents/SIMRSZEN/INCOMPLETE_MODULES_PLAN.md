# Rencana Implementasi Modul-Modul Belum Selesai

## Daftar Modul Belum Lengkap

### 1. SATU SEHAT Integration
**Status:** Belum Dikerjakan
**Prioritas:** Tinggi

#### Deskripsi
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem SATU SEHAT Kementerian Kesehatan RI. Modul ini akan memungkinkan rumah sakit untuk mengirimkan data pelayanan kesehatan dalam format FHIR R4 ke server SATU SEHAT.

#### Komponen yang Dibutuhkan
- [ ] Fungsi otentikasi ke server SATU SEHAT (OAuth 2.0)
- [ ] Fungsi konversi data pasien ke format FHIR R4 (Patient resource)
- [ ] Fungsi konversi data pelayanan ke format FHIR R4 (Encounter resource)
- [ ] Fungsi konversi data observasi ke format FHIR R4 (Observation resource)
- [ ] Fungsi konversi data kondisi medis ke format FHIR R4 (Condition resource)
- [ ] Fungsi konversi data prosedur ke format FHIR R4 (Procedure resource)
- [ ] Fungsi konversi data imunisasi ke format FHIR R4 (Immunization resource)
- [ ] Fungsi sinkronisasi data ke server SATU SEHAT
- [ ] Fungsi penjadwalan sinkronisasi data
- [ ] Fungsi penanganan error dan retry
- [ ] Fungsi validasi data sebelum pengiriman
- [ ] UI untuk konfigurasi SATU SEHAT
- [ ] UI untuk monitoring status pengiriman
- [ ] UI untuk log aktivitas SATU SEHAT
- [ ] Service untuk manajemen organisasi di SATU SEHAT
- [ ] Service untuk manajemen profesional kesehatan (Practitioner)

#### Teknologi yang Digunakan
- Format data: FHIR R4
- Protokol: HL7 FHIR
- Autentikasi: OAuth 2.0
- Resources: Patient, Encounter, Observation, Condition, Procedure, Immunization, Organization, Practitioner

---

### 2. IDRG (INA-DRG) Integration
**Status:** Belum Dikerjakan
**Prioritas:** Sedang

#### Deskripsi
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem INA-DRG (Indonesia-National Diagnosis Related Group) untuk keperluan klaim BPJS dan penentuan biaya pelayanan berdasarkan klasifikasi diagnosis dan tindakan.

#### Komponen yang Dibutuhkan
- [ ] Fungsi klasifikasi INA-DRG berdasarkan diagnosis dan tindakan
- [ ] Fungsi konversi data pelayanan ke format klaim INA-DRG
- [ ] Fungsi validasi data klaim sebelum pengiriman
- [ ] Fungsi pengiriman klaim ke server INA-DRG
- [ ] Fungsi pengecekan status dan hasil klasifikasi
- [ ] Fungsi perhitungan tarif berdasarkan grup diagnosis
- [ ] Fungsi mapping kode ICD-10/ICD-9 ke kode INA-DRG
- [ ] UI untuk konfigurasi IDRG
- [ ] UI untuk pengajuan klaim
- [ ] UI untuk monitoring status klaim
- [ ] UI untuk hasil klasifikasi dan biaya
- [ ] Service untuk manajemen kode INA-DRG
- [ ] Service untuk perhitungan biaya

#### Teknologi yang Digunakan
- Format data: XML/JSON sesuai spesifikasi INA-DRG
- Protokol: HTTP/HTTPS
- Autentikasi: API Key atau Basic Auth

---

### 3. E-Claim BPJS v2 Integration
**Status:** Belum Dikerjakan
**Prioritas:** Tinggi

#### Deskripsi
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem E-Claim BPJS versi 2 untuk pengajuan klaim elektronik secara otomatis berdasarkan data pelayanan pasien.

#### Komponen yang Dibutuhkan
- [ ] Fungsi otentikasi ke server E-Claim BPJS v2
- [ ] Fungsi konversi data pelayanan ke format klaim E-Claim
- [ ] Fungsi validasi data klaim sesuai dengan aturan BPJS
- [ ] Fungsi pengiriman klaim ke server E-Claim
- [ ] Fungsi pengecekan status klaim
- [ ] Fungsi penanganan revisi klaim
- [ ] Fungsi sinkronisasi status klaim
- [ ] Fungsi manajemen SEP (Surat Eligibilitas Peserta)
- [ ] Fungsi manajemen DPJP (Dokter Penanggung Jawab Pasien)
- [ ] UI untuk konfigurasi E-Claim
- [ ] UI untuk pengajuan klaim
- [ ] UI untuk monitoring status klaim
- [ ] UI untuk log aktivitas E-Claim
- [ ] Service untuk manajemen master data BPJS
- [ ] Service untuk manajemen referensi BPJS

#### Teknologi yang Digunakan
- Format data: XML/JSON sesuai spesifikasi E-Claim BPJS
- Protokol: HTTP/HTTPS
- Autentikasi: Custom header (X-Cons-ID, X-Timestamp, X-Signature)

---

### 4. Modul Bed Management
**Status:** Sebagian Dikerjakan
**Prioritas:** Sedang

#### Deskripsi
Modul untuk mengelola ketersediaan tempat tidur di ruang rawat inap, termasuk booking, alokasi, dan pemantauan status kamar.

#### Komponen yang Dibutuhkan
- [ ] Fungsi manajemen ketersediaan kamar
- [ ] Fungsi booking kamar untuk pasien
- [ ] Fungsi notifikasi ketersediaan kamar
- [ ] Fungsi pemantauan status real-time
- [ ] Fungsi laporan ketersediaan kamar
- [ ] UI untuk dashboard ketersediaan kamar
- [ ] UI untuk booking kamar
- [ ] UI untuk manajemen kamar

---

### 5. Modul Rujukan
**Status:** Belum Dikerjakan
**Prioritas:** Sedang

#### Deskripsi
Modul untuk mengelola rujukan internal antar departemen dan rujukan eksternal ke rumah sakit lain.

#### Komponen yang Dibutuhkan
- [ ] Fungsi pembuatan surat rujukan
- [ ] Fungsi manajemen rujukan internal
- [ ] Fungsi manajemen rujukan eksternal
- [ ] Fungsi sinkronisasi ke sistem rujukan nasional
- [ ] Fungsi pelacakan status rujukan
- [ ] UI untuk pembuatan rujukan
- [ ] UI untuk monitoring rujukan
- [ ] UI untuk pelaporan rujukan

---

### 6. Modul Antrian & Jadwal Dokter
**Status:** Sebagian Dikerjakan
**Prioritas:** Sedang

#### Deskripsi
Modul untuk mengelola antrian pasien di poliklinik dan jadwal dokter.

#### Komponen yang Dibutuhkan
- [ ] Fungsi manajemen jadwal dokter
- [ ] Fungsi pendaftaran antrian online
- [ ] Fungsi pemanggilan antrian digital
- [ ] Fungsi pembagian kuota per dokter
- [ ] Fungsi notifikasi antrian
- [ ] UI untuk manajemen jadwal dokter
- [ ] UI untuk pendaftaran antrian
- [ ] UI untuk display antrian
- [ ] API untuk sistem antrian pintar

---

### 7. Modul Penunjang Medis
**Status:** Belum Dikerjakan
**Prioritas:** Rendah

#### Deskripsi
Modul untuk mengelola layanan penunjang medis seperti IGD, ICU, NICU, PICU, dan transfusi darah.

#### Komponen yang Dibutuhkan
- [ ] Modul Instalasi Gawat Darurat (IGD)
- [ ] Modul ICU/ICCU/NICU/PICU
- [ ] Modul Bank Darah dan Transfusi
- [ ] Modul Nutrisi Klinis
- [ ] Modul Rehabilitasi Medis
- [ ] UI untuk manajemen IGD
- [ ] UI untuk manajemen ICU
- [ ] UI untuk manajemen bank darah

---

### 8. Modul PACS (Picture Archiving and Communication System)
**Status:** Belum Dikerjakan
**Prioritas:** Rendah

#### Deskripsi
Modul untuk mengelola arsip dan komunikasi gambar medis dari perangkat pencitraan.

#### Komponen yang Dibutuhkan
- [ ] Fungsi manajemen file gambar DICOM
- [ ] Fungsi penyimpanan terdistribusi
- [ ] Fungsi akses cepat ke gambar
- [ ] Fungsi viewer gambar medis
- [ ] Fungsi integrasi dengan perangkat pencitraan
- [ ] UI untuk manajemen arsip gambar
- [ ] UI untuk viewer gambar

---

## Timeline Implementasi

### Fase 1 (Bulan 1-2): E-Claim BPJS v2
- [ ] Desain arsitektur modul
- [ ] Implementasi servis E-Claim
- [ ] Implementasi UI E-Claim
- [ ] Testing dan debugging

### Fase 2 (Bulan 2-3): SATU SEHAT
- [ ] Desain arsitektur modul
- [ ] Implementasi servis SATU SEHAT
- [ ] Implementasi UI SATU SEHAT
- [ ] Testing dan debugging

### Fase 3 (Bulan 3-4): IDRG
- [ ] Desain arsitektur modul
- [ ] Implementasi servis IDRG
- [ ] Implementasi UI IDRG
- [ ] Testing dan debugging

### Fase 4 (Bulan 4-5): Modul Pendukung
- [ ] Implementasi Bed Management
- [ ] Implementasi Rujukan
- [ ] Implementasi Antrian & Jadwal Dokter
- [ ] Uji coba integrasi

## Kriteria Keberhasilan

- [ ] Semua modul berfungsi sesuai spesifikasi
- [ ] Kode telah diuji dengan unit test minimal 80% coverage
- [ ] UI/UX konsisten dengan desain sistem
- [ ] Performa sistem tetap optimal setelah penambahan modul
- [ ] Keamanan data tetap terjaga
- [ ] Dokumentasi lengkap tersedia
- [ ] Panduan penggunaan dan troubleshooting tersedia
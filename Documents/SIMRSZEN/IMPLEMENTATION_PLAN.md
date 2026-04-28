# Rencana Implementasi Modul-Modul Belum Selesai

## Daftar Modul Belum Lengkap

### 1. SATU SEHAT Integration
**Status:** Belum Dikerjakan
**Prioritas:** Tinggi

#### Deskripsi
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem SATU SEHAT Kementerian Kesehatan RI. Modul ini akan memungkinkan rumah sakit untuk mengirimkan data pelayanan kesehatan dalam format FHIR R4 ke server SATU SEHAT.

#### Komponen yang Dibutuhkan
- [ ] Fungsi otentikasi ke server SATU SEHAT
- [ ] Fungsi konversi data pasien ke format FHIR R4
- [ ] Fungsi konversi data pelayanan ke format FHIR R4
- [ ] Fungsi konversi data tenaga kesehatan ke format FHIR R4
- [ ] Fungsi konversi data kunjungan rawat jalan/ranap ke format FHIR R4
- [ ] Fungsi sinkronisasi data ke server SATU SEHAT
- [ ] Fungsi penjadwalan sinkronisasi data
- [ ] Fungsi penanganan error dan retry
- [ ] Fungsi validasi data sebelum pengiriman
- [ ] UI untuk konfigurasi SATU SEHAT
- [ ] UI untuk monitoring status pengiriman
- [ ] UI untuk log aktivitas SATU SEHAT

#### Teknologi yang Digunakan
- Format data: FHIR R4
- Protokol: HL7 FHIR
- Autentikasi: OAuth 2.0

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
- [ ] UI untuk konfigurasi IDRG
- [ ] UI untuk pengajuan klaim
- [ ] UI untuk monitoring status klaim
- [ ] UI untuk hasil klasifikasi dan biaya

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
- [ ] UI untuk konfigurasi E-Claim
- [ ] UI untuk pengajuan klaim
- [ ] UI untuk monitoring status klaim
- [ ] UI untuk log aktivitas E-Claim

#### Teknologi yang Digunakan
- Format data: XML/JSON sesuai spesifikasi E-Claim BPJS
- Protokol: HTTP/HTTPS
- Autentikasi: Custom header (X-Cons-ID, X-Timestamp, X-Signature)

---

### 4. Unit Testing
**Status:** Belum Dikerjakan
**Prioritas:** Sedang

#### Deskripsi
Menyusun unit test untuk semua modul yang telah dibuat untuk memastikan kualitas dan keandalan kode.

#### Komponen yang Dibutuhkan
- [ ] Unit test untuk servis BPJS Config
- [ ] Unit test untuk servis BPJS Log
- [ ] Unit test untuk servis BPJS Cache
- [ ] Unit test untuk servis BPJS Queue
- [ ] Unit test untuk modul Antrean
- [ ] Unit test untuk modul PCare
- [ ] Unit test untuk modul iCare
- [ ] Unit test untuk modul Medical Record
- [ ] Integration test untuk endpoint-endpoint API
- [ ] End-to-end test untuk alur bisnis

---

### 5. Job Scheduler untuk Maintenance
**Status:** Belum Dikerjakan
**Prioritas:** Rendah

#### Deskripsi
Menyusun sistem penjadwalan untuk tugas-tugas pemeliharaan otomatis seperti membersihkan cache kadaluarsa dan membersihkan log lama.

#### Komponen yang Dibutuhkan
- [ ] Fungsi penjadwalan harian untuk membersihkan cache kadaluarsa
- [ ] Fungsi penjadwalan mingguan untuk membersihkan log lama
- [ ] Fungsi penjadwalan harian untuk backup data penting
- [ ] UI untuk konfigurasi penjadwalan
- [ ] UI untuk monitoring tugas terjadwal

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

### Fase 4 (Bulan 4-5): Testing dan Quality Assurance
- [ ] Implementasi unit testing
- [ ] Integrasi modul-modul yang ada
- [ ] Uji coba komprehensif
- [ ] Dokumentasi final

## Kriteria Keberhasilan

- [ ] Semua modul berfungsi sesuai spesifikasi
- [ ] Kode telah diuji dengan unit test minimal 80% coverage
- [ ] UI/UX konsisten dengan desain sistem
- [ ] Performa sistem tetap optimal setelah penambahan modul
- [ ] Keamanan data tetap terjaga
- [ ] Dokumentasi lengkap tersedia
- [ ] Panduan penggunaan dan troubleshooting tersedia
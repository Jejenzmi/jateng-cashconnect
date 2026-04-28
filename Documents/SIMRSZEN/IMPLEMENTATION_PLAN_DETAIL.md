# Rencana Implementasi Sistem SIMRS Zen

Dokumen ini menjelaskan rencana implementasi yang komprehensif untuk sistem SIMRS (Sistem Informasi Manajemen Rumah Sakit) Zen agar siap digunakan dalam lingkungan produksi.

## 1. Penyelesaian Modul Inti

### 1.1 Modul Utama yang Harus Diselesaikan
- Modul Pendaftaran Pasien
- Modul Rekam Medis Elektronik
- Modul Administrasi dan Keuangan
- Modul Farmasi
- Modul Laboratorium
- Modul Radiologi
- Modul Rawat Jalan
- Modul Rawat Inap
- Modul Instalasi Gawat Darurat
- Modul Penunjang Medis (Fisioterapi, Gizi, dll.)

### 1.2 Proses Standar Pengembangan Modul
- Desain arsitektur modul sesuai prinsip SOLID
- Implementasi menggunakan TypeScript dan Prisma ORM
- Pembuatan endpoint API sesuai spesifikasi RESTful
- Validasi input dan sanitasi data
- Implementasi logging dan audit trail
- Penambahan dokumentasi API (OpenAPI/Swagger)

## 2. Pengujian Komprehensif

### 2.1 Pengujian Unit
- Membuat unit test untuk semua fungsi penting
- Target coverage minimum 80%
- Gunakan Jest sebagai framework testing
- Lakukan mocking untuk dependensi eksternal

### 2.2 Pengujian Integrasi
- Uji integrasi antar modul
- Uji koneksi database
- Uji integrasi layanan eksternal (BPJS, SATUSEHAT)
- Validasi skema data dan transfer

### 2.3 Pengujian End-to-End
- Buat skenario penggunaan nyata
- Gunakan Cypress atau Puppeteer untuk testing UI
- Uji alur kerja utama rumah sakit
- Validasi keakuratan data dan laporan

## 3. Audit Keamanan dan Penetration Testing

### 3.1 Audit Internal
- Verifikasi implementasi autentikasi dan otorisasi
- Cek kekuatan enkripsi data
- Audit log akses dan aktivitas
- Validasi kepatuhan terhadap regulasi perlindungan data

### 3.2 Penetration Testing
- Uji penetrasi terhadap endpoint publik
- Identifikasi kerentanan OWASP Top 10
- Lakukan simulasi serangan SQL Injection, XSS, CSRF
- Evaluasi kebijakan keamanan CORS dan headers

## 4. Optimasi Performa

### 4.1 Database Optimization
- Tambahkan indeks pada kolom-kolom yang sering di-query
- Optimalkan struktur tabel dan relasi
- Gunakan query builder untuk menghindari N+1 queries
- Terapkan partitioning pada tabel besar

### 4.2 Aplikasi dan Server
- Implementasi caching dengan Redis
- Optimalkan bundle frontend
- Gunakan CDN untuk asset delivery
- Terapkan load balancing untuk traffic tinggi

## 5. Integrasi Eksternal

### 5.1 Integrasi Wajib
- BPJS Kesehatan (Antrean, PCare, Inacbg)
- SATUSEHAT (upload data ke sistem Kemenkes)
- ICD-10 dan ICD-9-CM untuk diagnosis
- SIKC (Surat Izin Kepala Cara Kerja)

### 5.2 Strategi Integrasi
- Gunakan microservice untuk layanan eksternal
- Implementasi retry mechanism untuk kegagalan sementara
- Tambahkan circuit breaker untuk isolasi kegagalan
- Simpan cache lokal untuk layanan yang lambat

## 6. Konfigurasi Produksi dan Strategi Backup

### 6.1 Konfigurasi Infrastruktur
- Gunakan Docker dan Docker Compose untuk containerization
- Terapkan CI/CD pipeline dengan GitHub Actions
- Gunakan reverse proxy (nginx) untuk routing dan SSL termination
- Konfigurasi monitoring dan alerting

### 6.2 Backup dan Recovery
- Backup harian otomatis ke storage eksternal
- Backup sinkron ke lokasi geografis berbeda
- Uji recovery prosedur secara berkala
- Enkripsi data backup

## 7. Validasi Klinis dan Regulator

### 7.1 Validasi Klinis
- Libatkan tim medis dalam review alur kerja
- Uji coba modul dengan data dummy
- Validasi keakuratan laporan medis
- Pastikan kepatuhan terhadap protokol medis

### 7.2 Kepatuhan Regulator
- Sesuaikan dengan standar ISO 27001
- Ikuti pedoman Kemenkes RI
- Pastikan kepatuhan terhadap UU Perlindungan Data Pribadi
- Dapatkan sertifikasi dari lembaga terkait

## 8. Dokumentasi dan Pelatihan

### 8.1 Dokumentasi Teknis
- Dokumentasi API
- Panduan arsitektur sistem
- Prosedur deployment
- Panduan troubleshooting

### 8.2 Panduan Pengguna
- Manual book untuk tiap role user
- Video tutorial
- FAQ dan solusi masalah umum
- Materi pelatihan

## 9. Timeline Implementasi

### Tahap 1 (1-2 bulan): Stabilisasi Core
- Penyelesaian modul dasar (pasien, registrasi, rekam medis)
- Implementasi autentikasi dan otorisasi
- Setup CI/CD pipeline
- Unit dan integrasi testing

### Tahap 2 (2-3 bulan): Ekspansi Modul
- Penyelesaian modul lanjutan (farmasi, lab, radiologi)
- Integrasi eksternal (BPJS, SATUSEHAT)
- Performance optimization
- Security audit

### Tahap 3 (1 bulan): Validasi dan Uji Coba
- Uji coba internal
- Validasi klinis
- Penyesuaian berdasarkan feedback
- Dokumentasi lengkap

### Tahap 4 (1 bulan): Deployment dan Support
- Deploy ke staging environment
- UAT (User Acceptance Testing)
- Deployment ke production
- Training dan support awal

## 10. Tim dan Sumber Daya

### 10.1 Tim Pengembangan
- Backend Developer (3 orang)
- Frontend Developer (2 orang)
- DevOps Engineer (1 orang)
- QA Tester (2 orang)
- System Architect (1 orang)
- Technical Writer (1 orang)

### 10.2 Infrastruktur
- Server production (minimum spec: 16GB RAM, 8 core CPU)
- Database server dedicated
- Load balancer (jika traffic tinggi)
- Storage untuk backup dan log

## Penutup

Dengan mengikuti rencana implementasi ini secara sistematis, sistem SIMRS Zen akan menjadi solusi yang handal, aman, dan efisien untuk mendukung operasional rumah sakit. Keberhasilan implementasi memerlukan koordinasi yang baik antara tim teknis dan tim klinis serta komitmen organisasi terhadap transformasi digital.

## API Endpoints Implementation Status

### ✅ Sudah Diterapkan ke OpenAPI Document
- `/api/auth/login` - POST (Authentication)
- `/api/auth/logout` - POST (Authentication)
- `/api/auth/refresh-token` - POST (Authentication)
- `/api/auth/profile` - GET, PUT (Authentication)
- `/api/users` - GET, POST (User Management)
- `/api/users/{id}` - GET, PUT, DELETE (User Management)
- `/api/patients` - GET, POST (Patient Management)
- `/api/patients/{id}` - GET, PUT, DELETE (Patient Management)
- `/api/visits` - GET, POST (Visit Management)
- `/api/visits/{id}` - GET, PUT, DELETE (Visit Management)
- `/api/visits/{id}/check-in` - PATCH (Visit Management)
- `/api/visits/{id}/check-out` - PATCH (Visit Management)
- `/api/rooms` - GET, POST (Room Management)
- `/api/rooms/{id}` - GET, PUT, DELETE (Room Management)
- `/api/rooms/{id}/availability` - GET (Room Management)
- `/api/beds` - GET, POST (Bed Management)
- `/api/beds/{id}` - GET, PUT, DELETE (Bed Management)
- `/api/beds/{id}/status` - PATCH (Bed Management)
- `/api/bills` - GET, POST (Billing Management)
- `/api/bills/{id}` - GET, PUT, DELETE (Billing Management)
- `/api/bills/{id}/payment-status` - PATCH (Billing Management)
- `/api/bill-items` - GET, POST (Billing Item Management)
- `/api/bill-items/{id}` - GET, PUT, DELETE (Billing Item Management)
- `/api/appointments` - GET, POST (Appointment Management)
- `/api/appointments/{id}` - GET, PUT, DELETE (Appointment Management)
- `/api/appointments/{id}/status` - PATCH (Appointment Management)
- `/api/doctors` - GET, POST (Doctor Management)
- `/api/doctors/{id}` - GET, PUT, DELETE (Doctor Management)
- `/api/medical-records` - GET, POST (Medical Record Management)
- `/api/medical-records/{id}` - GET, PUT, DELETE (Medical Record Management)
- `/api/icd-codes` - GET (ICD Code Reference)
- `/api/icd-codes/{id}` - GET (ICD Code Reference)
- `/api/departments` - GET, POST (Department Management)
- `/api/departments/{id}` - GET, PUT, DELETE (Department Management)
- `/api/pharmacy/products` - GET, POST (Pharmacy Management)
- `/api/pharmacy/products/{id}` - GET, PUT, DELETE (Pharmacy Management)
- `/api/lab-tests` - GET, POST (Laboratory Management)
- `/api/lab-tests/{id}` - GET, PUT, DELETE (Laboratory Management)
- `/api/lab-tests/{id}/results` - PATCH (Laboratory Management)
- `/api/inventory/items` - GET, POST (Inventory Management)
- `/api/inventory/items/{id}` - GET, PUT, DELETE (Inventory Management)
- `/api/supplier` - GET, POST (Inventory Management)
- `/api/supplier/{id}` - GET, PUT, DELETE (Inventory Management)
- `/api/reports/financial` - GET (Financial Reporting)
- `/api/reports/medical-statistics` - GET (Medical Statistics Reporting)
- `/api/reports/bed-occupancy` - GET (Bed Occupancy Reporting)
- `/api/employees` - GET, POST (Employee Management)
- `/api/employees/{id}` - GET, PUT, DELETE (Employee Management)
- `/api/employees/{id}/schedule` - GET, PUT (Employee Management)
- `/api/payroll` - GET, POST (Payroll Management)
- `/api/payroll/{id}` - GET, PUT, DELETE (Payroll Management)
- `/api/schedules` - GET, POST (Schedule Management)
- `/api/schedules/{id}` - GET, PUT, DELETE (Schedule Management)
- `/api/time-offs` - GET, POST (Schedule Management)
- `/api/time-offs/{id}` - GET, PUT, DELETE (Schedule Management)
- `/api/roles` - GET, POST (Role Management)
- `/api/roles/{id}` - GET, PUT, DELETE (Role Management)
- `/api/modules` - GET, POST (Module Management)
- `/api/modules/{id}` - GET, PUT, DELETE (Module Management)
- `/api/module-permissions` - GET, POST (Module Management)
- `/api/module-permissions/{id}` - GET, PUT, DELETE (Module Management)
- `/api/esign/templates` - GET, POST (E-signature Templates)
- `/api/esign/templates/{id}` - GET, PUT, DELETE (E-signature Templates)
- `/api/esign/sign` - POST (E-signature Process)
- `/api/queue/registration` - GET, POST (Queue Management)
- `/api/queue/laboratory` - GET, POST (Queue Management)
- `/api/queue/pharmacy` - GET, POST (Queue Management)
- `/api/queue/{id}` - GET, PATCH (Queue Management)
- `/api/bpjs/vclaim/peserta/{noKartu}` - GET (BPJS Integration)
- `/api/bpjs/vclaim/peserta/nik/{nik}` - GET (BPJS Integration)
- `/api/bpjs/vclaim/sep` - POST (BPJS Integration)
- `/api/bpjs/vclaim/sep/{noSEP}` - GET (BPJS Integration)
- `/api/bpjs/vclaim/inacbg/sep/{noSep}` - GET (BPJS Integration)
- `/api/bpjs/antrean/poliklinik` - GET (BPJS Antrean Integration)
- `/api/bpjs/antrean/dokter` - GET (BPJS Antrean Integration)
- `/api/bpjs/antrean/jadwal` - GET (BPJS Antrean Integration)
- `/api/bpjs/antrean/batal` - POST (BPJS Antrean Integration)
- `/api/bpjs/antrean/confirm` - POST (BPJS Antrean Integration)
- `/api/bpjs/logs` - GET (BPJS Logs)
- `/api/bpjs/logs/error` - GET (BPJS Error Logs)
- `/api/bpjs/configs` - GET, POST (BPJS Configs)
- `/api/bpjs/configs/{name}` - GET, PUT, DELETE (BPJS Configs)
- `/api/bpjs/configs/{name}/toggle` - PATCH (BPJS Configs)
- `/api/bpjs/cache` - GET (BPJS Cache)
- `/api/bpjs/cache/{cacheKey}` - GET, DELETE (BPJS Cache)
- `/api/bpjs/cache/all` - DELETE (BPJS Cache Clear)
- `/api/bpjs/sync/visit/{visitId}` - POST (BPJS Sync)
- `/api/bpjs/sync/registration/{visitId}` - POST (BPJS Sync)
- `/api/bpjs/sync/treatment/{visitId}` - POST (BPJS Sync)
- `/api/bpjs/sync/history/{visitId}` - GET (BPJS Sync History)
- `/api/bpjs/queue` - GET (BPJS Queue)
- `/api/bpjs/queue/{id}` - GET (BPJS Queue Detail)
- `/api/bpjs/queue/{id}/retry` - POST (BPJS Retry Job)
- `/api/bpjs/queue/{id}/remove` - DELETE (BPJS Remove Job)
- `/api/bpjs/queue/cleanup` - DELETE (BPJS Cleanup Jobs)
- `/api/bpjs/queue/cleanup/failed` - DELETE (BPJS Cleanup Failed Jobs)
- `/api/bpjs/vclaim2/sep/1.1/insert` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/1.1/update` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/1.1/delete` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/{noSEP}` - GET (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/lastsep/norujukan/{noRujukan}` - GET (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/2.0/insert` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/2.0/update` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/2.0/delete` - POST (BPJS VClaim 2.0)
- `/api/bpjs/vclaim2/sep/updtglplg` - POST (BPJS Update Tanggal Pulang)
- `/api/bpjs/vclaim2/sep/pengajuan` - POST (BPJS Pengajuan SEP)
- `/api/bpjs/vclaim2/sep/approve` - POST (BPJS Approve SEP)
- `/api/bpjs/vclaim2/sep/cbg/{noSep}` - GET (BPJS Inacbg)
- `/api/bpjs/vclaim2/sep/internal/{noSep}` - GET (BPJS Internal SEP)
- `/api/bpjs/vclaim2/sep/internal/delete` - POST (BPJS Delete Internal SEP)
- `/api/bpjs/vclaim2/sep/persetujuanSEP/list/bulan/{bulan}/tahun/{tahun}` - GET (BPJS Persetujuan SEP)
- `/api/bpjs/vclaim2/sep/updtglplg/list/bulan/{bulan}/tahun/{tahun}/{filter}` - GET (BPJS Update Tanggal Pulang List)
- `/api/bpjs/vclaim2/sep/2.0/updtglplg` - POST (BPJS Update Tanggal Pulang 2.0)
- `/api/bpjs/vclaim2/sep/fingerprint/peserta/{noKartu}/tglPelayanan/{tglPelayanan}` - GET (BPJS Fingerprint Status)
- `/api/bpjs/vclaim2/sep/fingerprint/list/tglPelayanan/{tglPelayanan}` - GET (BPJS Fingerprint List)
- `/api/bpjs/vclaim2/sep/fingerprint/randomquestion/{noKartu}/tglSep/{tglSep}` - GET (BPJS Random Question)
- `/api/bpjs/vclaim2/sep/fingerprint/randomanswer` - POST (BPJS Submit Random Answer)
- `/api/bpjs/vclaim2/sep/kllinduk/list/{noKartu}` - GET (BPJS Data Induk Kecelakaan)
- `/api/bpjs/vclaim2/suplesi/{noKartu}/tglPelayanan/{tglPelayanan}` - GET (BPJS Suplesi)
- `/api/bpjs/vclaim2/rujukan/insert` - POST (BPJS Insert Rujukan 2.0)
- `/api/bpjs/vclaim2/rujukan/update` - POST (BPJS Update Rujukan 2.0)
- `/api/bpjs/vclaim2/rujukan/delete` - POST (BPJS Delete Rujukan)
- `/api/bpjs/vclaim2/rujukan/spesialistik/{ppkRujukan}/tglRujukan/{tglRujukan}` - GET (BPJS List Spesialistik Rujukan)
- `/api/bpjs/vclaim2/rujukan/sarana/{ppkRujukan}` - GET (BPJS List Sarana Rujukan)
- `/api/bpjs/vclaim2/rujukan/list/{tglMulai}/{tglAkhir}` - GET (BPJS List Rujukan Keluar)
- `/api/bpjs/vclaim2/rujukan/{noRujukan}` - GET (BPJS Rujukan Keluar)
- `/api/bpjs/vclaim2/rujukan/jumlah-sep/{jnsRujukan}/{noRujukan}` - GET (BPJS Jumlah SEP Rujukan)
- `/api/bpjs/vclaim2/rujukan/khusus/insert` - POST (BPJS Perpanjang Rujukan Khusus)
- `/api/bpjs/vclaim2/rujukan/khusus/delete` - POST (BPJS Delete Perpanjangan Rujukan Khusus)
- `/api/bpjs/vclaim2/rujukan/khusus/list/bulan/{bulan}/tahun/{tahun}` - GET (BPJS List Perpanjangan Rujukan Khusus)
- `/api/bpjs/vclaim2/kontrol/insert` - POST (BPJS Insert Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/update` - POST (BPJS Update Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/delete` - POST (BPJS Delete Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/jadwal-spesialistik/{jnsKontrol}/{nomor}/tglRencanaKontrol/{tglRencanaKontrol}` - GET (BPJS List Spesialistik Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/jadwal-dokter/{jnsKontrol}/{kdPoli}/tglRencanaKontrol/{tglRencanaKontrol}` - GET (BPJS Jadwal Dokter Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/list-sep/{tglAwal}/{tglAkhir}/{filter}` - GET (BPJS List Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/{noSuratKontrol}` - GET (BPJS Surat Kontrol)
- `/api/bpjs/vclaim2/kontrol/v2/insert` - POST (BPJS Insert Rencana Kontrol V2)
- `/api/bpjs/vclaim2/kontrol/v2/update` - POST (BPJS Update Rencana Kontrol V2)
- `/api/bpjs/vclaim2/kontrol/sepnosep/{noSep}` - GET (BPJS SEP for Rencana Kontrol)
- `/api/bpjs/vclaim2/kontrol/list-by-nokartu/{bulan}/tahun/{tahun}/noKartu/{noKartu}/{filter}` - GET (BPJS List Rencana Kontrol by NoKartu)
- `/api/bpjs/spri/insert` - POST (BPJS Insert SPRI)
- `/api/bpjs/spri/update` - POST (BPJS Update SPRI)
- `/api/bpjs/prb/insert` - POST (BPJS Insert PRB)
- `/api/bpjs/prb/update` - PUT (BPJS Update PRB)
- `/api/bpjs/prb/delete` - DELETE (BPJS Delete PRB)
- `/api/bpjs/prb/srb/{noSrb}/nosep/{noSep}` - GET (BPJS PRB by NoSrb and NoSep)
- `/api/bpjs/prb/date/{tglMulai}/{tglAkhir}` - GET (BPJS PRB by Date Range)
- `/api/bpjs/prb/potensi/{tahun}/{bulan}` - GET (BPJS PRB Potensi Summary)
- `/api/bpjs/ref/diagnosa/{param}` - GET (BPJS Diagnosa Reference)
- `/api/bpjs/ref/poli/{param}` - GET (BPJS Poli Reference)
- `/api/bpjs/ref/dokter/{param}` - GET (BPJS Dokter Reference)
- `/api/bpjs/ref/faskes/{param1}/{param2}` - GET (BPJS Faskes Reference)
- `/api/bpjs/ref/procedure/{param}` - GET (BPJS Procedure Reference)
- `/api/bpjs/ref/kelasrawat` - GET (BPJS Kelas Rawat Reference)
- `/api/bpjs/ref/ruangrawat` - GET (BPJS Ruang Rawat Reference)
- `/api/bpjs/ref/spesialistik` - GET (BPJS Spesialistik Reference)
- `/api/bpjs/ref/carakeluar` - GET (BPJS Cara Keluar Reference)
- `/api/bpjs/ref/pascapulang` - GET (BPJS Pasca Pulang Reference)
- `/api/bpjs/ref/propinsi` - GET (BPJS Propinsi Reference)
- `/api/bpjs/ref/kabupaten/{propinsiId}` - GET (BPJS Kabupaten Reference)
- `/api/bpjs/ref/kecamatan/{kabupatenId}` - GET (BPJS Kecamatan Reference)
- `/api/bpjs/ref/dpjp/{pelayanan}/{tglPelayanan}/{spesialis}` - GET (BPJS DPJP Reference)
- `/api/bpjs/ref/diagnosaprb` - GET (BPJS Diagnosa PRB Reference)
- `/api/bpjs/ref/obatprb/{param}` - GET (BPJS Obat PRB Reference)
- `/api/bpjs/monitoring/kunjungan/{tanggal}/{jnsPelayanan}` - GET (BPJS Kunjungan Monitoring)
- `/api/bpjs/monitoring/klaim/{tanggal}/{jnsPelayanan}/{status}` - GET (BPJS Klaim Monitoring)
- `/api/bpjs/monitoring/histori/{noKartu}/tglMulai/{tglMulai}/tglAkhir/{tglAkhir}` - GET (BPJS Histori Pelayanan Peserta)
- `/api/bpjs/monitoring/jasaraharja/{jnsPelayanan}/tglMulai/{tglMulai}/tglAkhir/{tglAkhir}` - GET (BPJS Klaim Jasa Raharja)
- `/api/bpjs/antrean/rs/ref/poli` - GET (BPJS Antrean RS Reference Poli)
- `/api/bpjs/antrean/rs/ref/dokter` - GET (BPJS Antrean RS Reference Dokter)
- `/api/bpjs/antrean/rs/ref/jadwaldokter/{kodePoli}/tanggal/{tanggal}` - GET (BPJS Antrean RS Reference Jadwal Dokter)
- `/api/bpjs/antrean/rs/ref/poli/fp` - GET (BPJS Antrean RS Reference Poli FP)
- `/api/bpjs/antrean/rs/ref/pasien/fp/identitas/{nik}/noidentitas/{noka}` - GET (BPJS Antrean RS Reference Pasien FP)
- `/api/bpjs/antrean/rs/jadwaldokter/update` - POST (BPJS Update Jadwal Dokter Antrean)
- `/api/bpjs/antrean/rs/add` - POST (BPJS Add Antrean)
- `/api/bpjs/antrean/rs/farmasi/add` - POST (BPJS Add Antrean Farmasi)
- `/api/bpjs/antrean/rs/updatewaktu` - POST (BPJS Update Waktu Antrean)
- `/api/bpjs/antrean/rs/batal` - POST (BPJS Cancel Antrean)
- `/api/bpjs/antrean/rs/getlisttask/{kodeBooking}` - GET (BPJS Get List Task Antrean)
- `/api/bpjs/antrean/rs/dashboard/waktutunggu/tanggal/{tanggal}/waktu/{waktu}` - GET (BPJS Dashboard Waktu Tunggu)
- `/api/bpjs/antrean/rs/dashboard/waktutunggu/bulan/{bulan}/tahun/{tahun}/waktu/{waktu}` - GET (BPJS Dashboard Waktu Tunggu Bulanan)
- `/api/bpjs/antrean/rs/pendaftaran/tanggal/{tanggal}` - GET (BPJS Antrean Registration by Date)
- `/api/bpjs/antrean/rs/pendaftaran/kodebooking/{kodeBooking}` - GET (BPJS Antrean Registration by Booking Code)
- `/api/bpjs/antrean/rs/pendaftaran/aktif` - GET (BPJS Active Antrean Registration)
- `/api/bpjs/antrean/rs/pendaftaran/kodepoli/{kodePoli}/kodedokter/{kodeDokter}/hari/{hari}/jampraktek/{jamPraktek}` - GET (BPJS Active Antrean Registration by Poli, Dokter, Hari, JamPraktek)
- `/api/bpjs/apotek/ref/dpho` - GET (BPJS Apotek Reference DPHO)
- `/api/bpjs/apotek/ref/poli/{param}` - GET (BPJS Apotek Reference Poli)
- `/api/bpjs/apotek/ref/faskes/{param1}/{param2}` - GET (BPJS Apotek Reference Faskes)
- `/api/bpjs/apotek/ref/settingppk/read/{param}` - GET (BPJS Apotek Setting)
- `/api/bpjs/apotek/ref/spesialistik` - GET (BPJS Apotek Reference Spesialistik)
- `/api/bpjs/apotek/ref/obat/{param1}/{param2}/{param3}` - GET (BPJS Apotek Reference Obat)
- `/api/bpjs/apotek/obatnonracikan/v3/insert` - POST (BPJS Save Non-Racikan Drug)
- `/api/bpjs/apotek/obatracikan/v3/insert` - POST (BPJS Save Racikan Drug)
- `/api/bpjs/apotek/updatestok` - POST (BPJS Update Drug Stock)
- `/api/bpjs/apotek/pelayanan/obat/hapus` - DELETE (BPJS Delete Drug Service)
- `/api/bpjs/apotek/obat/daftar/{noSep}` - GET (BPJS Drug Service List)
- `/api/bpjs/apotek/riwayatobat/{tglAwal}/{tglAkhir}/{noKartu}` - GET (BPJS Drug Service History)
- `/api/bpjs/apotek/sjpresep/v3/insert` - POST (BPJS Save Recipe)
- `/api/bpjs/apotek/hapusresep` - DELETE (BPJS Delete Recipe)
- `/api/bpjs/apotek/daftarresep` - POST (BPJS Recipe List)
- `/api/bpjs/apotek/sep/{noSep}` - GET (BPJS Search SEP)
- `/api/bpjs/apotek/monitoring/klaim/{bulan}/{tahun}/{jenisObat}/{status}` - GET (BPJS Apotek Claim Monitoring)
- `/api/bpjs/apotek/prb/rekappeserta/tahun/{tahun}/bulan/{bulan}` - GET (BPJS PRB Participant Recap)
- `/api/bpjs/pcare/diagnosa/{param}/row/{row}/limit/{limit}` - GET (BPJS PCare Diagnosa)
- `/api/bpjs/pcare/dokter/{row}/limit/{limit}` - GET (BPJS PCare Doctor)
- `/api/bpjs/pcare/kelompok/club/{kdJenisKelompok}` - GET (BPJS PCare Club Pro Lanis)
- `/api/bpjs/pcare/kelompok/kegiatan/{bulan}` - GET (BPJS PCare Activity Group)
- `/api/bpjs/pcare/kelompok/peserta/{eduId}` - GET (BPJS PCare Participant Activity Group)
- `/api/bpjs/pcare/kelompok/kegiatan` - POST (BPJS Add Activity Group)
- `/api/bpjs/pcare/kelompok/peserta` - POST (BPJS Add Participant to Activity Group)
- `/api/bpjs/pcare/kelompok/kegiatan/{eduId}` - DELETE (BPJS Delete Activity Group)
- `/api/bpjs/pcare/kelompok/peserta/{eduId}/{noKartu}` - DELETE (BPJS Delete Participant from Activity Group)
- `/api/bpjs/pcare/kesadaran` - GET (BPJS PCare Consciousness)
- `/api/bpjs/pcare/kunjungan/rujukan/{noKunjungan}` - GET (BPJS PCare Referral Visit)
- `/api/bpjs/pcare/kunjungan/peserta/{noKartu}` - GET (BPJS PCare Visit History)
- `/api/bpjs/pcare/kunjungan` - POST (BPJS Add Visit)
- `/api/bpjs/pcare/kunjungan` - PUT (BPJS Edit Visit)
- `/api/bpjs/pcare/kunjungan/{noKunjungan}` - DELETE (BPJS Delete Visit)
- `/api/bpjs/apotek/resep/{kodeBooking}` - GET (BPJS Apotek Recipe)
- `/api/bpjs/icare/nik/{nik}` - GET (BPJS ICare Data)
- `/api/bpjs/aplicares/ref/kelas` - GET (BPJS Aplicares Bed Class Reference)
- `/api/bpjs/aplicares/bed/update/{kodeppk}` - POST (BPJS Update Bed Availability)
- `/api/bpjs/aplicares/bed/create/{kodeppk}` - POST (BPJS Create New Room)
- `/api/bpjs/aplicares/bed/read/{kodeppk}/start/{start}/limit/{limit}` - GET (BPJS Get Bed Availability)
- `/api/bpjs/aplicares/bed/delete/{kodeppk}` - POST (BPJS Delete Room)
- `/api/bpjs/poli` - GET (BPJS Poli List)
- `/api/bpjs/dokter` - GET (BPJS Doctor List)

### 🔍 Endpoint Baru yang Ditemukan Belum Ditambahkan ke OpenAPI

### 🔄 Proses Penambahan ke OpenAPI
1. Lakukan review endpoint secara berkala
2. Tandai endpoint yang sudah dibuat dokumentasi OpenAPI-nya
3. Buat template OpenAPI untuk endpoint baru
4. Uji coba endpoint setelah implementasi

## Temuan dan Perbaikan Inkonsistensi

Kami telah menemukan dan memperbaiki beberapa inkonsistensi dalam sistem:

1. **File Controller Rusak**: Menemukan file [patientController.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/controllers/patientController.ts) yang sebelumnya mengandung campuran kode SQL dan TypeScript. File telah diperbaiki dan difungsikan kembali.

2. **Validasi Input**: Menstandarisasi validasi input menggunakan Zod schema untuk semua controller, termasuk membuat middleware validasi umum.

3. **Penanganan Error**: Menyempurnakan penanganan error dengan penambahan logging yang konsisten dan pesan error yang informatif.

4. **Otentikasi & Otorisasi**: Menyempurnakan middleware otentikasi dan otorisasi di semua endpoint penting.

## Perbaikan dan Penyempurnaan yang Telah Dilakukan

1. **Standarisasi Validasi Input**:
   - Membuat middleware validasi umum di [/backend/src/middleware/validation.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/middleware/validation.ts)
   - Menggunakan Zod schema untuk semua validasi input di controller
   - Mengganti validasi `express-validator` dengan Zod di beberapa controller

2. **Penanganan Error yang Lebih Konsisten**:
   - Menambahkan logging menggunakan Winston logger di semua controller
   - Menyempurnakan struktur respons error
   - Menambahkan penanganan error spesifik untuk berbagai jenis error (ZodError, error database, dll)

3. **Otentikasi dan Otorisasi yang Lebih Kuat**:
   - Menambahkan middleware `authenticateToken` di semua endpoint penting
   - Memastikan semua endpoint memiliki otorisasi yang tepat menggunakan RBAC
   - Menyempurnakan routes untuk menggabungkan otentikasi dan otorisasi

Contoh perubahan yang dilakukan:
- Pada [cssdController.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/controllers/cssdController.ts): Mengganti validasi `express-validator` dengan Zod schema, menambahkan logging konsisten, dan menyempurnakan penanganan error.
- Pada [cssd.route.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/routes/cssd.route.ts): Menambahkan middleware otentikasi dan otorisasi ke semua endpoint, mengganti placeholder dengan controller sebenarnya.

## Catatan Penting
- Semua endpoint diakses melalui prefix `/api`
- Gunakan otentikasi JWT token untuk mengakses endpoint yang dilindungi
- Beberapa endpoint memiliki role-based access control (RBAC)
- Field dan relasi model harus sesuai antara schema Prisma dan penggunaan di controller
- Pastikan untuk menggunakan soft-delete untuk data sensitif seperti pasien, kunjungan, dll
- Gunakan Zod untuk validasi input di semua endpoint
- Gunakan Winston logger untuk logging konsisten
- Middleware otentikasi harus digunakan di semua endpoint yang memerlukan proteksi

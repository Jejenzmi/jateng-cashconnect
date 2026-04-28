# Dokumentasi Modul Integrasi Komprehensif: SATU SEHAT, IDRG, dan E-Claim

## Deskripsi
Dokumentasi ini menjelaskan tiga modul integrasi utama yang akan menghubungkan SIMRS ZEN dengan sistem eksternal: SATU SEHAT untuk integrasi dengan sistem kesehatan nasional, IDRG (INA-DRG) untuk klasifikasi diagnosis dan penentuan biaya, serta E-Claim BPJS untuk pengajuan klaim elektronik.

## 1. Modul Integrasi SATU SEHAT

### 1.1 Gambaran Umum
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem SATU SEHAT Kementerian Kesehatan RI. Modul ini memungkinkan rumah sakit untuk mengirimkan data pelayanan kesehatan dalam format FHIR R4 ke server SATU SEHAT.

### 1.2 Standar dan Teknologi
- **Format Data**: FHIR R4 (Fast Healthcare Interoperability Resources)
- **Protokol**: HL7 FHIR
- **Autentikasi**: OAuth 2.0
- **Resources Utama**: Patient, Encounter, Observation, Condition, Procedure, Immunization, Organization, Practitioner

### 1.3 Fungsionalitas Utama
- Otentikasi ke server SATU SEHAT
- Konversi data lokal ke format FHIR R4
- Sinkronisasi data pasien (Patient resource)
- Sinkronisasi data pelayanan (Encounter resource)
- Sinkronisasi data observasi (Observation resource)
- Sinkronisasi data kondisi medis (Condition resource)
- Sinkronisasi data prosedur (Procedure resource)
- Sinkronisasi data imunisasi (Immunization resource)
- Penjadwalan sinkronisasi data
- Penanganan error dan retry otomatis
- Validasi data sebelum pengiriman
- Monitoring status pengiriman

### 1.4 Skema Database Tambahan
```prisma
// Entitas untuk manajemen otentikasi SATU SEHAT
model SatuSehatAuth {
  id           String   @id @default(uuid())
  clientId     String
  clientSecret String @db.EncryptedText
  accessToken  String @db.EncryptedText
  refreshToken String @db.EncryptedText
  tokenExpiry  DateTime
  organizationId String  // ID organisasi di SATU SEHAT
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt
}

// Entitas untuk menyimpan referensi FHIR
model SatuSehatResource {
  id           String   @id @default(uuid())
  resourceId   String   // ID resource di SATU SEHAT
  resourceType String   // Jenis resource FHIR (Patient, Encounter, dll)
  localId      String   // ID entitas lokal (contoh: patientId)
  localType    String   // Jenis entitas lokal (Patient, Visit, dll)
  lastSynced   DateTime
  syncStatus   String   // success, failed, pending
  errorMessage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt
}
```

### 1.5 Endpoint API
- `POST /satusehat/auth` - Otentikasi ke SATU SEHAT
- `POST /satusehat/sync/patient` - Sinkronisasi data pasien
- `POST /satusehat/sync/encounter` - Sinkronisasi data pelayanan
- `POST /satusehat/sync/observation` - Sinkronisasi data observasi
- `GET /satusehat/sync/status` - Status sinkronisasi
- `GET /satusehat/resources/{resourceType}/{localId}` - Cek resource di SATU SEHAT

### 1.6 Implementasi Teknis
- Fungsi konversi data lokal ke FHIR resources
- Queue system untuk pengiriman data
- Retry mechanism untuk kegagalan
- Logging komprehensif

## 2. Modul Integrasi IDRG (INA-DRG)

### 2.1 Gambaran Umum
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem INA-DRG (Indonesia-National Diagnosis Related Group) untuk keperluan klaim BPJS dan penentuan biaya pelayanan berdasarkan klasifikasi diagnosis dan tindakan.

### 2.2 Standar dan Teknologi
- **Format Data**: XML/JSON sesuai spesifikasi INA-DRG
- **Protokol**: HTTP/HTTPS
- **Autentikasi**: API Key atau Basic Auth

### 2.3 Fungsionalitas Utama
- Klasifikasi INA-DRG berdasarkan diagnosis dan tindakan
- Konversi data pelayanan ke format klaim INA-DRG
- Validasi data klaim sebelum pengiriman
- Pengiriman klaim ke server INA-DRG
- Pengecekan status dan hasil klasifikasi
- Perhitungan tarif berdasarkan grup diagnosis
- Mapping kode ICD-10/ICD-9 ke kode INA-DRG
- Manajemen kode INA-DRG
- Perhitungan biaya

### 2.4 Skema Database Tambahan
```prisma
// Entitas untuk data IDRG
model IdrgData {
  id                String   @id @default(uuid())
  visitId           String   // Foreign key ke Visit
  patientId         String   // Foreign key ke Patient
  noKartu           String   // Nomor kartu BPJS
  kodeKlasifikasi   String   // Kode hasil klasifikasi IDRG
  tglPelayanan      DateTime
  jenisPelayanan    String   // 1=Rawat Inap, 2=Rawat Jalan
  kodeDiagnosa      String   // Kode ICD-10
  kodeProsedur      String?  // Kode ICD-9 (jika ada)
  kodeKelasRawat    String   // Kelas rawat
  kodeDokter        String   // Kode dokter DPJP
  kodeRuangan       String   // Kode ruangan
  lamaDirawat       Int      // Lama dirawat dalam hari
  adlScore          String   // Skor ADL
  kodeBarang        String?  // Kode alat yang ditanam
  tarifRs           Decimal  // Tarif rumah sakit
  tarifPbyn         Decimal  // Tarif pembiayaan
  jumlahHari        Int?     // Jumlah hari perawatan intensif
  biayaObatRs       Decimal? // Biaya obat rumah sakit
  biayaObatPbyn     Decimal? // Biaya obat pembiayaan
  biayaGiziRs       Decimal? // Biaya gizi rumah sakit
  biayaGiziPbyn     Decimal? // Biaya gizi pembiayaan
  biayaKamarRs      Decimal? // Biaya kamar rumah sakit
  biayaKamarPbyn    Decimal? // Biaya kamar pembiayaan
  biayaLabRs        Decimal? // Biaya laboratorium rumah sakit
  biayaLabPbyn      Decimal? // Biaya laboratorium pembiayaan
  biayaRadRs        Decimal? // Biaya radiologi rumah sakit
  biayaRadPbyn      Decimal? // Biaya radiologi pembiayaan
  biayaObatKronis   Decimal? // Biaya obat kronis
  status            String   // pending, processed, approved, rejected
  createdAt         DateTime @default(now())
  updatedAt         DateTime @default(now()) @updatedAt
  
  visit             Visit    @relation(fields: [visitId], references: [id])
  patient           Patient  @relation(fields: [patientId], references: [id])
}
```

### 2.5 Endpoint API
- `POST /idrg/classify` - Klasifikasi IDRG untuk kunjungan
- `POST /idrg/submit` - Kirim klaim IDRG ke server
- `GET /idrg/status/{id}` - Cek status klaim
- `GET /idrg/history/{patientId}` - Riwayat klaim IDRG pasien
- `GET /idrg/calculator` - Kalkulator biaya IDRG

### 2.6 Implementasi Teknis
- Algoritma klasifikasi IDRG
- Fungsi validasi data klaim
- Sistem pengiriman otomatis
- Penanganan error dan respon

## 3. Modul Integrasi E-Claim BPJS v2

### 3.1 Gambaran Umum
Modul untuk mengintegrasikan SIMRS ZEN dengan sistem E-Claim BPJS versi 2 untuk pengajuan klaim elektronik secara otomatis berdasarkan data pelayanan pasien.

### 3.2 Standar dan Teknologi
- **Format Data**: XML/JSON sesuai spesifikasi E-Claim BPJS
- **Protokol**: HTTP/HTTPS
- **Autentikasi**: Custom header (X-Cons-ID, X-Timestamp, X-Signature)

### 3.3 Fungsionalitas Utama
- Otentikasi ke server E-Claim BPJS v2
- Konversi data pelayanan ke format klaim E-Claim
- Validasi data klaim sesuai dengan aturan BPJS
- Pengiriman klaim ke server E-Claim
- Pengecekan status klaim
- Penanganan revisi klaim
- Sinkronisasi status klaim
- Manajemen SEP (Surat Eligibilitas Peserta)
- Manajemen DPJP (Dokter Penanggung Jawab Pasien)
- Manajemen master data BPJS
- Manajemen referensi BPJS

### 3.4 Skema Database Tambahan
```prisma
// Entitas untuk data E-Claim
model EClaimSubmission {
  id                String   @id @default(uuid())
  visitId           String   // Foreign key ke Visit
  patientId         String   // Foreign key ke Patient
  noKlaim           String   // Nomor klaim dari BPJS
  jnsPelayanan      String   // Jenis pelayanan (1=Inap, 2=Jalan)
  catatan           String?  // Catatan dari BPJS
  diagnosa          String   // Kode diagnosa ICD-10
  procedure         String?  // Kode prosedur ICD-9CM
  subKlaim          String   // Sub klaim
  estCost           Decimal  // Estimasi biaya
  flagProcedure     String?  // Flag prosedur
  kdPoli            String   // Kode poli
  los               String?  // Length of Stay
  admisi            String?  // Jenis admisi
  dischStat         String?  // Discharge status
  pnyTanggungJawab  String?  // Penanggung jawab
  status            String   // pending, submitted, approved, rejected, revised
  response          Json?    // Response dari server BPJS
  createdAt         DateTime @default(now())
  updatedAt         DateTime @default(now()) @updatedAt
  
  visit             Visit    @relation(fields: [visitId], references: [id])
  patient           Patient  @relation(fields: [patientId], references: [id])
}

// Entitas untuk SEP (Surat Eligibilitas Peserta)
model Sep {
  id                String   @id @default(uuid())
  noKartu           String   // Nomor kartu BPJS
  tglSep            DateTime
  tglRencanaKontrol DateTime?
  noRujukan         String?  // Nomor rujukan
  ppkDirujuk        String?  // Kode PPK dirujuk
  nmppkDirujuk      String?  // Nama PPK dirujuk
  caraKunjungan     String?  // Cara kunjungan
  noTelp            String?  // Nomor telepon
  userCreated       String   // User yang membuat
  flagProcedure     String?  // Flag prosedur
  kdDokter          String   // Kode dokter
  nmDokter          String   // Nama dokter
  klsRawat          String   // Kelas rawat
  kdSpesialis       String?  // Kode spesialis
  nmSpesialis       String?  // Nama spesialis
  kdSubSpesialis    String?  // Kode sub spesialis
  nmSubSpesialis    String?  // Nama sub spesialis
  kdFaskes          String?  // Kode faskes
  nmFaskes          String?  // Nama faskes
  tipeRujukan       String?  // Tipe rujukan
  catatan           String?  // Catatan
  diagAwal          String?  // Diagnosa awal
  tujPelayanan      String?  // Tujuan pelayanan
  kdpoliTujuan      String?  // Kode poli tujuan
  nmpoliTujuan      String?  // Nama poli tujuan
  kddokterRujukan   String?  // Kode dokter rujukan
  nmdokterRujukan   String?  // Nama dokter rujukan
  tglRujukan        DateTime? // Tanggal rujukan
  noMr              String   // Nomor rekam medis
  status            String   // Status SEP
  response          Json?    // Response dari server BPJS
  createdAt         DateTime @default(now())
  updatedAt         DateTime @default(now()) @updatedAt
  
  patient           Patient  @relation(fields: [noMr], references: [patientId]) // Relasi dengan nomor MR
}
```

### 3.5 Endpoint API
- `POST /eclaim/submit` - Kirim klaim ke server E-Claim
- `PUT /eclaim/update` - Update klaim yang sudah dikirim
- `GET /eclaim/status/{noKlaim}` - Cek status klaim
- `POST /eclaim/sep/create` - Buat SEP baru
- `GET /eclaim/sep/check/{noKartu}` - Cek eligibilitas peserta
- `GET /eclaim/history/{patientId}` - Riwayat klaim pasien

### 3.6 Implementasi Teknis
- Algoritma pembuatan signature
- Fungsi validasi data klaim
- Sistem pengiriman batch
- Penanganan error dan retry

## 4. Integrasi Antar Modul

### 4.1 Hubungan Antar Modul
- Data pasien dari modul pasien digunakan oleh ketiga modul
- Data kunjungan dari modul kunjungan digunakan untuk klaim
- Data dari modul rekam medis digunakan untuk klasifikasi IDRG
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
- Cache untuk autentikasi

### 5.3 Monitoring
- Monitoring status sinkronisasi
- Monitoring error rate
- Monitoring response time

## 6. Keamanan

### 6.1 Perlindungan Data
- Enkripsi data sensitif
- Autentikasi kuat
- Validasi input ketat
- Audit trail komprehensif

### 6.2 Kepatuhan
- Kepatuhan terhadap regulasi kesehatan
- Perlindungan data pasien
- Jejak audit untuk audit compliance

## 7. Kriteria Keberhasilan

### 7.1 Modul SATU SEHAT
- [ ] Terotentikasi ke server SATU SEHAT
- [ ] Berhasil mengirim data pasien
- [ ] Berhasil mengirim data pelayanan
- [ ] Sistem sinkronisasi otomatis berfungsi
- [ ] Monitoring dan logging berfungsi

### 7.2 Modul IDRG
- [ ] Algoritma klasifikasi berfungsi
- [ ] Pengiriman klaim berhasil
- [ ] Validasi data akurat
- [ ] Perhitungan biaya benar
- [ ] Monitoring status klaim berfungsi

### 7.3 Modul E-Claim
- [ ] Pembuatan SEP berhasil
- [ ] Pengiriman klaim berhasil
- [ ] Pembaruan klaim berhasil
- [ ] Cek status berfungsi
- [ ] Validasi data ketat
# Arsitektur SIMRS ZEN - Dokumentasi Lengkap

Dokumen ini menjelaskan secara menyeluruh arsitektur keseluruhan sistem SIMRS ZEN, termasuk source code, endpoint, database, dan modul-modulnya.

## 1. Gambaran Umum Arsitektur

SIMRS ZEN adalah sistem informasi manajemen rumah sakit berbasis web yang dirancang dengan arsitektur full-stack modern:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL dengan Prisma ORM
- **Infrastructure**: Docker containerization
- **Authentication**: JWT-based authentication

## 2. Struktur Proyek

```
SIMRSZEN/
├── backend/                    # Backend Node.js
│   ├── prisma/                # Schema database dan migrasi
│   ├── src/
│   │   ├── config/            # Konfigurasi aplikasi
│   │   ├── controllers/       # Logika bisnis
│   │   ├── middleware/        # Middleware (auth, validation, logging)
│   │   ├── routes/            # Definisi endpoint
│   │   ├── services/          # Layanan bisnis yang reusable
│   │   ├── utils/             # Helper functions
│   │   ├── types/             # Type definitions
│   │   ├── app.ts             # Entry point utama
│   │   └── server.ts          # Server initialization
│   └── package.json
├── simrs-zen/                 # Frontend React
│   ├── src/
│   │   ├── components/        # Komponen reusable
│   │   ├── pages/             # Halaman aplikasi
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Service API calls
│   │   ├── types/             # Type definitions
│   │   ├── utils/             # Helper functions
│   │   ├── contexts/          # React Context
│   │   ├── config/            # Konfigurasi aplikasi
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml         # Container orchestration
└── README.md                  # Dokumentasi utama
```

## 3. Database Schema

### 3.1 Entitas Utama
Database SIMRS ZEN menggunakan PostgreSQL dengan skema Prisma ORM yang mencakup:

#### Pasien
- `Patient`: Informasi dasar pasien (NIK, nama, tanggal lahir, alamat, dll)
- `MedicalRecord`: Rekam medis pasien
- `Visit`: Kunjungan pasien ke rumah sakit

#### Pelayanan Medis
- `Doctor`: Data dokter
- `Nurse`: Data perawat
- `Room`: Ruangan rawat inap
- `Bed`: Tempat tidur di ruangan

#### Administrasi
- `User`: Akun pengguna sistem
- `Role`: Hak akses pengguna
- `Module`: Modul-modul sistem
- `Department`: Departemen di rumah sakit

#### Faskes Profile
- `HospitalProfile`: Profil rumah sakit
- `FaskesType`: Jenis fasilitas kesehatan (Rumah Sakit, Klinik, Puskesmas)

### 3.2 Relasi Antar Entitas
- Patient memiliki banyak Visit
- Visit memiliki satu Patient
- Visit memiliki satu Doctor
- Visit memiliki satu Room/Bed
- User memiliki satu Role
- Module terkait dengan FaskesType tertentu

## 4. Endpoint API

### 4.1 Autentikasi
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/logout` - Logout pengguna
- `GET /api/auth/profile` - Ambil profil pengguna
- `PUT /api/auth/profile` - Update profil pengguna

### 4.2 Manajemen Pasien
- `GET /api/patients` - Ambil semua pasien
- `GET /api/patients/:id` - Ambil pasien spesifik
- `POST /api/patients` - Tambah pasien baru
- `PUT /api/patients/:id` - Update data pasien
- `DELETE /api/patients/:id` - Hapus pasien

### 4.3 Kunjungan
- `GET /api/visits` - Ambil semua kunjungan
- `GET /api/visits/:id` - Ambil kunjungan spesifik
- `POST /api/visits` - Tambah kunjungan baru
- `PUT /api/visits/:id` - Update kunjungan
- `DELETE /api/visits/:id` - Hapus kunjungan

### 4.4 Dokter
- `GET /api/doctors` - Ambil semua dokter
- `GET /api/doctors/:id` - Ambil dokter spesifik
- `POST /api/doctors` - Tambah dokter baru
- `PUT /api/doctors/:id` - Update data dokter
- `DELETE /api/doctors/:id` - Hapus dokter

### 4.5 Profil Faskes
- `GET /api/faskes-profile/check-profile` - Cek profil faskes
- `POST /api/faskes-profile/setup` - Setup profil faskes
- `PUT /api/faskes-profile/update` - Update profil faskes

### 4.6 Modul Sistem
- `GET /api/modules` - Ambil daftar modul aktif
- `POST /api/modules/toggle` - Aktif/nonaktifkan modul
- `GET /api/modules/available` - Ambil daftar modul tersedia

## 5. Modul-modul SIMRS ZEN

Sistem SIMRS ZEN dirancang modular dengan fitur dinamis berdasarkan tipe faskes:

### 5.1 Modul Umum (Untuk semua tipe faskes)
- **Pasien**: Pendaftaran, biodata, riwayat kunjungan
- **Antrian**: Sistem antrian online dan offline
- **Rekam Medis**: Catatan medis pasien
- **Farmasi**: Manajemen obat dan resep
- **Laboratorium**: Pemeriksaan dan hasil lab
- **Radiologi**: Pemeriksaan dan hasil radiologi

### 5.2 Modul Khusus Rumah Sakit
- **Rawat Inap**: Manajemen kamar dan tempat tidur
- **IGD**: Manajemen instalasi gawat darurat
- **Operasi**: Jadwal dan laporan operasi
- **ICU/NICU/PICU**: Manajemen unit perawatan intensif
- **VClaim**: Integrasi dengan BPJS
- **MCU**: Medical check-up

### 5.3 Modul Khusus Klinik/Puskesmas
- **PCare**: Integrasi dengan BPJS PCare
- **Imunisasi**: Jadwal dan pelaporan imunisasi
- **KIA**: Kartu ibu dan anak
- **Gizi Klinis**: Asesmen gizi pasien
- **Rehab Medik**: Terapi dan jadwal rehabilitasi

### 5.4 Modul Pendukung
- **HR/Remunerasi**: Manajemen SDM dan penggajian
- **Purchasing**: Pembelian barang dan jasa
- **Akuntansi**: Pembukuan dan laporan keuangan
- **Inventaris**: Manajemen aset dan barang
- **CSSD**: Central Sterile Supply Department
- **Pelayanan Rohani**: Pelayanan spiritual
- **Psikologi Klinis**: Layanan psikologis
- **Forensik**: Forensic medicine
- **Dialisis**: Hemodialisis
- **Nutrisi**: Manajemen gizi dan diet

## 6. Konfigurasi Modul Berdasarkan Tipe Faskes

Sistem mengatur modul-modul yang aktif berdasarkan tipe fasilitas kesehatan:

- **Rumah Sakit**: Semua modul aktif, termasuk VClaim (BPJS)
- **Klinik/Puskesmas**: Modul terbatas, termasuk PCare (BPJS)
- **Faskes Lainnya**: Modul dasar saja

## 7. Implementasi Prisma Schema

Contoh definisi model utama di `prisma/schema.prisma`:

```
model Patient {
  id           String   @id @default(cuid())
  nik          String   @unique
  name         String
  dateOfBirth  DateTime
  gender       String
  phone        String?
  address      String?
  visits       Visit[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Visit {
  id          String   @id @default(cuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  doctorId    String
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
  roomId      String?
  room        Room?    @relation(fields: [roomId], references: [id])
  complaint   String
  diagnosis   String?
  treatment   String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model HospitalProfile {
  id           String        @id @default(cuid())
  name         String
  code         String        @unique
  address      String
  phone        String
  fax          String?
  email        String?
  website      String?
  faskesType   FaskesType    @default(RUMAH_SAKIT)
  bpjsConfig   Json?
  isActive     Boolean       @default(true)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

enum FaskesType {
  RUMAH_SAKIT
  KLINIK
  PUSKESMAS
  APOTEK
  LAINNYA
}
```

## 8. Flow Proses Utama

### 8.1 Pendaftaran Pasien Baru
1. User mengakses modul Pasien
2. Mengisi formulir pendaftaran
3. Sistem memvalidasi data
4. Data disimpan ke database
5. Sistem memberikan nomor registrasi

### 8.2 Pemeriksaan Dokter
1. Dokter memilih pasien dari antrian
2. Melakukan pemeriksaan dan mencatat diagnosis
3. Memberikan resep jika diperlukan
4. Data disimpan ke rekam medis
5. Jika rawat inap, sistem mengarahkan ke modul rawat inap

### 8.3 Integrasi BPJS
1. Sistem mengecek tipe faskes
2. Jika rumah sakit → aktifkan VClaim
3. Jika klinik/puskesmas → aktifkan PCare
4. Proses klaim dikirim ke sistem BPJS
5. Hasil dikembalikan dan dicatat

## 9. Aspek Keamanan

- Autentikasi JWT dengan refresh token
- Enkripsi password menggunakan bcrypt
- Validasi input di frontend dan backend
- Hak akses berbasis role
- Logging aktivitas pengguna
- Sanitasi input untuk mencegah SQL injection dan XSS

## 10. Deployment

Sistem dirancang untuk deployment dengan Docker:
- Backend dan frontend dalam container terpisah
- Database PostgreSQL dalam container
- Load balancer opsional untuk scaling
- SSL/HTTPS diaktifkan secara default
- Backup otomatis ke storage eksternal

Dengan arsitektur ini, SIMRS ZEN menjadi sistem yang fleksibel, skalabel, dan sesuai dengan kebutuhan masing-masing tipe fasilitas kesehatan.
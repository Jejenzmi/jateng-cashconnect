# Integrasi Satu Sehat - SIMRS ZEN

## Gambaran Umum

Modul integrasi Satu Sehat memungkinkan SIMRS ZEN untuk berkomunikasi dengan platform Satu Sehat milik Kementerian Kesehatan RI. Modul ini menyediakan fungsionalitas untuk mengirim data pasien, encounter, condition, dan observation ke platform Satu Sehat sesuai dengan standar FHIR (Fast Healthcare Interoperability Resources).

## Arsitektur Integrasi

### 1. Service Layer
- **SatuSehatAuthService**: Mengelola otentikasi dan token OAuth2 dari platform Satu Sehat
- **SatuSehatService**: Menyediakan fungsionalitas untuk berinteraksi dengan berbagai endpoint FHIR di Satu Sehat

### 2. Controller Layer
- **SatuSehatController**: Menyediakan endpoint API untuk mengelola integrasi Satu Sehat

### 3. Frontend Component
- **SatuSehatIntegration.tsx**: Antarmuka pengguna untuk mengelola konfigurasi dan sinkronisasi dengan Satu Sehat

## Konfigurasi

Untuk menggunakan integrasi Satu Sehat, beberapa parameter konfigurasi perlu disediakan:

- `SATUSEHAT_CLIENT_ID`: Client ID dari portal Satu Sehat
- `SATUSEHAT_CLIENT_SECRET`: Client Secret dari portal Satu Sehat
- `SATUSEHAT_BASE_URL`: URL dasar API FHIR Satu Sehat
- `SATUSEHAT_AUTH_URL`: URL untuk otentikasi token
- `SATUSEHAT_ORGANIZATION_ID`: ID organisasi di Satu Sehat

## Endpoint API

### Otentikasi
- `GET /api/satusehat/token-info`: Mendapatkan informasi tentang token saat ini

### Pasien
- `POST /api/satusehat/sync-patient/:patientId`: Sinkronisasi data pasien ke Satu Sehat
- `GET /api/satusehat/patient/:id`: Mendapatkan data pasien dari Satu Sehat
- `PUT /api/satusehat/patient/:patientId`: Memperbarui data pasien di Satu Sehat

### Encounter
- `POST /api/satusehat/encounter`: Membuat encounter di Satu Sehat

### Condition
- `POST /api/satusehat/condition`: Membuat condition di Satu Sehat

### Observation
- `POST /api/satusehat/observation`: Membuat observation di Satu Sehat

## Fungsi Utama

### 1. Otentikasi
- Otomatisasi pengambilan token OAuth2
- Penyimpanan token dalam cache dengan manajemen kedaluwarsa
- Penanganan kesalahan otentikasi

### 2. Sinkronisasi Pasien
- Mentransformasi data pasien lokal ke format FHIR Patient
- Mengirim data pasien ke Satu Sehat
- Menyinkronkan perubahan data pasien

### 3. Encounter Management
- Mentransformasi data kunjungan ke format FHIR Encounter
- Mengirim data encounter ke Satu Sehat
- Melacak status sinkronisasi

### 4. Condition dan Observation
- Mentransformasi diagnosis dan observasi ke format FHIR
- Mengirim data ke Satu Sehat sesuai standar ICD-10 dan LOINC
- Menyinkronkan hasil pemeriksaan dan diagnosis

## Antarmuka Pengguna

Modul ini menyediakan antarmuka pengguna yang lengkap untuk:

- Pengaturan kredensial dan parameter koneksi
- Pemantauan status sinkronisasi
- Riwayat proses sinkronisasi
- Sinkronisasi bulk data pasien
- Troubleshooting dan informasi token

## Keamanan

- Kredensial disimpan secara aman di lingkungan server
- Token OAuth2 dikelola secara otomatis dengan caching
- Semua komunikasi dilakukan melalui HTTPS
- Implementasi logging untuk audit trail

## Error Handling

- Penanganan kesalahan otentikasi
- Logging kesalahan sinkronisasi
- Informasi kesalahan yang jelas untuk troubleshooting
- Status sinkronisasi untuk masing-masing entitas

## Penyesuaian untuk Tipe Faskes

Modul integrasi Satu Sehat menyesuaikan diri berdasarkan tipe faskes:
- Rumah Sakit: Mengirim semua jenis data (Patient, Encounter, Condition, Observation)
- Puskesmas: Fokus pada data pasien dan layanan preventif
- Klinik: Fokus pada data pasien dan pemeriksaan dasar
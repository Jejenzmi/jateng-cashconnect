# Dokumentasi Pengembangan Modul SIMRS ZEN

## Gambaran Umum

Dokumen ini memberikan ringkasan menyeluruh dari pengembangan modul-modul baru dalam sistem SIMRS ZEN, termasuk:

- Modul Manajemen (Manajemen Hak Akses, Modul, dan Konfigurasi berdasarkan tipe faskes)
- Modul CSSD (Central Sterile Supply Department)
- Modul Gizi Klinis
- Modul Rehab Medik (Fisioterapi)
- Modul Pelayanan Rohani
- Modul Psikologi Klinis

## Modul Manajemen

### Tujuan
Modul ini bertujuan untuk menyediakan sistem manajemen hak akses berbasis peran (RBAC) dan konfigurasi modul berdasarkan tipe fasilitas kesehatan.

### Komponen
- Sistem manajemen modul
- Sistem manajemen izin akses
- Sistem manajemen peran
- Sistem manajemen izin peran
- Sistem manajemen tipe faskes
- Sistem konfigurasi modul berdasarkan tipe faskes

### Database
Model-model yang dibuat:
- Module
- ModulePermission
- Role
- RolePermission
- FaskesType
- FaskesModuleConfig

### API Endpoints
- `/api/modules/modules` - CRUD untuk modul
- `/api/modules/module-permissions` - CRUD untuk izin modul
- `/api/modules/roles` - CRUD untuk peran
- `/api/modules/role-permissions` - CRUD untuk izin peran
- `/api/modules/faskes-types` - CRUD untuk tipe faskes
- `/api/modules/faskes-module-configs` - CRUD untuk konfigurasi modul faskes

## Modul CSSD (Central Sterile Supply Department)

### Tujuan
Modul ini bertujuan untuk mengelola proses sterilisasi alat-alat medis dan persediaan alat steril di CSSD.

### Komponen
- Manajemen instrumen/alat
- Manajemen proses sterilisasi
- Manajemen persediaan alat steril

### Database
Model-model yang dibuat:
- Instrument
- SterilizationProcess
- SterileInventory

### API Endpoints
- `/api/cssd/instruments` - CRUD untuk instrumen
- `/api/cssd/processes` - CRUD untuk proses sterilisasi
- `/api/cssd/inventory` - CRUD untuk persediaan steril

## Modul Gizi Klinis

### Tujuan
Modul ini bertujuan untuk mengelola asesmen gizi pasien dan perencanaan makanan berdasarkan kebutuhan medis pasien.

### Komponen
- Manajemen ahli gizi
- Manajemen asesmen gizi pasien
- Manajemen rencana makanan

### Database
Model-model yang dibuat:
- Nutritionist
- PatientNutritionAssessment
- MealPlan

### API Endpoints
- `/api/nutrition/nutritionists` - CRUD untuk ahli gizi
- `/api/nutrition/assessments` - CRUD untuk asesmen gizi pasien
- `/api/nutrition/meal-plans` - CRUD untuk rencana makanan

## Modul Rehab Medik (Fisioterapi)

### Tujuan
Modul ini bertujuan untuk mengelola terapi rehabilitasi medik seperti fisioterapi untuk pasien.

### Komponen
- Manajemen fisioterapis
- Manajemen sesi terapi
- Manajemen rencana perawatan

### Database
Model-model yang dibuat:
- Physiotherapist
- TherapySession
- TreatmentPlan

### API Endpoints
- `/api/rehabilitation/physiotherapists` - CRUD untuk fisioterapis
- `/api/rehabilitation/therapy-sessions` - CRUD untuk sesi terapi
- `/api/rehabilitation/treatment-plans` - CRUD untuk rencana perawatan

## Modul Pelayanan Rohani

### Tujuan
Modul ini bertujuan untuk mengelola pelayanan rohani/spiritual bagi pasien dan keluarga pasien selama masa perawatan.

### Komponen
- Manajemen petugas pelayanan rohani
- Manajemen permintaan pelayanan rohani
- Manajemen layanan rohani

### Database
Model-model yang dibuat:
- Clergy
- SpiritualRequest
- SpiritualService

### API Endpoints
- `/api/spiritual-care/clergy` - CRUD untuk petugas pelayanan rohani
- `/api/spiritual-care/requests` - CRUD untuk permintaan pelayanan
- `/api/spiritual-care/services` - CRUD untuk layanan rohani

## Modul Psikologi Klinis

### Tujuan
Modul ini bertujuan untuk mengelola layanan psikologi klinis termasuk terapi dan pelaporan perkembangan pasien.

### Komponen
- Manajemen psikolog
- Manajemen sesi terapi psikologi
- Manajemen laporan psikologi

### Database
Model-model yang dibuat:
- Psychologist
- PsychologySession
- PsychologyReport

### API Endpoints
- `/api/psychology/psychologists` - CRUD untuk psikolog
- `/api/psychology/sessions` - CRUD untuk sesi terapi
- `/api/psychology/reports` - CRUD untuk laporan psikologi

## Implementasi dan Integrasi

### Frontend
Semua modul telah diintegrasikan ke dalam sistem frontend SIMRS ZEN:
- Komponen dashboard untuk masing-masing modul
- Formulir untuk entri data
- Laporan dan ringkasan
- Sistem navigasi yang terintegrasi

### Backend
- Endpoint API yang aman dengan otentikasi dan otorisasi
- Validasi input yang ketat
- Sistem logging dan error handling
- Struktur database yang terintegrasi dengan skema keseluruhan

### Database
- Skema database yang terintegrasi dengan model-model lain
- Relasi antar entitas yang jelas
- Soft deletion untuk menjaga histori data
- Index untuk performa query optimal

## Kesimpulan

Dengan implementasi modul-modul di atas, SIMRS ZEN sekarang memiliki cakupan yang jauh lebih lengkap dalam manajemen pelayanan kesehatan, termasuk aspek non-medis seperti gizi, rehabilitasi, pelayanan rohani, dan psikologi. Sistem juga memiliki manajemen hak akses yang lebih baik untuk mengatur akses ke berbagai modul berdasarkan peran pengguna dan tipe fasilitas kesehatan.

Ini menjadikan SIMRS ZEN sebagai solusi SIMRS yang sangat komprehensif dan siap untuk digunakan di berbagai jenis fasilitas kesehatan.
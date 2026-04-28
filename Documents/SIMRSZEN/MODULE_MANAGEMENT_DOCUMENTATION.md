# Dokumentasi Modul Manajemen dan Konfigurasi Faskes

## Gambaran Umum

Modul manajemen dan konfigurasi faskes adalah bagian penting dari sistem SIMRS ZEN yang memungkinkan administrator untuk:

1. Mengelola modul-modul yang tersedia dalam sistem
2. Mengelola izin akses terhadap modul-modul tersebut
3. Mengelola peran (roles) dan hak aksesnya
4. Mengonfigurasi modul-modul berdasarkan tipe fasilitas kesehatan (faskes)

## Arsitektur Sistem

### Komponen Backend

#### Model Database
- `Module`: Menyimpan informasi tentang modul-modul yang tersedia
- `ModulePermission`: Menyimpan izin-izin yang tersedia untuk setiap modul
- `Role`: Menyimpan peran-peran pengguna dalam sistem
- `RolePermission`: Menghubungkan peran dengan izin-izin yang dimilikinya
- `FaskesType`: Menyimpan tipe-tipe fasilitas kesehatan
- `FaskesModuleConfig`: Mengonfigurasi modul-modul yang tersedia untuk setiap tipe faskes

#### Controllers
- `moduleController.ts`: Mengelola operasi CRUD untuk modul
- `modulePermissionController.ts`: Mengelola operasi CRUD untuk izin modul
- `roleController.ts`: Mengelola operasi CRUD untuk peran dan penugasan peran ke pengguna
- `rolePermissionController.ts`: Mengelola operasi CRUD untuk izin peran
- `faskesTypeController.ts`: Mengelola operasi CRUD untuk tipe faskes
- `faskesModuleConfigController.ts`: Mengelola konfigurasi modul berdasarkan tipe faskes

#### Routes
- `moduleRoutes.ts`: Menyediakan endpoint untuk semua operasi manajemen modul dan faskes

### Komponen Frontend

#### Komponen Utama
- `ModuleManagement.tsx`: Antarmuka untuk mengelola modul, izin modul, peran, dan izin peran
- `FaskesModuleConfig.tsx`: Antarmuka untuk mengonfigurasi modul berdasarkan tipe faskes
- `index.tsx`: Export komponen-komponen manajemen

#### Konfigurasi
- `modules.config.ts`: Menambahkan konfigurasi untuk modul manajemen
- `faskes-modules.config.ts`: Memperbarui konfigurasi untuk menyertakan modul manajemen
- `App.tsx`: Menambahkan route untuk komponen manajemen
- `DashboardLayout.tsx`: Memastikan menu modul manajemen muncul saat pengguna memiliki akses

## Endpoint API

### Manajemen Modul
- `GET /api/modules/modules` - Mendapatkan semua modul
- `GET /api/modules/modules/:id` - Mendapatkan modul berdasarkan ID
- `POST /api/modules/modules` - Membuat modul baru
- `PUT /api/modules/modules/:id` - Memperbarui modul
- `DELETE /api/modules/modules/:id` - Menghapus modul

### Manajemen Izin Modul
- `GET /api/modules/module-permissions` - Mendapatkan semua izin modul
- `GET /api/modules/module-permissions/:id` - Mendapatkan izin modul berdasarkan ID
- `POST /api/modules/module-permissions` - Membuat izin modul baru
- `PUT /api/modules/module-permissions/:id` - Memperbarui izin modul
- `DELETE /api/modules/module-permissions/:id` - Menghapus izin modul

### Manajemen Peran
- `GET /api/modules/roles` - Mendapatkan semua peran
- `GET /api/modules/roles/:id` - Mendapatkan peran berdasarkan ID
- `POST /api/modules/roles` - Membuat peran baru
- `PUT /api/modules/roles/:id` - Memperbarui peran
- `DELETE /api/modules/roles/:id` - Menghapus peran
- `POST /api/modules/roles/assign-to-user` - Menetapkan peran ke pengguna
- `DELETE /api/modules/roles/remove-from-user` - Menghapus peran dari pengguna

### Manajemen Izin Peran
- `GET /api/modules/role-permissions` - Mendapatkan semua izin peran
- `GET /api/modules/role-permissions/:id` - Mendapatkan izin peran berdasarkan ID
- `POST /api/modules/role-permissions` - Membuat izin peran baru
- `PUT /api/modules/role-permissions/:id` - Memperbarui izin peran
- `DELETE /api/modules/role-permissions/:id` - Menghapus izin peran

### Manajemen Tipe Faskes
- `GET /api/modules/faskes-types` - Mendapatkan semua tipe faskes
- `GET /api/modules/faskes-types/:id` - Mendapatkan tipe faskes berdasarkan ID
- `POST /api/modules/faskes-types` - Membuat tipe faskes baru
- `PUT /api/modules/faskes-types/:id` - Memperbarui tipe faskes
- `DELETE /api/modules/faskes-types/:id` - Menghapus tipe faskes

### Konfigurasi Modul Faskes
- `GET /api/modules/faskes-module-configs` - Mendapatkan semua konfigurasi modul faskes
- `GET /api/modules/faskes-module-configs/:id` - Mendapatkan konfigurasi modul faskes berdasarkan ID
- `POST /api/modules/faskes-module-configs` - Membuat konfigurasi modul faskes baru
- `PUT /api/modules/faskes-module-configs/:id` - Memperbarui konfigurasi modul faskes
- `DELETE /api/modules/faskes-module-configs/:id` - Menghapus konfigurasi modul faskes

## Fitur Utama

### 1. Manajemen Modul
- Menambah, mengedit, dan menghapus modul
- Mengaktifkan atau menonaktifkan modul
- Menetapkan kode unik dan nama deskriptif untuk setiap modul

### 2. Manajemen Izin Modul
- Membuat izin-izin spesifik untuk setiap modul
- Menautkan izin ke modul tertentu
- Mengelola deskripsi dan metadata izin

### 3. Manajemen Peran
- Membuat peran-peran pengguna (seperti administrator, staff medis, kasir, dll.)
- Menetapkan deskripsi dan status aktif/non-aktif untuk setiap peran
- Menetapkan peran ke pengguna

### 4. Manajemen Izin Peran
- Menetapkan izin-izin tertentu ke peran
- Mengatur akses CRUD (Create, Read, Update, Delete) untuk setiap izin peran
- Memastikan pengguna hanya memiliki akses sesuai peran mereka

### 5. Konfigurasi Modul Berdasarkan Tipe Faskes
- Mengelola tipe faskes (rumah sakit, puskesmas, klinik, laboratorium, radiologi)
- Mengonfigurasi modul-modul yang tersedia untuk setiap tipe faskes
- Mengaktifkan atau menonaktifkan modul tertentu untuk tipe faskes tertentu

## Implementasi Otentikasi dan Otorisasi

Modul manajemen dilindungi oleh middleware otentikasi (`authenticateToken`) sehingga hanya pengguna yang terotentikasi yang dapat mengakses endpoint. Selain itu, sistem otorisasi berbasis peran (RBAC) memastikan bahwa hanya pengguna dengan peran yang sesuai yang dapat melakukan operasi tertentu.

## Integrasi dengan Sistem Lain

Modul ini terintegrasi dengan:
- Sistem manajemen faskes untuk konfigurasi modul berdasarkan tipe faskes
- Sistem otentikasi untuk pengelolaan peran pengguna
- Sistem konfigurasi untuk mengatur tampilan modul di antarmuka pengguna

## Manfaat Sistem

Dengan sistem manajemen modul dan konfigurasi faskes ini, SIMRS ZEN:

1. Menjadi lebih fleksibel dalam mengatur akses ke fitur-fitur sistem
2. Dapat disesuaikan dengan kebutuhan spesifik dari berbagai tipe faskes
3. Memiliki kontrol granular terhadap hak akses pengguna
4. Memudahkan administrator dalam mengelola modul-modul sistem
5. Memastikan keamanan dan privasi data dengan kontrol akses yang ketat
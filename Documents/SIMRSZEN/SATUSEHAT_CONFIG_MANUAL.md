# Panduan Pengaturan Konfigurasi Satu Sehat - SIMRS ZEN

## Gambaran Umum

Mulai dari versi terbaru SIMRS ZEN, konfigurasi integrasi Satu Sehat disimpan secara persisten di database PostgreSQL. Hal ini memungkinkan administrator untuk mengelola kredensial dan parameter koneksi melalui antarmuka admin, serta memastikan konsistensi konfigurasi di seluruh instance aplikasi.

## Arsitektur Baru

### 1. Model Database
- **SatuSehatConfig**: Model baru untuk menyimpan konfigurasi integrasi Satu Sehat di database PostgreSQL
- Bidang yang disimpan: clientId, clientSecret, baseUrl, authUrl, organizationId, dan status aktif/non-aktif

### 2. Service Layer
- **SatuSehatConfigService**: Menyediakan fungsi untuk menyimpan, mengambil, dan menghapus konfigurasi dari database
- **SatuSehatAuthService**: Diperbarui untuk mengambil kredensial dari database daripada dari environment variables
- **SatuSehatService**: Diperbarui untuk mengambil konfigurasi (termasuk baseUrl dan organizationId) dari database

### 3. Endpoint API
- **POST /api/satusehat-config/**: Membuat atau memperbarui konfigurasi
- **GET /api/satusehat-config/**: Mendapatkan konfigurasi saat ini
- **DELETE /api/satusehat-config/**: Menghapus konfigurasi

### 4. Antarmuka Admin
- **SatuSehatConfig.tsx**: Komponen React untuk mengelola konfigurasi melalui antarmuka admin
- Akses melalui `/settings/satusehat`

## Cara Menggunakan

### 1. Akses Menu Pengaturan
- Login sebagai administrator
- Akses menu "Pengaturan Satu Sehat" di sidebar

### 2. Masukkan Kredensial
- **Client ID**: ID klien dari portal Satu Sehat
- **Client Secret**: Secret klien dari portal Satu Sehat
- **Organization ID**: ID organisasi dari portal Satu Sehat
- **Base URL**: URL dasar API FHIR Satu Sehat (default: https://api-satusehat.bpmn.io/fhir-r4)
- **Auth URL**: URL untuk otentikasi token (default: https://api-satusehat.bpmn.io/auth/realms/satusehat/protocol/openid-connect/token)
- **Status Aktif**: Centang kotak untuk mengaktifkan integrasi

### 3. Simpan Konfigurasi
- Klik tombol "Simpan Konfigurasi"
- Sistem akan menyimpan data ke database PostgreSQL

### 4. Verifikasi Integrasi
- Setelah menyimpan, integrasi akan menggunakan konfigurasi baru
- Gunakan halaman "Integrasi Satu Sehat" untuk menguji koneksi

## Keamanan

- Kredensial disimpan secara aman di database terenkripsi
- Tidak ada kredensial yang disimpan di kode sumber atau environment variables
- Akses ke halaman konfigurasi dibatasi untuk administrator saja
- Semua perubahan konfigurasi dilacak untuk audit trail

## Migrasi dari Konfigurasi Environment Variables

Jika sebelumnya konfigurasi disimpan di environment variables, sistem akan secara otomatis bermigrasi ke pendekatan berbasis database. Pastikan untuk:

1. Menyalin nilai-nilai konfigurasi dari environment ke antarmuka admin
2. Menghapus referensi environment variables lama setelah verifikasi
3. Menguji kembali semua fungsi integrasi

## Troubleshooting

Jika mengalami masalah:

1. Pastikan semua bidang wajib diisi
2. Verifikasi bahwa kredensial benar dan aktif
3. Periksa koneksi internet dan akses ke platform Satu Sehat
4. Lihat log server untuk informasi error lebih lanjut
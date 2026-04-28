# Dokumentasi API SIMRSZEN

## Daftar Isi
1. [Endpoint Umum](#endpoint-umum)
2. [Endpoint Otentikasi](#endpoint-otentikasi)
3. [Endpoint Pasien](#endpoint-pasien)
4. [Endpoint Kunjungan](#endpoint-kunjungan)
5. [Endpoint Item](#endpoint-item)
6. [Endpoint Resep](#endpoint-resep)
7. [Endpoint Laporan](#endpoint-laporan)
8. [Endpoint Satu Sehat](#endpoint-satu-sehat)
9. [Endpoint Profil Faskes](#endpoint-profil-faskes)

## Endpoint Umum

### Health Check
- `GET /health` - Memeriksa kesehatan sistem
- `GET /ready` - Memeriksa kesiapan sistem melayani permintaan

### Swagger Documentation
- `GET /api-docs` - Dokumentasi API interaktif

## Endpoint Otentikasi

### Login
- `POST /api/auth/login` - Autentikasi pengguna
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "user": {
        "id": "string",
        "email": "string",
        "fullName": "string",
        "isActive": boolean,
        "roles": ["string"]
      },
      "token": "string",
      "expiresIn": "string"
    }
    ```

### Register (jika diaktifkan)
- `POST /api/auth/register` - Registrasi pengguna baru

## Endpoint Pasien

### Mendapatkan Daftar Pasien
- `GET /api/patients` - Mendapatkan daftar pasien (memerlukan otentikasi)
  - Query Params:
    - `page` (opsional, default: 1)
    - `limit` (opsional, default: 10)
    - `search` (opsional, pencarian teks bebas)

### Mendapatkan Detail Pasien
- `GET /api/patients/:id` - Mendapatkan detail pasien berdasarkan ID

### Membuat Pasien Baru
- `POST /api/patients` - Membuat pasien baru
  - Request Body:
    ```json
    {
      "nama": "string",
      "nik": "string",
      "jenisKelamin": "string",
      "tanggalLahir": "date",
      "alamat": "string",
      "noHp": "string"
    }
    ```

## Endpoint Kunjungan

### Mendapatkan Daftar Kunjungan
- `GET /api/visits` - Mendapatkan daftar kunjungan (memerlukan otentikasi)

### Membuat Kunjungan Baru
- `POST /api/visits` - Membuat kunjungan baru
  - Request Body:
    ```json
    {
      "pasienId": "string",
      "tanggalKunjungan": "datetime",
      "keluhanUtama": "string",
      "diagnosa": "string",
      "dokterId": "string",
      "status": "string"
    }
    ```

## Endpoint Item

### Mendapatkan Daftar Item
- `GET /api/items` - Mendapatkan daftar item (obat, alat medis, dll)

### Membuat Item Baru
- `POST /api/items` - Membuat item baru
  - Request Body:
    ```json
    {
      "kodeItem": "string",
      "namaItem": "string",
      "jenisItem": "string",
      "harga": "number",
      "stok": "number"
    }
    ```

## Endpoint Resep

### Mendapatkan Daftar Resep
- `GET /api/prescriptions` - Mendapatkan daftar resep

### Membuat Resep Baru
- `POST /api/prescriptions` - Membuat resep baru
  - Request Body:
    ```json
    {
      "kunjunganId": "string",
      "itemId": "string",
      "jumlah": "number",
      "keterangan": "string"
    }
    ```

## Endpoint Laporan

### Mendapatkan Laporan Harian
- `GET /api/reports/daily` - Mendapatkan laporan harian

### Mendapatkan Laporan Bulanan
- `GET /api/reports/monthly` - Mendapatkan laporan bulanan

## Endpoint Satu Sehat

### Mendapatkan Konfigurasi Satu Sehat
- `GET /api/satusehat/settings` - Mendapatkan konfigurasi Satu Sehat (memerlukan otentikasi admin)

### Menyimpan Konfigurasi Satu Sehat
- `POST /api/satusehat/settings` - Menyimpan konfigurasi Satu Sehat (memerlukan otentikasi admin)
  - Request Body:
    ```json
    {
      "clientId": "string",
      "clientSecret": "string",
      "baseUrl": "string",
      "authUrl": "string",
      "organizationId": "string",
      "isActive": "boolean"
    }
    ```

### Uji Koneksi Satu Sehat
- `POST /api/satusehat/test-connection` - Menguji koneksi ke layanan Satu Sehat (memerlukan otentikasi admin)

## Endpoint Profil Faskes

### Mengecek Profil Faskes
- `GET /api/faskes-profile/check-profile` - Mengecek apakah profil Faskes sudah dibuat (tidak memerlukan otentikasi)

### Mendapatkan Profil Faskes
- `GET /api/faskes-profile` - Mendapatkan profil Faskes (memerlukan otentikasi)

### Menyimpan Profil Faskes
- `POST /api/faskes-profile` - Menyimpan profil Faskes (memerlukan otentikasi admin)
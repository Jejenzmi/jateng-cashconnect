# Dokumentasi API Integrasi BPJS

## Deskripsi
Dokumentasi ini menjelaskan endpoint-endpoint API yang tersedia untuk mengelola konfigurasi dan integrasi dengan layanan BPJS Kesehatan.

## Base URL
`https://api.simrszen.com/api/bpjs`

## Autentikasi
Autentikasi dilakukan dengan menyertakan header `X-API-Key` pada setiap permintaan.

## Rate Limiting
Endpoint memiliki pembatasan jumlah permintaan per IP per jam. Default adalah 1000 permintaan per jam.

## Endpoint

### 1. Konfigurasi BPJS

#### 1.1 Membuat Konfigurasi Baru
- **URL**: `/configs`
- **Method**: `POST`
- **Deskripsi**: Membuat konfigurasi baru untuk layanan BPJS

##### Request Headers
```
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

##### Request Body
```json
{
  "name": "VClaim Production",
  "consumerId": "1234567890",
  "consumerSecret": "your-secret-key",
  "username": "your-username",
  "password": "your-password",
  "userKey": "your-user-key",
  "baseUrl": "https://api.bpjs-kesehatan.go.id",
  "serviceName": "vclaim"
}
```

##### Response Success (201 Created)
```json
{
  "success": true,
  "message": "Konfigurasi BPJS berhasil dibuat",
  "data": {
    "id": "config-id-generated",
    "name": "VClaim Production",
    "baseUrl": "https://api.bpjs-kesehatan.go.id",
    "serviceName": "vclaim",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 1.2 Mendapatkan Konfigurasi Berdasarkan Nama
- **URL**: `/configs/:name`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan detail konfigurasi berdasarkan nama

#### 1.3 Mendapatkan Semua Konfigurasi
- **URL**: `/configs`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan semua konfigurasi BPJS

#### 1.4 Memperbarui Konfigurasi
- **URL**: `/configs/:name`
- **Method**: `PUT`
- **Deskripsi**: Memperbarui konfigurasi BPJS berdasarkan nama

#### 1.5 Menghapus Konfigurasi
- **URL**: `/configs/:name`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus konfigurasi BPJS berdasarkan nama

#### 1.6 Mengaktifkan/Nonaktifkan Konfigurasi
- **URL**: `/configs/:name/toggle`
- **Method**: `PATCH`
- **Deskripsi**: Mengaktifkan atau menonaktifkan konfigurasi BPJS

### 2. Log Aktivitas BPJS

#### 2.1 Mendapatkan Log Aktivitas
- **URL**: `/logs`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan log aktivitas berdasarkan filter

##### Parameters
- `serviceType`: Tipe layanan ('antrean', 'pcare', 'icare', 'medical_record', dll)
- `endpoint`: Endpoint yang diakses
- `statusCode`: Kode status HTTP
- `dateFrom`: Tanggal awal (format: YYYY-MM-DD)
- `dateTo`: Tanggal akhir (format: YYYY-MM-DD)
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)

#### 2.2 Mendapatkan Log Error
- **URL**: `/logs/error`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan log error saja

#### 2.3 Membersihkan Log Lama
- **URL**: `/logs/cleanup/:days`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus log yang lebih lama dari jumlah hari tertentu

#### 2.4 Mendapatkan Statistik Error
- **URL**: `/logs/stats`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan statistik error berdasarkan tipe layanan

### 3. Manajemen Cache BPJS

#### 3.1 Mendapatkan Semua Cache
- **URL**: `/cache`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan semua entry cache berdasarkan filter

##### Parameters
- `cacheKey`: Key cache untuk difilter
- `dateFrom`: Tanggal awal (format: YYYY-MM-DD)
- `dateTo`: Tanggal akhir (format: YYYY-MM-DD)
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)

#### 3.2 Mendapatkan Cache Berdasarkan Key
- **URL**: `/cache/:cacheKey`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan data cache berdasarkan key

#### 3.3 Menghapus Cache Berdasarkan Key
- **URL**: `/cache/:cacheKey`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus entry cache berdasarkan key

#### 3.4 Menghapus Semua Cache
- **URL**: `/cache/all`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus semua entry cache

#### 3.5 Membersihkan Cache Kadaluarsa
- **URL**: `/cache/cleanup`
- **Method**: `POST`
- **Deskripsi**: Membersihkan entry cache yang sudah kadaluarsa

### 4. Manajemen Antrian BPJS

#### 4.1 Mendapatkan Antrian
- **URL**: `/queue`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan daftar tugas dalam antrian berdasarkan filter

##### Parameters
- `serviceType`: Tipe layanan ('antrean', 'pcare', 'icare', 'medical_record', dll)
- `status`: Status tugas ('pending', 'processing', 'completed', 'failed')
- `dateFrom`: Tanggal awal (format: YYYY-MM-DD)
- `dateTo`: Tanggal akhir (format: YYYY-MM-DD)
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)

#### 4.2 Mendapatkan Antrian Berdasarkan ID
- **URL**: `/queue/:id`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan detail tugas dalam antrian berdasarkan ID

#### 4.3 Mencoba Ulang Tugas
- **URL**: `/queue/:id/retry`
- **Method**: `POST`
- **Deskripsi**: Mengatur ulang status tugas ke 'pending' untuk dicoba kembali

#### 4.4 Menghapus Tugas dari Antrian
- **URL**: `/queue/:id`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus tugas dari antrian

#### 4.5 Membersihkan Tugas yang Telah Selesai
- **URL**: `/queue/cleanup`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus tugas yang telah selesai dari antrian setelah jumlah hari tertentu

#### 4.6 Membersihkan Tugas yang Gagal
- **URL**: `/queue/cleanup/failed`
- **Method**: `DELETE`
- **Deskripsi**: Menghapus tugas yang gagal setelah jumlah percobaan maksimal

### 5. Sinkronisasi Data BPJS

#### 5.1 Sinkronisasi Kunjungan ke BPJS
- **URL**: `/sync/visit/:visitId`
- **Method**: `POST`
- **Deskripsi**: Memulai proses sinkronisasi data kunjungan ke BPJS

#### 5.2 Sinkronisasi Registrasi ke BPJS
- **URL**: `/sync/registration/:visitId`
- **Method**: `POST`
- **Deskripsi**: Memulai proses sinkronisasi data registrasi ke BPJS

#### 5.3 Sinkronisasi Tindakan ke BPJS
- **URL**: `/sync/treatment/:visitId`
- **Method**: `POST`
- **Deskripsi**: Memulai proses sinkronisasi data tindakan ke BPJS

#### 5.4 Mendapatkan Riwayat Sinkronisasi
- **URL**: `/sync/history/:visitId`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan riwayat sinkronisasi untuk kunjungan tertentu

#### 5.5 Memperbarui Status Sinkronisasi
- **URL**: `/sync/status/:syncRecordId`
- **Method**: `PUT`
- **Deskripsi**: Memperbarui status sinkronisasi berdasarkan ID record

### 6. Integrasi SATU SEHAT

#### 6.1 Kirim Data Pasien ke SATU SEHAT
- **URL**: `/integration/satusehat/patient/send/:patientId`
- **Method**: `POST`
- **Deskripsi**: Mengirim data pasien ke sistem SATU SEHAT

#### 6.2 Kirim Data Kunjungan ke SATU SEHAT
- **URL**: `/integration/satusehat/visit/send/:visitId`
- **Method**: `POST`
- **Deskripsi**: Mengirim data kunjungan ke sistem SATU SEHAT

#### 6.3 Sinkronisasi Batch ke SATU SEHAT
- **URL**: `/integration/satusehat/batch/sync`
- **Method**: `POST`
- **Deskripsi**: Melakukan sinkronisasi batch data ke sistem SATU SEHAT

### 7. Integrasi IDRG (INA-DRG)

#### 7.1 Klasifikasi IDRG
- **URL**: `/integration/idrg/classify/:visitId`
- **Method**: `POST`
- **Deskripsi**: Melakukan klasifikasi INA-DRG berdasarkan data kunjungan

#### 7.2 Submit Klaim IDRG
- **URL**: `/integration/idrg/submit/:visitId`
- **Method**: `POST`
- **Deskripsi**: Mengirim klaim IDRG ke server

#### 7.3 Cek Status Klaim IDRG
- **URL**: `/integration/idrg/status/:noKlaim`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan status klaim IDRG berdasarkan nomor klaim

#### 7.4 Riwayat Klaim IDRG Pasien
- **URL**: `/integration/idrg/history/:patientId`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan riwayat klaim IDRG untuk pasien tertentu

### 8. Integrasi E-Claim BPJS

#### 8.1 Buat SEP (Surat Eligibilitas Peserta)
- **URL**: `/integration/eclaim/sep/create/:visitId`
- **Method**: `POST`
- **Deskripsi**: Membuat Surat Eligibilitas Peserta untuk kunjungan

#### 8.2 Submit Klaim E-Claim
- **URL**: `/integration/eclaim/submit/:visitId`
- **Method**: `POST`
- **Deskripsi**: Mengirim klaim E-Claim ke server BPJS

#### 8.3 Update Klaim E-Claim
- **URL**: `/integration/eclaim/update/:noKlaim`
- **Method**: `PUT`
- **Deskripsi**: Memperbarui klaim E-Claim yang sudah dikirim

#### 8.4 Cek Status Klaim E-Claim
- **URL**: `/integration/eclaim/status/:noKlaim`
- **Method**: `GET`
- **Deskripsi**: Mendapatkan status klaim E-Claim berdasarkan nomor klaim

#### 8.5 Cek Eligibilitas Peserta
- **URL**: `/integration/eclaim/eligibility?noKartu={noKartu}&tglKunjungan={tglKunjungan}`
- **Method**: `GET`
- **Deskripsi**: Memeriksa kepesertaan BPJS berdasarkan nomor kartu dan tanggal kunjungan

## Error Codes

| Kode HTTP | Deskripsi |
|-----------|-----------|
| 200 | Permintaan berhasil diproses |
| 201 | Data berhasil dibuat |
| 400 | Permintaan tidak valid (misalnya data tidak lengkap) |
| 401 | Tidak memiliki izin (API Key salah) |
| 404 | Data tidak ditemukan |
| 429 | Terlalu banyak permintaan (rate limit exceeded) |
| 500 | Kesalahan server internal |

## Logging
Semua permintaan ke endpoint BPJS dicatat dalam sistem logging kami untuk tujuan audit dan troubleshooting.

## Keamanan
- Pastikan untuk menyimpan API key dengan aman
- Jangan menyertakan credential BPJS dalam permintaan dari sisi klien
- Gunakan HTTPS untuk semua permintaan
- Rotasi API key secara berkala
# Dokumentasi API SIMRS ZEN

## Base URL
Production: `https://api.simrszen.com/v1`
Development: `http://localhost:3001/api`

## Authentication
Semua endpoint memerlukan token autentikasi kecuali `/auth/login` dan `/auth/register`.

Untuk mengakses endpoint yang dilindungi, tambahkan header:
```
Authorization: Bearer <token>
```

## Endpoints

### Autentikasi
#### POST /auth/login
Login pengguna dan mendapatkan token JWT

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "fullName": "string"
    }
  }
}
```

#### POST /auth/register
Mendaftarkan pengguna baru

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

### Pasien
#### GET /patients
Mendapatkan daftar pasien

**Query Parameters:**
- `limit`: jumlah data per halaman (default: 10)
- `page`: nomor halaman (default: 1)
- `search`: pencarian teks bebas

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "data": [
    {
      "id": "string",
      "nama": "string",
      "nik": "string",
      "jenisKelamin": "L" | "P",
      "tanggalLahir": "datetime",
      "alamat": "string"
    }
  ]
}
```

#### POST /patients
Membuat pasien baru

**Body:**
```json
{
  "nik": "string",
  "nama": "string",
  "jenisKelamin": "L" | "P",
  "tanggalLahir": "datetime",
  "alamat": "string",
  "noHp": "string",
  "pekerjaan": "string"
}
```

### Kunjungan
#### GET /visits
Mendapatkan daftar kunjungan

**Query Parameters:**
- `patientId`: filter berdasarkan pasien
- `statusKunjungan`: filter berdasarkan status kunjungan

#### POST /visits
Membuat kunjungan baru

**Body:**
```json
{
  "patientId": "string",
  "poliId": "string",
  "dokterId": "string",
  "catatan": "string"
}
```

### Rekam Medis
#### GET /medical-records
Mendapatkan daftar rekam medis

**Query Parameters:**
- `patientId`: filter berdasarkan pasien
- `visitId`: filter berdasarkan kunjungan

#### POST /medical-records
Membuat rekam medis baru

**Body:**
```json
{
  "patientId": "string",
  "visitId": "string",
  "dokterId": "string",
  "pegawaiId": "string",
  "subjectif": "string",
  "objektif": "string",
  "asesmen": "string",
  "planning": "string"
}
```

### Farmasi
#### GET /prescriptions
Mendapatkan daftar resep

**Query Parameters:**
- `patientId`: filter berdasarkan pasien
- `visitId`: filter berdasarkan kunjungan

#### POST /prescriptions
Membuat resep baru

**Body:**
```json
{
  "patientId": "string",
  "visitId": "string",
  "itemId": "string",
  "jumlah": "number",
  "keterangan": "string",
  "aturanPakai": "string"
}
```

### Laboratorium
#### GET /laboratory-tests
Mendapatkan daftar pemeriksaan laboratorium

#### POST /laboratory-tests
Membuat permintaan pemeriksaan laboratorium baru

**Body:**
```json
{
  "patientId": "string",
  "visitId": "string",
  "kodePermintaan": "string",
  "tanggalPermintaan": "datetime",
  "status": "pending" | "process" | "completed"
}
```

### Radiologi
#### GET /radiology-exams
Mendapatkan daftar pemeriksaan radiologi

#### POST /radiology-exams
Membuat permintaan pemeriksaan radiologi baru

**Body:**
```json
{
  "patientId": "string",
  "visitId": "string",
  "kodePermintaan": "string",
  "tanggalPermintaan": "datetime",
  "status": "pending" | "process" | "completed"
}
```

### Integrasi BPJS
Endpoint BPJS memerlukan konfigurasi BPJS aktif di database.

#### GET /bpjs/pasien/{noKartu}
Mendapatkan data pasien dari BPJS berdasarkan nomor kartu

#### POST /bpjs/antrean
Membuat antrean di BPJS

**Body:**
```json
{
  "kodebooking": "string",
  "jenispasien": "string",
  "nomorkartu": "string",
  "nik": "string",
  "nohp": "string",
  "kodepoli": "string",
  "namapoli": "string",
  "pasienbaru": 0 | 1,
  "norm": "string",
  "tanggalperiksa": "date",
  "kodedokter": "string",
  "namadokter": "string",
  "jampraktek": "string",
  "jeniskunjungan": 1 | 2 | 3,
  "nomorreferensi": "string",
  "nomorantrean": "string",
  "angkaantrean": "number",
  "estimasidilayani": "datetime",
  "sisakuotajkn": "number",
  "kuotajkn": "number",
  "keterangan": "string"
}
```

## Error Response Format
Umumnya, semua endpoint mengembalikan error dalam format berikut:

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error
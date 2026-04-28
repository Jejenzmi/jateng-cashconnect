# Dokumentasi API SIMRS ZEN

Dokumentasi ini menjelaskan endpoint-endpoint API untuk berbagai modul dalam sistem SIMRS ZEN.

## 1. Autentikasi

Semua endpoint memerlukan token autentikasi kecuali endpoint login.

```
Authorization: Bearer {token}
```

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "roles": ["string"],
    "permissions": ["string"]
  }
}
```

## 2. Modul Rawat Inap

### Manajemen Kamar
```
GET /api/inpatient/rooms
GET /api/inpatient/rooms/:id
POST /api/inpatient/rooms
PUT /api/inpatient/rooms/:id
DELETE /api/inpatient/rooms/:id
```

### Manajemen Pasien Rawat Inap
```
GET /api/inpatient/patients
GET /api/inpatient/patients/:id
POST /api/inpatient/patients
PUT /api/inpatient/patients/:id
DELETE /api/inpatient/patients/:id
```

### Monitoring Pasien
```
GET /api/inpatient/monitoring/:patientId
POST /api/inpatient/vitals/:patientId
```

## 3. Modul Farmasi

### Manajemen Obat
```
GET /api/pharmacy/medicines
GET /api/pharmacy/medicines/:id
POST /api/pharmacy/medicines
PUT /api/pharmacy/medicines/:id
DELETE /api/pharmacy/medicines/:id
```

### Manajemen Resep
```
GET /api/pharmacy/prescriptions
GET /api/pharmacy/prescriptions/:id
POST /api/pharmacy/prescriptions
PUT /api/pharmacy/prescriptions/:id
DELETE /api/pharmacy/prescriptions/:id
```

### Inventaris Obat
```
GET /api/pharmacy/inventory
GET /api/pharmacy/inventory/:medicineId
PUT /api/pharmacy/inventory/:medicineId
```

## 4. Modul Radiologi

### Manajemen Permintaan Pemeriksaan
```
GET /api/radiology/requests
GET /api/radiology/requests/:id
POST /api/radiology/requests
PUT /api/radiology/requests/:id
DELETE /api/radiology/requests/:id
```

### Manajemen Peralatan
```
GET /api/radiology/equipment
GET /api/radiology/equipment/:id
POST /api/radiology/equipment
PUT /api/radiology/equipment/:id
DELETE /api/radiology/equipment/:id
```

### Integrasi PACS
```
GET /api/radiology/images/:studyId
GET /api/radiology/studies/:patientId
POST /api/radiology/upload
```

## 5. Modul Keuangan

### Laporan Keuangan
```
GET /api/finance/reports/profit-loss
GET /api/finance/reports/balance-sheet
GET /api/finance/reports/cash-flow
```

### Manajemen Gaji
```
GET /api/finance/payroll
GET /api/finance/payroll/:employeeId
POST /api/finance/payroll/process
```

### Transaksi
```
GET /api/finance/transactions
POST /api/finance/transactions
PUT /api/finance/transactions/:id
```

## 6. Modul IGD

### Manajemen Kasus Darurat
```
GET /api/emergency/cases
GET /api/emergency/cases/:id
POST /api/emergency/cases
PUT /api/emergency/cases/:id
DELETE /api/emergency/cases/:id
```

### Manajemen Fasilitas IGD
```
GET /api/emergency/resources
GET /api/emergency/resources/:id
PUT /api/emergency/resources/:id
```

### Layanan Ambulans
```
GET /api/emergency/ambulance
GET /api/emergency/ambulance/:id
POST /api/emergency/ambulance
PUT /api/emergency/ambulance/:id
```

## 7. Integrasi Nasional

### BPJS
```
GET /api/integrations/bpjs/peserta/:nik
GET /api/integrations/bpjs/antrian/fasyankes
POST /api/integrations/bpjs/antrian
```

### SATU SEHAT
```
POST /api/integrations/satusehat/sync
GET /api/integrations/satusehat/status
```

## Error Response Format

Semua error API mengikuti format berikut:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Deskripsi error",
    "details": {}
  }
}
```
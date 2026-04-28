# Panduan Implementasi Teknis Sistem SIMRS Zen

Dokumen ini menjelaskan secara rinci langkah-langkah teknis untuk mengimplementasikan sistem SIMRS Zen agar siap digunakan dalam lingkungan produksi tanpa bug dan error.

## 1. Arsitektur Sistem

### 1.1 Backend (Node.js + TypeScript + Express)
- Framework: Express.js dengan TypeScript
- Database: PostgreSQL dengan Prisma ORM
- Authentication: JWT (JSON Web Tokens) dengan refresh token mechanism
- Logging: Winston logger dengan level berdasarkan environment
- Validation: Zod untuk request validation

### 1.2 Frontend (React + TypeScript + Tailwind)
- Framework: React 18+ dengan Vite
- State Management: React Context API dan React Hooks
- Styling: Tailwind CSS dengan komponen berbasis Radix UI
- Icons: Lucide React
- HTTP Requests: Axios dengan interceptors

### 1.3 Infrastructure
- Containerization: Docker dan Docker Compose
- CI/CD: GitHub Actions
- Monitoring: Prometheus + Grafana (opsional)
- Reverse Proxy: Nginx

## 2. Pengembangan Backend

### 2.1 Struktur Direktori Backend
```
backend/
├── src/
│   ├── config/           # Konfigurasi aplikasi
│   ├── controllers/      # Logika bisnis
│   ├── middleware/       # Middleware (auth, validation, logging)
│   ├── routes/          # Definisi route
│   ├── services/        # Business logic yang reusable
│   ├── utils/          # Helper functions
│   ├── types/          # Type definitions
│   └── app.ts          # Entry point aplikasi
├── prisma/
│   ├── schema.prisma    # Schema database
│   └── seed.ts         # Initial data
├── .env.example        # Contoh environment variables
├── Dockerfile
└── package.json
```

### 2.2 Konfigurasi TypeScript dan Prisma
Ikuti standar TypeScript + Prisma backend development:
- Semua file TS harus menggunakan strict mode
- Hindari TS6133 warning (gunakan `_req` untuk parameter yang tidak digunakan)
- Di `src/routes/*.ts`, gunakan Prisma Client
- Model harus cocok dengan `prisma/schema.prisma`
- Field Prisma harus cocok dengan definisi schema
- Route harus di-export dengan benar (misalnya `export default router`)

### 2.3 Migrasi Database
Ketika menambahkan model baru (seperti `HospitalProfile`), ikuti urutan:
1. `npx prisma generate` - Update Prisma Client
2. `npx prisma migrate dev --name <name>` - Buat dan jalankan migrasi
3. Restart service backend

### 2.4 Validasi Input dan Sanitasi
Gunakan Zod untuk validasi request body, params, dan query:
```typescript
import { z } from 'zod';

const CreatePatientSchema = z.object({
  name: z.string().min(1, "Nama pasien wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh angka"),
  phone: z.string().optional(),
  address: z.string().optional()
});

app.post('/api/patients', async (req, res) => {
  try {
    const validatedData = CreatePatientSchema.parse(req.body);
    // Lanjutkan ke logika bisnis
  } catch (error) {
    // Tangani error validasi
  }
});
```

## 3. Pengembangan Frontend

### 3.1 Struktur Direktori Frontend
```
simrs-zen/
├── src/
│   ├── components/     # Komponen reusable
│   ├── pages/         # Halaman aplikasi
│   ├── hooks/         # Custom React hooks
│   ├── services/      # Service API calls
│   ├── types/         # Type definitions (ikuti TypeScript type definition centralization)
│   ├── utils/         # Helper functions
│   ├── contexts/      # React Context
│   ├── config/        # Konfigurasi aplikasi
│   └── App.tsx        # Root component
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

### 3.2 Penanganan Error dan Loading States
```tsx
// Contoh komponen dengan error handling dan loading state
import { useState, useEffect } from 'react';
import { Patient } from '../types/patient'; // Gunakan type definition terpusat

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (err) {
        setError('Gagal memuat data pasien');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
};
```

### 3.3 API Calls dengan Error Handling
Gunakan service layer untuk mengelola API calls:
```tsx
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 10 detik timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 4. Penanganan Error dan Debugging

### 4.1 Error Diagnosis Priority (Frontend)
1. Missing dependencies - Install paket yang hilang (`npm install @radix-ui/react-popover`)
2. Template string pollution - Gunakan `grep` untuk mencari kata-kata Indonesia dalam template literals
3. Icon exports not found - Gunakan alternatif icon jika tidak ditemukan di lucide-react
4. JSX/TSX structural errors - Pastikan semua tag ditutup dengan benar

### 4.2 Error Diagnosis Priority (Backend)
1. Pastikan semua environment variables terisi di `.env`
2. Validasi model Prisma sesuai dengan `prisma/schema.prisma`
3. Pastikan field-field sesuai antara schema dan query
4. Pastikan semua route terdaftar dan bisa diakses

## 5. Testing Strategy

### 5.1 Unit Testing
- Gunakan Jest untuk unit testing
- Target coverage 80%+
- Test semua business logic functions
- Mock external dependencies

### 5.2 Integration Testing
- Test endpoint API
- Test integration database
- Test authentication flow
- Test error responses

### 5.3 End-to-End Testing
- Gunakan Cypress untuk E2E testing
- Test user workflows
- Test form submissions
- Test navigation flows

## 6. Deployment dan Production Readiness

### 6.1 Production Checklist
Sistem harus memenuhi 8 dimensi kesiapan produksi:
1. **Security**: Session management kuat, proteksi SQL injection/XSS/CSRF, CORS ketat, validasi input
2. **Logging & Monitoring**: Audit log lengkap, monitoring kinerja aplikasi, alert untuk error dan downtime
3. **Testing**: Unit test untuk fungsi inti, integrasi API end-to-end, E2E test untuk workflow kritis
4. **Production Config**: Konfigurasi web server optimal, SSL/HTTPS wajib, environment vars terpisah, backup & recovery strategy
5. **Performance**: Indeks database untuk query frekuens tinggi, strategi caching, optimasi aset statis, connection pooling
6. **Error Handling**: Error capture yang robust, pesan error friendly untuk user, kemampuan degrade saat partial failure
7. **Documentation**: Dokumentasi API lengkap, manual deployment, manual operasional, disaster recovery procedures
8. **Backup Strategy**: Backup otomatis terjadwal, validasi recovery procedure rutin, backup off-site

### 6.2 Environment Variables
Pastikan environment variables berikut tersedia:
```bash
# Backend
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/simrszen"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Frontend (di .env)
VITE_API_BASE_URL="http://localhost:3001/api"
VITE_APP_NAME="SIMRS Zen"
```

### 6.3 Health Check Endpoint
Tambahkan health check endpoint untuk memonitor status sistem:
```typescript
// backend/src/routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', async (_req, res) => {
  // Tambahkan cek koneksi database jika perlu
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
```

## 7. Quality Assurance dan Continuous Improvement

### 7.1 Code Review Process
- Semua perubahan harus melalui code review
- Gunakan checklist standar: error handling, security, performance
- Pastikan dokumentasi tetap update

### 7.2 Monitoring dan Maintenance
- Audit log secara berkala
- Monitor kinerja sistem
- Update dependencies secara berkala
- Backup verification rutin

Dengan mengikuti panduan teknis ini, sistem SIMRS Zen akan menjadi sistem yang stabil, aman, dan bebas bug/error dalam lingkungan produksi.
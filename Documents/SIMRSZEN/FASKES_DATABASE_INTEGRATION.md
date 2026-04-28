# Integrasi Database untuk Profil Faskes - SIMRS ZEN

## Gambaran Umum

Fitur profil faskes sekarang sepenuhnya terintegrasi dengan database PostgreSQL melalui Prisma ORM. Data yang diinput dari halaman setup akan disimpan secara persisten ke database dan dapat diakses secara konsisten di seluruh aplikasi.

## Arsitektur Integrasi

### 1. Skema Database
Model `FaskesProfile` ditambahkan ke skema Prisma:
```prisma
model FaskesProfile {
  id              String   @id @default(cuid())
  name            String
  type            String   // A, B, C, D, FKTP, KLINIK, PUSKESMAS
  address         String
  city            String
  province        String
  phone           String
  email           String
  licenseNumber   String
  operationalSince DateTime
  capacity        Int?
  director        String
  description     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("faskes_profiles")
}
```

### 2. Service Layer
`FaskesProfileService` menyediakan metode untuk:
- `createOrUpdate`: Membuat atau memperbarui profil faskes dengan validasi input
- `getProfile`: Mengambil profil faskes yang tersimpan

### 3. Controller Layer
`FaskesProfileController` menyediakan endpoint API:
- `POST /api/faskes-profile`: Membuat atau memperbarui profil faskes
- `GET /api/faskes-profile`: Mengambil profil faskes

### 4. Frontend Integration
- Komponen `FaskesProfileSetup.tsx` mengirim data ke endpoint API
- Komponen `FaskesProfileView.tsx` mengambil data dari endpoint API
- Komponen `DashboardByFaskesType.tsx` mengambil profil untuk menyesuaikan tampilan

## Alur Data

1. **Input Data**: Superadmin mengisi formulir di halaman `/setup`
2. **Validasi**: Data divalidasi menggunakan Zod di backend
3. **Penyimpanan**: Data disimpan ke tabel `faskes_profiles` di PostgreSQL
4. **Pengambilan**: Data diambil kembali saat:
   - Mengakses halaman `/profile`
   - Memuat dashboard di `/`
   - Sebagai fallback, data juga disimpan ke localStorage
5. **Penyesuaian UI**: Dashboard menyesuaikan tampilan berdasarkan tipe faskes

## Endpoint API

### POST `/api/faskes-profile`
- Request body: Objek FaskesProfile lengkap
- Response: `{ success: boolean, message: string, data: FaskesProfile }`

### GET `/api/faskes-profile`
- Response: `{ success: boolean, message: string, data: FaskesProfile }`

## Validasi Input

Input diverifikasi menggunakan Zod schema:
- `name`, `type`, `address`, `city`, `province`, `phone`, `email`, `licenseNumber`, `operationalSince`, dan `director` wajib diisi
- `email` harus dalam format yang valid
- `type` harus salah satu dari: A, B, C, D, FKTP, KLINIK, PUSKESMAS
- `operationalSince` harus dalam format tanggal yang valid
- `capacity` harus bilangan non-negatif (jika disediakan)

## Error Handling

- Jika validasi gagal, service mengembalikan pesan kesalahan spesifik
- Jika terjadi kesalahan server, controller mengembalikan status 500
- Di frontend, error ditampilkan menggunakan toast notification

## Migrasi Database

Perintah untuk sinkronisasi skema:
```bash
cd backend
npx prisma db push        # Sinkronisasi skema ke database
npx prisma generate       # Generate ulang Prisma Client
```

## Manfaat Integrasi

1. **Persistensi Data**: Data profil faskes disimpan permanen di database
2. **Konsistensi**: Data dapat diakses secara konsisten di seluruh aplikasi
3. **Sinkronisasi**: Beberapa pengguna atau sesi akan melihat data yang sama
4. **Audit Trail**: Data perubahan dicatat (createdAt, updatedAt)
5. **Validasi Server-side**: Data dicek di sisi server untuk keamanan
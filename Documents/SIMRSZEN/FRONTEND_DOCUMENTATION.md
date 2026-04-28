# Dokumentasi Frontend SIMRS ZEN

## Struktur Proyek

```
src/
├── components/           # Komponen UI utama
│   ├── dashboard/       # Komponen dashboard
│   ├── patient/         # Komponen manajemen pasien
│   ├── registration/    # Komponen registrasi
│   ├── medical-record/  # Komponen rekam medis
│   ├── pharmacy/        # Komponen farmasi
│   ├── billing/         # Komponen keuangan
│   ├── user/            # Komponen manajemen pengguna
│   ├── layout/          # Komponen layout
│   └── ui/              # Komponen UI primitif
├── hooks/               # Custom hooks
├── types/               # Definisi tipe TypeScript
├── lib/                 # Fungsi utilitas
├── config/              # Konfigurasi aplikasi
└── pages/               # Komponen halaman (jika digunakan)
```

## Teknologi yang Digunakan

- **React** v18+ - Framework JavaScript
- **TypeScript** - Superset JavaScript dengan pengecekan tipe
- **Tailwind CSS** - Framework styling
- **Radix UI** - Primitif komponen tanpa gaya
- **Shadcn/ui** - Komponen UI pra-dibangun
- **React Router** - Navigasi antar halaman
- **TanStack Query (React Query)** - Pengelolaan state asinkron
- **Axios** - Klien HTTP untuk permintaan API
- **Lucide React** - Ikon-ikon sederhana

## Konfigurasi Lingkungan

File `.env` harus berisi:

```env
VITE_API_URL=http://localhost:3001/api  # URL backend API
VITE_APP_NAME=SIMRS ZEN                # Nama aplikasi
VITE_BASE_URL=http://localhost:8080    # URL basis aplikasi
```

## Konvensi Penamaan

- Nama file komponen menggunakan PascalCase: `PatientManagement.tsx`
- Hook kustom menggunakan prefiks `use`: `usePatientData.ts`
- Tipe data menggunakan PascalCase: `Patient.ts`
- Fungsi utilitas menggunakan camelCase: `formValidation.ts`

## Arsitektur Modular

Aplikasi ini dirancang dengan arsitektur modular yang terdiri dari beberapa modul utama:

### 1. Modul Pasien
- Manajemen data pasien
- Pencarian dan filter pasien
- Formulir pendaftaran pasien

### 2. Modul Registrasi
- Pendaftaran kunjungan pasien
- Manajemen antrian
- Status pemeriksaan

### 3. Modul Rekam Medis
- Catatan medis pasien
- Riwayat pemeriksaan
- Diagnosa dan pengobatan

### 4. Modul Farmasi
- Inventaris obat
- Distribusi obat
- Manajemen stok

### 5. Modul Keuangan
- Pembuatan tagihan
- Metode pembayaran
- Laporan keuangan

### 6. Modul Pengguna
- Manajemen akun pengguna
- Hak akses berdasarkan peran
- Autentikasi dan otorisasi

## Penggunaan Komponen

### Komponen Manajemen Data
Setiap modul memiliki komponen manajemen data yang terdiri dari:

- Tabel data utama
- Formulir untuk menambah/edit data
- Dialog detail data
- Filter dan pencarian
- Statistik dan grafik

### Hook Kustom
Hook kustom disediakan untuk mengelola state data:

```typescript
import usePatientData from '@/hooks/usePatientData';

const MyComponent = () => {
  const { 
    patients, 
    filteredPatients, 
    loading, 
    error, 
    setSearchTerm 
  } = usePatientData();
  
  // Gunakan data dalam komponen
};
```

### Tipe Data
Tipe data didefinisikan di folder `types/`:

```typescript
// types/patient.ts
export interface Patient {
  id: string;
  medicalRecordNo: string;
  fullName: string;
  nik: string;
  birthDate: string;
  gender: 'L' | 'P';
  phone: string;
  address: string;
  bpjsNumber?: string;
  bloodType?: string;
  allergies?: string;
  registrationDate: string;
}
```

## Validasi Formulir

Validasi formulir dilakukan menggunakan fungsi utilitas:

```typescript
import { validateNIK, validatePhone, validateEmail } from '@/lib/form-validation';

// Contoh validasi
if (!validateNIK(nik)) {
  setError('NIK tidak valid');
}
```

## API Client

Komunikasi dengan backend menggunakan API client yang terletak di `lib/api-client.ts`:

```typescript
import apiClient from '@/lib/api-client';

try {
  const response = await apiClient.get('/patients');
  console.log(response.data);
} catch (error) {
  console.error('Error fetching patients:', error);
}
```

## Deployment

Untuk build aplikasi untuk produksi:

```bash
npm run build
```

Hasil build akan berada di folder `dist/`.

## Kontribusi

1. Buat branch fitur baru
2. Lakukan perubahan
3. Pastikan semua tes lulus
4. Kirim pull request
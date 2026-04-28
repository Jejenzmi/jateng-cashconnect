# Konfigurasi Modul Berdasarkan Tipe Fasilitas Kesehatan (Faskes)

## Gambaran Umum

Dokumen ini menjelaskan sistem konfigurasi modul berdasarkan tipe fasilitas kesehatan (Faskes) dalam sistem SIMRS ZEN. Sistem ini memungkinkan penyesuaian modul-modul yang tampil sesuai dengan tipe faskes yang diatur dalam profil faskes awal, termasuk penyesuaian integrasi BPJS (PCare hanya untuk Klinik dan Rumah Sakit, VClaim hanya untuk Rumah Sakit).

## Struktur File

- `src/config/faskes-modules.config.ts`: Konfigurasi utama untuk modul-modul berdasarkan tipe faskes
- `src/components/shared/ModuleVisibilityManager.tsx`: Komponen dan context untuk mengatur visibilitas modul
- `src/components/layout/DashboardLayout.tsx`: Layout dashboard yang menampilkan modul-modul sesuai tipe faskes
- `src/config/clinical-psychology-module.config.ts`: Konfigurasi modul Psikologi Klinis
- `src/config/spiritual-care-module.config.ts`: Konfigurasi modul Pelayanan Rohani

## Tipe Faskes yang Didukung

1. **Rumah Sakit**
   - Level: Tersier
   - Kategori: Rumah Sakit
   - Modul yang diaktifkan: Semua modul lengkap
   - Integrasi BPJS: PCare, VClaim, iCare, Antrean Online (semua aktif)

2. **Puskesmas**
   - Level: Primer
   - Kategori: Puskesmas
   - Modul yang diaktifkan: Modul inti seperti manajemen pasien, rawat jalan, laboratorium, dll
   - Integrasi BPJS: iCare dan Antrean Online aktif, PCare dan VClaim nonaktif

3. **Klinik**
   - Level: Primer atau Sekunder
   - Kategori: Klinik
   - Modul yang diaktifkan: Modul inti seperti manajemen pasien, rawat jalan, dll
   - Integrasi BPJS: PCare, iCare, dan Antrean Online aktif, VClaim nonaktif

4. **Laboratorium**
   - Level: Primer
   - Kategori: Laboratorium
   - Modul yang diaktifkan: Laboratorium, manajemen pasien, dan pelaporan
   - Integrasi BPJS: iCare aktif, sisanya nonaktif

5. **Radiologi**
   - Level: Primer
   - Kategori: Radiologi
   - Modul yang diaktifkan: Radiologi, manajemen pasien, dan pelaporan
   - Integrasi BPJS: iCare aktif, sisanya nonaktif

## Aturan Integrasi BPJS

- **PCare**: Hanya diaktifkan untuk Klinik dan Rumah Sakit (tidak untuk Puskesmas, Laboratorium, atau Radiologi)
- **VClaim**: Hanya diaktifkan untuk Rumah Sakit (tidak untuk Klinik, Puskesmas, Laboratorium, atau Radiologi)
- **iCare**: Diaktifkan untuk semua tipe faskes yang terdaftar di BPJS
- **Antrean Online**: Diaktifkan untuk Faskes yang melayani pasien langsung (Rumah Sakit, Puskesmas, Klinik)

## Implementasi

### Context Provider

Sistem menggunakan `ModuleVisibilityProvider` untuk mengelola state konfigurasi faskes dan visibilitas modul:

```typescript
const ModuleVisibilityContext = createContext<ModuleVisibilityContextType | undefined>(undefined);

export const ModuleVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ...
};
```

### Fungsi Utilitas

Beberapa fungsi utilitas disediakan untuk manajemen modul:

- `getModulesForFaskesType(faskesTypeId)`: Mendapatkan daftar modul yang diizinkan untuk tipe faskes tertentu
- `getBpjsConfigForFaskesType(faskesTypeId)`: Mendapatkan konfigurasi integrasi BPJS untuk tipe faskes tertentu
- `isModuleAllowedForFaskes(moduleCode, faskesTypeId)`: Mengecek apakah modul tertentu diizinkan untuk tipe faskes tertentu
- `isBpjsIntegrationAllowed(integration, faskesTypeId)`: Mengecek apakah integrasi BPJS tertentu diizinkan untuk tipe faskes tertentu

### Penyimpanan Konfigurasi

Tipe faskes yang dipilih disimpan di localStorage dan dimuat ulang saat aplikasi dimulai:

```typescript
useEffect(() => {
  const savedFaskesType = localStorage.getItem('faskesType');
  if (savedFaskesType) {
    setCurrentFaskesType(savedFaskesType);
  }
}, []);
```

## Komponen UI

### FaskesTypeSelector

Komponen ini memungkinkan pengguna untuk memilih tipe faskes dan menampilkan konfigurasi BPJS yang sesuai:

```tsx
export const FaskesTypeSelector: React.FC = () => {
  // ...
};
```

### VisibleModulesList

Menampilkan daftar modul yang terlihat berdasarkan tipe faskes yang dipilih:

```tsx
export const VisibleModulesList: React.FC = () => {
  // ...
};
```

## Integrasi dengan Dashboard

Layout dashboard secara otomatis menyesuaikan menu navigasi berdasarkan modul-modul yang diizinkan untuk tipe faskes yang sedang aktif. Setiap item menu hanya akan ditampilkan jika modul terkait diizinkan untuk tipe faskes saat ini.

## Manfaat Sistem

1. **Penyesuaian Otomatis**: Sistem otomatis menyesuaikan modul yang tampil berdasarkan tipe faskes
2. **Kesesuaian Regulasi**: Sesuai dengan aturan BPJS untuk tiap tipe faskes
3. **Efisiensi Penggunaan**: Menghindari tampilnya modul yang tidak relevan
4. **Fleksibilitas**: Mudah untuk menambahkan tipe faskes baru atau mengubah konfigurasi modul
5. **Pengalaman Pengguna**: Antarmuka yang disesuaikan dengan kebutuhan spesifik tiap tipe faskes

## Penyesuaian untuk Pengembangan Lebih Lanjut

Sistem ini dirancang untuk mudah dikembangkan dengan penambahan tipe faskes baru atau modul-modul tambahan. Cukup menambahkan entri ke konfigurasi yang sesuai tanpa perlu mengubah logika inti sistem.
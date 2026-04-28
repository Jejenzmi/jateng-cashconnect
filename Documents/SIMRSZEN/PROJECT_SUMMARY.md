# Proyek Implementasi Sistem Manajemen Shift untuk SIMRS ZEN

## Ringkasan Proyek

Proyek ini bertujuan untuk mengimplementasikan sistem manajemen shift yang fleksibel untuk sistem informasi rumah sakit SIMRS ZEN. Sistem ini dirancang untuk memenuhi kebutuhan rumah sakit akan penjadwalan shift yang beragam dan tidak selalu mengikuti pola standar.

## Tujuan Utama

1. Membangun sistem manajemen shift yang mendukung berbagai jenis shift tidak umum di rumah sakit
2. Menyediakan fleksibilitas dalam pengaturan jam kerja, jam istirahat, dan aturan shift
3. Memastikan kepatuhan terhadap regulasi jam kerja dan kesehatan tenaga kerja
4. Mengintegrasikan sistem shift ke dalam modul HR yang sudah ada

## Fitur Utama Sistem

### 1. Model Shift yang Fleksibel

Model [Shift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L63-L71) mencakup berbagai atribut untuk mendukung berbagai jenis shift:

- `name`: Nama shift (misalnya "Pagi", "Malam", "On Call")
- `description`: Deskripsi rinci tentang shift
- `startTime` dan `endTime`: Waktu mulai dan selesai shift
- `breakStartTime` dan `breakEndTime`: Waktu istirahat (opsional)
- `isActive`: Status apakah shift ini aktif digunakan
- `isOvertimeAllowed`: Apakah lembur diperbolehkan untuk shift ini
- `maxConsecutiveDays`: Jumlah maksimal hari berturut-turut seorang karyawan dapat bekerja shift ini
- `minRestHoursAfterShift`: Jumlah minimum jam istirahat yang diperlukan setelah shift
- `weekendPattern`: Pola kerja akhir pekan ('off', 'half', 'full')
- `holidayWorking`: Apakah shift ini bekerja di hari libur

### 2. Contoh Shift-shift Tidak Umum di Rumah Sakit

Sistem mendukung berbagai jenis shift yang umum ditemukan di rumah sakit:

- **Shift On-Call 24 Jam**: Untuk dokter spesialis yang harus standby
- **Shift Jaga Malam Panjang**: Untuk perawat dan staf medis dengan durasi 12+ jam
- **Shift Pendek ICU**: Shift 6 jam untuk area ICU
- **Shift 3-Jam Spesifik**: Untuk tugas-tugas spesifik seperti operator radio
- **Flexi Shift**: Shift dengan jam fleksibel sesuai kebutuhan

### 3. Model Jadwal Karyawan

Model [Schedule](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L72-L102) menghubungkan karyawan dengan shift:

- `date`: Tanggal jadwal
- `shift`: Shift yang ditugaskan
- `employee`: Karyawan yang ditugaskan
- `isWorkFromHome`: Apakah bekerja dari rumah
- `notes`: Catatan tambahan tentang jadwal

## Teknologi dan Arsitektur

### Backend
- **Framework**: Node.js dengan Express
- **ORM**: Prisma dengan PostgreSQL
- **Bahasa**: TypeScript
- **Autentikasi**: JWT (JSON Web Token)

### Struktur File
- [/backend/src/services/shiftService.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/services/shiftService.ts): Logika bisnis untuk operasi shift
- [/backend/src/controllers/shiftController.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/controllers/shiftController.ts): Handler untuk endpoint API
- [/backend/src/routes/shift.route.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/routes/shift.route.ts): Definisi endpoint-endpoint API
- [/backend/src/scripts/seed-shifts.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts): Data awal untuk shift-shift umum
- [/prisma/schema.prisma](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma): Definisi model database

## Endpoint API

- `GET /api/shift` - Mengambil semua shift
- `GET /api/shift/:id` - Mengambil shift tertentu
- `POST /api/shift` - Membuat shift baru
- `PUT /api/shift/:id` - Memperbarui shift
- `DELETE /api/shift/:id` - Menghapus shift

## Manfaat Sistem Ini bagi Rumah Sakit

1. **Fleksibilitas Tinggi**: Sistem ini mendukung berbagai jenis shift yang diperlukan dalam operasional rumah sakit, termasuk shift-shift tidak umum.

2. **Manajemen Kesehatan Tenaga Kerja**: Dengan fitur `maxConsecutiveDays` dan `minRestHoursAfterShift`, sistem ini membantu mencegah kelelahan berlebihan pada tenaga medis.

3. **Kepatuhan terhadap Regulasi**: Sistem membantu memastikan kepatuhan terhadap aturan jam kerja dan jam istirahat.

4. **Penjadwalan yang Efisien**: Dengan model [Schedule](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L72-L102), manajer dapat dengan mudah merencanakan jadwal karyawan sesuai kebutuhan operasional.

5. **Dukungan Shift-shift Khusus**: Banyak rumah sakit memiliki kebutuhan shift yang tidak umum karena sifat layanan 24/7 mereka, dan sistem ini dirancang untuk mendukung kebutuhan tersebut.

## Kesimpulan

Sistem manajemen shift SIMRS ZEN dirancang secara khusus untuk memenuhi kebutuhan kompleks dari rumah sakit, termasuk dukungan untuk shift-shift tidak umum yang sering diperlukan dalam operasional rumah sakit. Dengan fleksibilitas ini, rumah sakit dapat lebih efisien dalam mengelola tenaga kerja mereka sambil tetap menjaga kesehatan dan kenyamanan tenaga medis.
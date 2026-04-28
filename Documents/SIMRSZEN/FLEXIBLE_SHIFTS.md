# Implementasi Shift-shift Fleksibel di Rumah Sakit

## Latar Belakang

Rumah sakit memiliki kebutuhan unik terhadap manajemen shift karena operasional 24/7 yang memerlukan fleksibilitas tinggi dalam penjadwalan. Berbeda dengan institusi lain yang biasanya mengikuti pola shift standar (pagi, siang, malam), rumah sakit sering kali memerlukan jenis shift yang tidak umum.

## Jenis-jenis Shift Tidak Umum di Rumah Sakit

### 1. Shift On-Call 24 Jam
- **Deskripsi**: Shift untuk dokter spesialis yang harus siap siaga selama 24 jam penuh
- **Durasi**: 24 jam
- **Fitur dalam sistem**:
  - [isOvertimeAllowed](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1122-L1122): true
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 2 (maksimal 2 hari berturut-turut)
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 24 (istirahat 24 jam setelah shift)
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'full' (bekerja di akhir pekan)
  - [holidayWorking](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1126-L1126): true (bekerja di hari libur)

### 2. Shift Jaga Malam Panjang
- **Deskripsi**: Shift malam yang berlangsung lebih lama dari biasanya (contoh: 20:00 - 08:00)
- **Durasi**: 12 jam
- **Fitur dalam sistem**:
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 2
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 16
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'full'
  - [holidayWorking](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1126-L1126): true

### 3. Shift Pendek ICU
- **Deskripsi**: Shift pendek 6 jam untuk area ICU
- **Durasi**: 6 jam
- **Fitur dalam sistem**:
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 7 (bisa setiap hari karena pendek)
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 8
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'off'

### 4. Shift 3-Jam Spesifik
- **Deskripsi**: Shift khusus 3 jam untuk tugas spesifik
- **Durasi**: 3 jam
- **Fitur dalam sistem**:
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 10 (lebih banyak karena pendek)
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 6
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'off'

### 5. Flexi Shift
- **Deskripsi**: Shift dengan jam fleksibel sesuai kebutuhan
- **Durasi**: Bervariasi
- **Fitur dalam sistem**:
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 6
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 12
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'off'

### 6. Shift Operator Radio
- **Deskripsi**: Shift operator radio 12 jam
- **Durasi**: 12 jam
- **Fitur dalam sistem**:
  - [maxConsecutiveDays](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1123-L1123): 4
  - [minRestHoursAfterShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1124-L1124): 24
  - [weekendPattern](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L1125-L1125): 'off'

## Implementasi Teknis dalam Sistem

### Model Shift

Model [Shift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L63-L71) dalam sistem mencakup berbagai atribut untuk mendukung fleksibilitas:

```prisma
model Shift {
  id                    String    @id @default(cuid())
  name                  String    @db.VarChar(100)  // Nama shift
  description           String?   // Deskripsi shift
  startTime             DateTime  @db.Time          // Waktu mulai shift
  endTime               DateTime  @db.Time          // Waktu selesai shift
  breakStartTime        DateTime?                 // Waktu istirahat mulai
  breakEndTime          DateTime?                 // Waktu istirahat selesai
  isActive              Boolean   @default(true)    // Status aktif shift
  isOvertimeAllowed     Boolean   @default(false)   // Izin lembur
  maxConsecutiveDays    Int?      // Hari berturut-turut maks
  minRestHoursAfterShift Int?     // Jam istirahat setelah shift
  weekendPattern        String?   // Pola akhir pekan
  holidayWorking        Boolean   @default(false)   // Boleh kerja hari libur
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  schedules             Schedule[]                // Relasi ke jadwal karyawan
}
```

### Model Jadwal

Model [Schedule](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L72-L102) menghubungkan karyawan dengan shift:

```prisma
model Schedule {
  id               String   @id @default(cuid())
  date             DateTime @db.Date              // Tanggal jadwal
  shift            Shift    @relation(fields: [shiftId], references: [id])  // Shift yang ditetapkan
  shiftId          String
  employee         User     @relation(fields: [employeeId], references: [id])  // Karyawan
  employeeId       String
  isWorkFromHome   Boolean  @default(false)       // Bekerja dari rumah
  notes            String?                       // Catatan tambahan
  isActive         Boolean  @default(true)        // Status aktif jadwal
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
  
  // Konstrain: satu karyawan hanya boleh punya satu shift per hari
  @@unique([employeeId, date], name: "EmployeeDateUnique")
}
```

## Endpoint API

Endpoint-Endpoint API untuk mengelola shift fleksibel:

- `GET /api/shift` - Mengambil semua shift
- `GET /api/shift/:id` - Mengambil shift tertentu
- `POST /api/shift` - Membuat shift baru dengan parameter fleksibel
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
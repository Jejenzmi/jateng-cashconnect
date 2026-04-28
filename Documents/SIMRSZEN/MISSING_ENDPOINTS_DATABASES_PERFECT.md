# Endpoint dan Database yang Belum Ada di SIMRS ZEN - Versi Lengkap

## Ringkasan Status Saat Ini

Sistem SIMRS ZEN saat ini hanya memiliki implementasi dasar untuk beberapa modul utama:

- Otentikasi pengguna
- Manajemen pasien
- Manajemen dokter
- Manajemen kunjungan
- Profil fasilitas kesehatan
- Manajemen modul

Namun, masih banyak modul penting yang belum diimplementasikan secara lengkap, termasuk endpoint dan model database yang sesuai. Untuk menjadikan sistem ini sebagai SIMRS yang lengkap dan siap pakai, perlu menambahkan endpoint dan model-model database yang tercantum di bawah ini.

## Endpoint yang Belum Ada / Belum Terdaftar

### 1. Modul Rawat Inap (`/api/inpatient`)
Endpoint untuk mengelola pasien rawat inap:
- `GET /` - Ambil semua rawat inap
- `GET /:id` - Ambil rawat inap spesifik
- `POST /` - Buat rawat inap baru
- `PUT /:id` - Update rawat inap
- `DELETE /:id` - Hapus rawat inap
- `PATCH /:id/discharge` - Pulangkan pasien rawat inap

### 2. Modul IGD (Instalasi Gawat Darurat) (`/api/emergency`)
Endpoint untuk mengelola kasus gawat darurat:
- `GET /` - Ambil semua kasus IGD
- `GET /:id` - Ambil kasus IGD spesifik
- `POST /` - Buat kasus IGD baru
- `PUT /:id` - Update kasus IGD
- `DELETE /:id` - Hapus kasus IGD
- `PATCH /:id/status` - Update status kasus IGD

### 3. Modul ICU/NICU/PICU (`/api/icu`)
Endpoint untuk mengelola perawatan ICU:
- `GET /` - Ambil semua pasien ICU
- `GET /:id` - Ambil pasien ICU spesifik
- `POST /` - Buat catatan ICU baru
- `PUT /:id` - Update catatan ICU
- `DELETE /:id` - Hapus catatan ICU
- `GET /beds` - Ambil ketersediaan tempat tidur ICU

### 4. Modul Laboratorium (`/api/laboratory`)
Endpoint untuk mengelola pemeriksaan laboratorium:
- `GET /` - Ambil semua pemeriksaan lab
- `GET /:id` - Ambil pemeriksaan lab spesifik
- `POST /` - Buat pemeriksaan lab baru
- `PUT /:id` - Update pemeriksaan lab
- `DELETE /:id` - Hapus pemeriksaan lab
- `GET /orders` - Ambil semua order lab
- `POST /orders` - Buat order lab baru
- `GET /results` - Ambil hasil pemeriksaan
- `PUT /results/:id` - Update hasil pemeriksaan

### 5. Modul Radiologi (`/api/radiology`)
Endpoint untuk mengelola pemeriksaan radiologi:
- `GET /` - Ambil semua pemeriksaan radiologi
- `GET /:id` - Ambil pemeriksaan radiologi spesifik
- `POST /` - Buat pemeriksaan radiologi baru
- `PUT /:id` - Update pemeriksaan radiologi
- `DELETE /:id` - Hapus pemeriksaan radiologi
- `GET /orders` - Ambil order radiologi
- `POST /orders` - Buat order radiologi
- `GET /reports` - Ambil laporan radiologi

### 6. Modul Farmasi (`/api/pharmacy`)
Endpoint untuk mengelola apotek dan resep:
- `GET /` - Ambil semua resep
- `GET /:id` - Ambil resep spesifik
- `POST /` - Buat resep baru
- `PUT /:id` - Update resep
- `DELETE /:id` - Hapus resep
- `GET /dispense/:id` - Proses penyerahan obat
- `GET /inventory` - Ambil stok obat

### 7. Modul Inventaris (`/api/inventory`)
Endpoint untuk mengelola inventaris rumah sakit:
- `GET /` - Ambil semua item inventaris
- `GET /:id` - Ambil item inventaris spesifik
- `POST /` - Buat item inventaris baru
- `PUT /:id` - Update item inventaris
- `DELETE /:id` - Hapus item inventaris
- `GET /low-stock` - Ambil item dengan stok rendah
- `POST /restock` - Restok item inventaris

### 8. Modul SDM/Kepegawaian (`/api/human-resources`)
Endpoint untuk mengelola sumber daya manusia:
- `GET /` - Ambil semua pegawai
- `GET /:id` - Ambil pegawai spesifik
- `POST /` - Buat pegawai baru
- `PUT /:id` - Update data pegawai
- `DELETE /:id` - Hapus pegawai
- `GET /positions` - Ambil jabatan
- `GET /departments` - Ambil departemen
- `POST /payroll` - Proses penggajian

### 9. Modul Penagihan (`/api/billing`)
Endpoint untuk mengelola penagihan dan pembayaran:
- `GET /` - Ambil semua tagihan
- `GET /:id` - Ambil tagihan spesifik
- `POST /` - Buat tagihan baru
- `PUT /:id` - Update tagihan
- `PATCH /:id/pay` - Proses pembayaran tagihan
- `GET /patient/:patientId` - Ambil tagihan berdasarkan pasien
- `GET /insurance` - Ambil informasi asuransi

### 10. Modul Jadwal Dokter (`/api/schedules`)
Endpoint untuk mengelola jadwal dokter:
- `GET /` - Ambil semua jadwal
- `GET /:id` - Ambil jadwal spesifik
- `POST /` - Buat jadwal baru
- `PUT /:id` - Update jadwal
- `DELETE /:id` - Hapus jadwal
- `GET /doctor/:doctorId` - Ambil jadwal dokter tertentu
- `GET /available` - Ambil jadwal yang tersedia

### 11. Modul Departemen (`/api/departments`)
Endpoint untuk mengelola departemen rumah sakit:
- `GET /` - Ambil semua departemen
- `GET /:id` - Ambil departemen spesifik
- `POST /` - Buat departemen baru
- `PUT /:id` - Update departemen
- `DELETE /:id` - Hapus departemen
- `GET /:id/employees` - Ambil pegawai dalam departemen

### 12. Modul Obat (`/api/medicines`)
Endpoint untuk mengelola data obat:
- `GET /` - Ambil semua obat
- `GET /:id` - Ambil obat spesifik
- `POST /` - Buat data obat baru
- `PUT /:id` - Update data obat
- `DELETE /:id` - Hapus data obat
- `GET /categories` - Ambil kategori obat
- `GET /interactions/:id` - Cek interaksi obat

### 13. Modul Rekam Medis (`/api/medical-records`)
Endpoint untuk mengelola rekam medis pasien:
- `GET /` - Ambil semua rekam medis
- `GET /:id` - Ambil rekam medis spesifik
- `POST /` - Buat rekam medis baru
- `PUT /:id` - Update rekam medis
- `DELETE /:id` - Hapus rekam medis
- `GET /patient/:patientId` - Ambil rekam medis pasien tertentu
- `GET /history/:patientId` - Ambil riwayat medis pasien

### 14. Modul Antrean (`/api/appointments`)
Endpoint untuk mengelola janji temu pasien:
- `GET /` - Ambil semua janji temu
- `GET /:id` - Ambil janji temu spesifik
- `POST /` - Buat janji temu baru
- `PUT /:id` - Update janji temu
- `DELETE /:id` - Batalkan janji temu
- `GET /patient/:patientId` - Ambil janji temu pasien
- `GET /today` - Ambil janji temu hari ini

## Database/Model yang Belum Ada

Berikut adalah blueprint untuk model-model database yang perlu ditambahkan ke schema Prisma untuk mendukung endpoint-endpoint di atas:

### 1. Model Jadwal Dokter
```prisma
model Schedule {
  id        String   @id @default(cuid())
  doctorId  String
  doctor    Doctor   @relation(fields: [doctorId], references: [id])
  dayOfWeek String   // MONDAY, TUESDAY, etc
  startTime String   // Format: "HH:mm"
  endTime   String   // Format: "HH:mm"
  maxVisits Int      @default(20)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("schedules")
}
```

### 2. Model Obat
```prisma
model Medicine {
  id          String    @id @default(cuid())
  name        String
  genericName String?
  dosageForm  String?   // Tablet, Sirup, Injeksi, dll
  strength    String?   // Kekuatan obat
  manufacturer String?  // Produsen obat
  price       Decimal
  stock       Int       @default(0)
  unit        String    // Satuan (buah, strip, botol, dll)
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("medicines")
}
```

### 3. Model Resep
```prisma
model Prescription {
  id            String            @id @default(cuid())
  visitId       String
  visit         Visit             @relation(fields: [visitId], references: [id])
  items         PrescriptionItem[]
  notes         String?
  status        String            @default("pending") // pending, dispensed, completed
  issuedAt      DateTime?
  issuedBy      String?           // ID petugas apoteker
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  @@map("prescriptions")
}

model PrescriptionItem {
  id            String      @id @default(cuid())
  prescriptionId String
  prescription  Prescription @relation(fields: [prescriptionId], references: [id])
  medicineId    String
  medicine      Medicine    @relation(fields: [medicineId], references: [id])
  quantity      Int
  dosage       String      // Takaran pemakaian
  frequency    String      // Frekuensi pemakaian
  duration     Int         // Durasi pengobatan (hari)
  notes        String?
  createdAt    DateTime    @default(now())
  
  @@map("prescription_items")
}
```

### 4. Model Departemen
```prisma
model Department {
  id          String   @id @default(cuid())
  name        String
  description String?
  head        User?    @relation("DepartmentHead", fields: [headId], references: [id])
  headId      String?
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("departments")
}
```

### 5. Model Penagihan
```prisma
model Bill {
  id              String      @id @default(cuid())
  patientId       String
  patient         Patient     @relation(fields: [patientId], references: [id])
  visitId         String?
  visit           Visit?      @relation(fields: [visitId], references: [id])
  items           BillItem[]
  totalAmount     Decimal
  discountPercent Decimal?    @default(0)
  discountAmount  Decimal?    @default(0)
  finalAmount     Decimal
  paymentStatus   String      @default("unpaid") // unpaid, partially_paid, paid
  paymentMethod   String?     // cash, card, insurance
  paidAt          DateTime?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("bills")
}

model BillItem {
  id         String   @id @default(cuid())
  billId     String
  bill       Bill     @relation(fields: [billId], references: [id])
  itemName   String   // Nama item/tagihan
  quantity   Int      @default(1)
  unitPrice  Decimal
  totalPrice Decimal
  notes      String?
  createdAt  DateTime @default(now())
  
  @@map("bill_items")
}
```

### 6. Model Inventaris
```prisma
model InventoryItem {
  id          String        @id @default(cuid())
  name        String        // Nama barang
  category    String        // Kategori barang
  unit        String        // Satuan (buah, pack, kotak, dll)
  stock       Int           @default(0)  // Stok saat ini
  minStock    Int           @default(0)  // Stok minimum
  price       Decimal       // Harga satuan
  supplierId  String?
  supplier    Supplier?     @relation(fields: [supplierId], references: [id])
  location    String?       // Lokasi penyimpanan
  notes       String?
  isDeleted   Boolean       @default(false)
  deletedAt   DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@map("inventory_items")
}

model Supplier {
  id          String            @id @default(cuid())
  name        String
  contactPerson String?
  phone       String?
  email       String?
  address     String?
  items       InventoryItem[]
  notes       String?
  isActive    Boolean           @default(true)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  @@map("suppliers")
}
```

### 7. Model Laboratorium
```prisma
model LaboratoryTest {
  id            String        @id @default(cuid())
  name          String        // Nama tes
  code          String        @unique  // Kode tes
  group         String?       // Grup tes (hematology, chemistry, microbiology)
  description   String?
  price         Decimal
  normalValues  String?       // Nilai normal
  sampleType    String?       // Jenis sampel (darah, urin, dll)
  preparation   String?       // Persiapan sebelum tes
  processingTime Int?         // Waktu pengolahan dalam jam
  isActive      Boolean       @default(true)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@map("lab_tests")
}

model LaboratoryOrder {
  id            String            @id @default(cuid())
  visitId       String
  visit         Visit             @relation(fields: [visitId], references: [id])
  orderedById   String            // ID dokter pemesan
  orderedBy     User              @relation("LabOrders", fields: [orderedById], references: [id])
  tests         LaboratoryResult[]
  status        String            @default("ordered") // ordered, in_progress, completed, verified
  priority      String            @default("normal") // normal, urgent, stat
  orderedAt     DateTime          @default(now())
  completedAt   DateTime?
  verifiedAt    DateTime?
  verifiedById  String?
  verifiedBy    User?             @relation("VerifiedLabResults", fields: [verifiedById], references: [id])
  notes         String?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  @@map("lab_orders")
}

model LaboratoryResult {
  id              String              @id @default(cuid())
  orderId         String
  order           LaboratoryOrder     @relation(fields: [orderId], references: [id])
  testId          String
  test            LaboratoryTest      @relation(fields: [testId], references: [id])
  resultValue     String?             // Hasil pemeriksaan
  unit            String?             // Satuan
  referenceValues String?             // Nilai rujukan
  interpretation  String?             // Interpretasi hasil
  notes           String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  
  @@map("lab_results")
}
```

### 8. Model Rawat Inap
```prisma
model Inpatient {
  id              String      @id @default(cuid())
  patientId       String
  patient         Patient     @relation(fields: [patientId], references: [id])
  visitId         String
  visit           Visit       @relation(fields: [visitId], references: [id])
  roomId          String
  room            Room        @relation(fields: [roomId], references: [id])
  admissionDate   DateTime    @default(now())
  dischargeDate   DateTime?
  attendingDoctor String
  doctor          Doctor      @relation("AttendingDoctor", fields: [attendingDoctor], references: [id])
  diagnosis       String?
  treatment       String?
  notes           String?
  status          String      @default("admitted") // admitted, discharged, transferred
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("inpatients")
}
```

### 9. Model IGD
```prisma
model Emergency {
  id              String      @id @default(cuid())
  patientId       String
  patient         Patient     @relation(fields: [patientId], references: [id])
  visitId         String
  visit           Visit       @relation(fields: [visitId], references: [id])
  triageLevel     String      // I, II, III, IV, V
  arrivalDateTime DateTime    @default(now())
  examinationDateTime DateTime?
  dischargeDateTime DateTime?
  attendingDoctor String?
  doctor          Doctor?     @relation("EmergencyDoctor", fields: [attendingDoctor], references: [id])
  chiefComplaint  String
  diagnosis       String?
  treatment       String?
  disposition     String      // home, admitted, transferred, died
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("emergencies")
}
```

### 10. Model ICU
```prisma
model IcuStay {
  id              String      @id @default(cuid())
  patientId       String
  patient         Patient     @relation(fields: [patientId], references: [id])
  visitId         String
  visit           Visit       @relation(fields: [visitId], references: [id])
  bedId           String
  bed             Bed         @relation(fields: [bedId], references: [id])
  admissionDate   DateTime    @default(now())
  dischargeDate   DateTime?
  attendingDoctor String?
  doctor          Doctor?     @relation("IcuDoctor", fields: [attendingDoctor], references: [id])
  diagnosis       String?
  treatment       String?
  notes           String?
  status          String      @default("admitted") // admitted, discharged
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("icu_stays")
}

model Bed {
  id          String   @id @default(cuid())
  name        String   // Nama tempat tidur
  roomId      String
  room        Room     @relation(fields: [roomId], references: [id])
  type        String   // ICU, NICU, PICU, HDU, dll
  status      String   @default("available") // available, occupied, maintenance
  isDeleted   Boolean  @default(false)
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("beds")
}
```

## Kesimpulan

Saat ini sistem SIMRS ZEN hanya memiliki implementasi dasar untuk beberapa modul utama. Untuk menjadikan sistem ini sebagai SIMRS yang lengkap dan siap pakai, perlu menambahkan endpoint dan model-model database seperti yang tercantum di atas.

Implementasi lengkap dari modul-modul ini akan membuat sistem SIMRS ZEN menjadi sistem manajemen rumah sakit yang komprehensif dan siap digunakan dalam lingkungan produksi. Setiap modul harus diimplementasikan dengan memperhatikan aspek keamanan, kinerja, dan keandalan sistem sesuai dengan standar produksi.

Dengan adanya blueprint ini, pengembang dapat mengikuti panduan yang jelas untuk mengembangkan sistem SIMRS ZEN secara menyeluruh sesuai dengan kebutuhan rumah sakit yang sebenarnya.
# Endpoint dan Database yang Belum Ada di SIMRS ZEN

## Endpoint yang Belum Ada / Belum Terdaftar

### Modul Rawat Inap
- `/api/inpatient` - Kelola rawat inap pasien
  - `GET /` - Ambil semua rawat inap
  - `GET /:id` - Ambil rawat inap spesifik
  - `POST /` - Buat rawat inap baru
  - `PUT /:id` - Update rawat inap
  - `DELETE /:id` - Hapus rawat inap

### Modul IGD (Instalasi Gawat Darurat)
- `/api/emergency` - Kelola kasus gawat darurat
  - `GET /` - Ambil semua kasus IGD
  - `GET /:id` - Ambil kasus IGD spesifik
  - `POST /` - Buat kasus IGD baru
  - `PUT /:id` - Update kasus IGD
  - `DELETE /:id` - Hapus kasus IGD

### Modul ICU/NICU/PICU
- `/api/icu` - Kelola perawatan ICU
  - `GET /` - Ambil semua pasien ICU
  - `GET /:id` - Ambil pasien ICU spesifik
  - `POST /` - Buat catatan ICU baru
  - `PUT /:id` - Update catatan ICU
  - `DELETE /:id` - Hapus catatan ICU

### Modul Laboratorium
- `/api/laboratory` - Kelola pemeriksaan laboratorium
  - `GET /` - Ambil semua pemeriksaan lab
  - `GET /:id` - Ambil pemeriksaan lab spesifik
  - `POST /` - Buat pemeriksaan lab baru
  - `PUT /:id` - Update pemeriksaan lab
  - `DELETE /:id` - Hapus pemeriksaan lab

### Modul Radiologi
- `/api/radiology` - Kelola pemeriksaan radiologi
  - `GET /` - Ambil semua pemeriksaan radiologi
  - `GET /:id` - Ambil pemeriksaan radiologi spesifik
  - `POST /` - Buat pemeriksaan radiologi baru
  - `PUT /:id` - Update pemeriksaan radiologi
  - `DELETE /:id` - Hapus pemeriksaan radiologi

### Modul Farmasi
- `/api/pharmacy` - Kelola apotek dan resep
  - `GET /` - Ambil semua resep
  - `GET /:id` - Ambil resep spesifik
  - `POST /` - Buat resep baru
  - `PUT /:id` - Update resep
  - `DELETE /:id` - Hapus resep

### Modul Inventaris
- `/api/inventory` - Kelola inventaris rumah sakit
  - `GET /` - Ambil semua item inventaris
  - `GET /:id` - Ambil item inventaris spesifik
  - `POST /` - Buat item inventaris baru
  - `PUT /:id` - Update item inventaris
  - `DELETE /:id` - Hapus item inventaris

### Modul SDM/Kepegawaian
- `/api/human-resources` - Kelola sumber daya manusia
  - `GET /` - Ambil semua pegawai
  - `GET /:id` - Ambil pegawai spesifik
  - `POST /` - Buat pegawai baru
  - `PUT /:id` - Update data pegawai
  - `DELETE /:id` - Hapus pegawai

### Modul Penagihan
- `/api/billing` - Kelola penagihan dan pembayaran
  - `GET /` - Ambil semua tagihan
  - `GET /:id` - Ambil tagihan spesifik
  - `POST /` - Buat tagihan baru
  - `PUT /:id` - Update tagihan
  - `PATCH /:id/pay` - Proses pembayaran tagihan

### Modul Jadwal Dokter
- `/api/schedules` - Kelola jadwal dokter
  - `GET /` - Ambil semua jadwal
  - `GET /:id` - Ambil jadwal spesifik
  - `POST /` - Buat jadwal baru
  - `PUT /:id` - Update jadwal
  - `DELETE /:id` - Hapus jadwal

### Modul Departemen
- `/api/departments` - Kelola departemen rumah sakit
  - `GET /` - Ambil semua departemen
  - `GET /:id` - Ambil departemen spesifik
  - `POST /` - Buat departemen baru
  - `PUT /:id` - Update departemen
  - `DELETE /:id` - Hapus departemen

### Modul Obat
- `/api/medicines` - Kelola data obat
  - `GET /` - Ambil semua obat
  - `GET /:id` - Ambil obat spesifik
  - `POST /` - Buat data obat baru
  - `PUT /:id` - Update data obat
  - `DELETE /:id` - Hapus data obat

### Modul Rekam Medis
- `/api/medical-records` - Kelola rekam medis pasien
  - `GET /` - Ambil semua rekam medis
  - `GET /:id` - Ambil rekam medis spesifik
  - `POST /` - Buat rekam medis baru
  - `PUT /:id` - Update rekam medis
  - `DELETE /:id` - Hapus rekam medis

### Modul Antrean
- `/api/appointments` - Kelola janji temu pasien
  - `GET /` - Ambil semua janji temu
  - `GET /:id` - Ambil janji temu spesifik
  - `POST /` - Buat janji temu baru
  - `PUT /:id` - Update janji temu
  - `DELETE /:id` - Batalkan janji temu

## Database/Model yang Belum Ada

Berdasarkan kebutuhan SIMRS ZEN, berikut adalah model-model yang perlu ditambahkan ke schema Prisma:

### Model Jadwal Dokter
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

### Model Obat
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

### Model Resep
```prisma
model Prescription {
  id          String        @id @default(cuid())
  visitId     String
  visit       Visit         @relation(fields: [visitId], references: [id])
  medicines   PrescriptionItem[]
  notes       String?
  status      String        @default("pending") // pending, dispensed, completed
  issuedAt    DateTime?
  issuedBy    String?       // ID petugas apoteker
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@map("prescriptions")
}

model PrescriptionItem {
  id            String      @id @default(cuid())
  prescriptionId String
  prescription  Prescription @relation(fields: [prescriptionId], references: [id])
  medicineId    String
  medicine      Medicine    @relation(fields: [medicineId], references: [id])
  quantity      Int
  dosage      String      // Takaran pemakaian
  frequency   String      // Frekuensi pemakaian
  duration    Int         // Durasi pengobatan (hari)
  notes       String?
  createdAt   DateTime    @default(now())
  
  @@map("prescription_items")
}
```

### Model Departemen
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

### Model Penagihan
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

### Model Inventaris
```prisma
model InventoryItem {
  id          String      @id @default(cuid())
  name        String      // Nama barang
  category    String      // Kategori barang
  unit        String      // Satuan (buah, pack, kotak, dll)
  stock       Int         @default(0)  // Stok saat ini
  minStock    Int         @default(0)  // Stok minimum
  price       Decimal     // Harga satuan
  supplierId  String?
  supplier    Supplier?   @relation(fields: [supplierId], references: [id])
  location    String?     // Lokasi penyimpanan
  notes       String?
  isDeleted   Boolean     @default(false)
  deletedAt   DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
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

### Model Laboratorium
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

## Kesimpulan

Saat ini sistem SIMRS ZEN hanya memiliki implementasi dasar untuk:
- Otentikasi pengguna
- Manajemen pasien
- Manajemen dokter
- Manajemen kunjungan
- Profil fasilitas kesehatan
- Manajemen modul

Namun, masih banyak modul utama SIMRS yang belum diimplementasikan secara lengkap, termasuk endpoint dan model database yang sesuai. Untuk menjadikan sistem ini sebagai SIMRS yang lengkap dan siap pakai, perlu menambahkan endpoint dan model-model database yang tercantum di atas.
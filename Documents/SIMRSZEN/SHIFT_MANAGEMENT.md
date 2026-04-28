# Sistem Manajemen Shift untuk SIMRS ZEN

## Gambaran Umum
Sistem manajemen shift untuk SIMRS ZEN dirancang untuk mendukung berbagai jenis shift yang ditemui di rumah sakit, termasuk shift-shift tidak umum yang sering diperlukan dalam operasional rumah sakit.

## Tujuan
- Menyediakan sistem manajemen shift yang fleksibel untuk kebutuhan rumah sakit
- Mendukung berbagai jenis shift seperti shift malam panjang, shift on-call 24 jam, shift pendek ICU, dll.
- Memastikan pengelolaan shift sesuai dengan kebutuhan operasional rumah sakit

## Fitur Utama

### 1. Model Shift yang Fleksibel
Model Shift mencakup berbagai atribut untuk mendukung berbagai jenis shift:

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

#### Shift On-Call 24 Jam
- Cocok untuk dokter spesialis yang harus standby
- Waktu kerja: 24 jam penuh
- Izin lembur: Diizinkan
- Hari kerja berturut-turut maksimum: 2 hari
- Jam istirahat setelah shift: 24 jam

#### Shift Jaga Malam Panjang
- Untuk perawat dan staf medis yang butuh shift malam lebih lama
- Durasi: 12 jam (misalnya 20:00 - 08:00)
- Waktu istirahat di tengah shift
- Maksimal hari kerja berturut-turut: 2 hari

#### Shift Pendek ICU
- Shift pendek 6 jam untuk area ICU
- Dapat dilakukan setiap hari karena durasinya pendek
- Minimum jam istirahat: 8 jam

#### Shift 3-Jam Spesifik
- Shift khusus untuk tugas-tugas spesifik
- Misalnya: operator radio, fisioterapi, teknisi lab
- Karena pendek, bisa lebih fleksibel jumlah harinya

#### Flexi Shift
- Shift dengan jam kerja fleksibel
- Sesuai kebutuhan operasional
- Bisa menyesuaikan dengan kebutuhan spesifik

## Endpoint API

### GET /api/shift
Mengambil semua shift yang tersedia

### GET /api/shift/:id
Mengambil detail shift berdasarkan ID

### POST /api/shift
Membuat shift baru dengan atribut-atribut fleksibel

### PUT /api/shift/:id
Memperbarui shift yang sudah ada

### DELETE /api/shift/:id
Menghapus shift

## Keunggulan Sistem Ini untuk Rumah Sakit

1. **Fleksibilitas Tinggi**: Sistem ini mendukung berbagai jenis shift yang diperlukan dalam operasional rumah sakit, dari shift standar hingga shift-shift tidak umum.

2. **Manajemen Kesehatan Tenaga Kerja**: Dengan fitur `maxConsecutiveDays` dan `minRestHoursAfterShift`, sistem ini membantu mencegah kelelahan berlebihan pada tenaga medis.

3. **Kepatuhan terhadap Regulasi**: Sistem membantu memastikan kepatuhan terhadap aturan jam kerja dan jam istirahat.

4. **Penjadwalan yang Efisien**: Dengan model [Schedule](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/scripts/seed-shifts.ts#L72-L102), manajer dapat dengan mudah merencanakan jadwal karyawan sesuai kebutuhan operasional.

5. **Dukungan Shift-shift Khusus**: Banyak rumah sakit memiliki kebutuhan shift yang tidak umum karena sifat layanan 24/7 mereka, dan sistem ini dirancang untuk mendukung kebutuhan tersebut.

## Contoh Penggunaan

Sistem ini sangat berguna untuk berbagai skenario di rumah sakit:

- **Unit Gawat Darurat**: Butuh shift fleksibel untuk menangani lonjakan pasien
- **ICU**: Butuh shift pendek dengan frekuensi tinggi karena intensitas kerja
- **Dokter Spesialis On-Call**: Butuh shift 24-jam yang hanya digunakan saat dibutuhkan
- **Operator Radio**: Butuh shift 12 jam karena peralatan beroperasi sepanjang hari
- **Tenaga Cleaning Service**: Bisa menggunakan shift-shift pendek untuk meningkatkan produktivitas

## Kesimpulan

Sistem manajemen shift SIMRS ZEN dirancang secara khusus untuk memenuhi kebutuhan kompleks dari rumah sakit, termasuk dukungan untuk shift-shift tidak umum yang sering diperlukan dalam operasional rumah sakit. Dengan fleksibilitas ini, rumah sakit dapat lebih efisien dalam mengelola tenaga kerja mereka sambil tetap menjaga kesehatan dan kenyamanan tenaga medis.
# Manajemen Shift untuk SIMRS ZEN

Sistem Manajemen Rumah Sakit (SIMRS) ZEN kini dilengkapi dengan fitur manajemen shift kerja yang fleksibel dan dinamis untuk berbagai tipe fasilitas kesehatan (Faskes) termasuk rumah sakit, klinik, dan puskesmas.

## Fitur Utama

### 1. Pengaturan Shift Kerja Dinamis
- Pengaturan shift kerja yang dapat disesuaikan dengan kebutuhan masing-masing tipe faskes
- Dukungan untuk berbagai jenis shift (pagi, siang, malam, administrasi, dll)
- Kemampuan untuk menetapkan durasi istirahat dan tunjangan shift

### 2. Jadwal Shift Karyawan
- Penjadwalan shift untuk karyawan/pegawai
- Fitur untuk penjadwalan ulang (swap) shift antar karyawan
- Pencatatan status shift (scheduled, worked, cancelled, swapped)

### 3. Integrasi dengan Tipe Faskes
- Model [WorkShift](file:///Users/jejenjaenudin/Documents/SIMRSZEN/src/lib/db.ts#L34-L34) dapat dikaitkan dengan tipe faskes tertentu
- Shift yang tidak dikaitkan dengan tipe faskes tertentu akan tersedia untuk semua tipe faskes

## Struktur Database

### Model WorkShift
- `id`: UUID unik untuk setiap shift kerja
- `shift_code`: Kode unik untuk shift (misalnya SHIFT_PAGI)
- `shift_name`: Nama deskriptif shift
- `start_time`: Waktu mulai shift
- `end_time`: Waktu selesai shift
- `break_duration`: Durasi istirahat dalam menit
- `is_night_shift`: Indikator apakah shift malam
- `allowance_amount`: Tunjangan shift dalam Rupiah
- `is_active`: Status aktif/non-aktif shift
- `faskesTypeId`: ID tipe faskes (opsional)
- `createdAt`, `updatedAt`, `deletedAt`: Timestamp

### Model ShiftSchedule
- `id`: UUID unik untuk setiap jadwal shift
- `employeeId`: ID karyawan yang dijadwalkan
- `workShiftId`: ID shift kerja
- `date`: Tanggal shift
- `status`: Status jadwal (scheduled, worked, cancelled, swapped)
- `notes`: Catatan tambahan
- `createdAt`, `updatedAt`, `deletedAt`: Timestamp

## API Endpoints

### Work Shifts
- `GET /api/shift/work-shifts` - Ambil semua shift kerja (filterable by faskesTypeId)
- `GET /api/shift/work-shifts/:id` - Ambil shift kerja berdasarkan ID
- `POST /api/shift/work-shifts` - Buat shift kerja baru
- `PUT /api/shift/work-shifts/:id` - Perbarui shift kerja
- `DELETE /api/shift/work-shifts/:id` - Hapus shift kerja
- `GET /api/shift/work-shifts/faskes/:faskesTypeId` - Ambil shift berdasarkan tipe faskes

### Shift Schedules
- `GET /api/shift/shift-schedules` - Ambil semua jadwal shift
- `GET /api/shift/shift-schedules/:id` - Ambil jadwal shift berdasarkan ID
- `POST /api/shift/shift-schedules` - Buat jadwal shift baru
- `PUT /api/shift/shift-schedules/:id` - Perbarui jadwal shift
- `DELETE /api/shift/shift-schedules/:id` - Hapus jadwal shift
- `GET /api/shift/shift-schedules/employee/:employeeId` - Ambil jadwal shift berdasarkan karyawan

## Frontend Components

### Shift Management Tab
Terletak di `/src/components/hr/ShiftManagementTab.tsx`, komponen ini menyediakan:
- Tabel untuk menampilkan semua shift kerja
- Formulir untuk menambah/edit shift kerja
- Fungsi untuk menghapus shift kerja
- Tampilan visual untuk shift malam dan tunjangan shift

### Hooks untuk Data HR
Hook `useWorkShifts` dan `useShiftSchedules` di `/src/hooks/useHRData.ts` menyediakan:
- Fungsi untuk mengambil data shift kerja
- Fungsi untuk mengambil jadwal shift
- Filter berdasarkan tipe faskes atau ID karyawan

## Implementasi untuk Berbagai Tipe Faskes

Fitur manajemen shift dirancang untuk mendukung berbagai tipe faskes:

### Rumah Sakit
- Shift 24/7 untuk perawat dan dokter jaga
- Shift malam dengan tunjangan tinggi
- Jadwal shift fleksibel untuk berbagai departemen

### Klinik
- Shift pagi dan sore hari
- Jadwal fleksibel sesuai jam operasional
- Shift part-time untuk tenaga medis paruh waktu

### Puskesmas
- Shift administrasi dan pelayanan
- Jadwal konsultasi dokter
- Penjadwalan layanan kesehatan masyarakat

## Konfigurasi Modul HR

Fitur shift management tercantum dalam konfigurasi HR di `/src/config/hr-module.config.ts`:
- `shift-management`: Pengaturan shift kerja
- `schedule-roster`: Penjadwalan shift dan roster karyawan
- Hak akses terpisah untuk manajemen shift

## Cara Menggunakan

### Menambah Shift Baru
1. Buka menu HR & Remunerasi
2. Pilih submenu "Manajemen Shift"
3. Klik tombol "Tambah Shift"
4. Isi formulir dengan informasi shift
5. Atur apakah shift ini khusus untuk tipe faskes tertentu
6. Simpan shift

### Menjadwalkan Shift untuk Karyawan
1. Gunakan fitur jadwal & roster
2. Pilih karyawan dan shift yang sesuai
3. Atur tanggal dan status
4. Simpan jadwal

## Validasi dan Keamanan

- Semua input divalidasi menggunakan Zod schema
- Akses API dilindungi oleh middleware otentikasi
- Validasi untuk mencegah konflik jadwal shift
- Validasi untuk mencegah penghapusan shift yang sudah memiliki jadwal

## Kesimpulan

Fitur manajemen shift dalam SIMRS ZEN menyediakan solusi komprehensif untuk mengatur jadwal kerja karyawan di berbagai tipe fasilitas kesehatan. Dengan kemampuan untuk mengkustomisasi shift berdasarkan tipe faskes, sistem ini sangat fleksibel dan dapat disesuaikan dengan kebutuhan operasional masing-masing jenis fasilitas kesehatan.
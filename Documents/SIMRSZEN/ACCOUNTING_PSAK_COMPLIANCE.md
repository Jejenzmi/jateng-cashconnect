# Dokumentasi Modul Akuntansi SIMRS ZEN (PSAK Compliant)

## Deskripsi
Modul akuntansi dalam SIMRS ZEN dirancang sesuai dengan standar PSAK (Pernyataan Standar Akuntansi Keuangan) Indonesia untuk memastikan pelaporan keuangan yang akurat dan sesuai regulasi.

## Standar yang Diikuti
- **PSAK 1**: Presentasi Laporan Keuangan
- **PSAK 17**: Informasi yang Harus Diungkapkan Dalam Laporan Keuangan
- **PSAK 23**: Laporan Arus Kas
- **PSAK 24**: Kebijakan Akuntansi, Perubahan Estimasi Akuntansi, dan Kesalahan
- **PSAK 50**: Instrumen Keuangan: Penyajian
- **PSAK 55**: Aset Tetap dan Aset Tak Berwujud

## 1. Chart of Accounts

### Struktur Akun
- **ASET (ASSET)**: Klasifikasi aset perusahaan termasuk lancar dan tidak lancar
  - Aset Lancar (Current Assets): Kas, Piutang, Persediaan
  - Aset Tidak Lancar (Non-Current Assets): Aset Tetap, Investasi Jangka Panjang

- **KEWAJIBAN (LIABILITY)**: Kewajiban perusahaan termasuk jangka pendek dan panjang
  - Kewajiban Lancar (Current Liabilities): Hutang Dagang, Hutang Pajak
  - Kewajiban Tidak Lancar (Non-Current Liabilities): Hutang Jangka Panjang

- **EKUITAS (EQUITY)**: Modal dan laba ditahan
  - Modal Disetor, Laba Ditahan, Cadangan

- **PENDAPATAN (REVENUE)**: Pendapatan operasional dan non-operasional
  - Pendapatan Layanan Medis, Pendapatan Lainnya

- **BEBAN (EXPENSE)**: Beban operasional dan non-operasional
  - Beban Personalia, Beban Perlengkapan Medis, Beban Administrasi

### Fungsionalitas
- Membuat akun baru dengan kode unik
- Pengelompokan akun berdasarkan PSAK
- Hierarki akun induk-anak
- Status aktif/non-aktif

## 2. Transaksi Akuntansi

### Tipe Jurnal
- **SA (Simple Journal)**: Jurnal umum untuk transaksi biasa
- **AJ (Adjusting Journal)**: Jurnal penyesuaian akhir periode
- **CL (Closing Journal)**: Jurnal penutup akhir tahun

### Proses Transaksi
1. Input transaksi dengan deskripsi dan tanggal
2. Verifikasi balance (debit = kredit)
3. Simpan ke tabel transaksi
4. Setelah posting:
   - Transfer ke general ledger
   - Update trial balance
   - Update running balance

## 3. General Ledger & Trial Balance

### General Ledger
- Catatan historis semua transaksi per akun
- Running balance untuk setiap akun
- Tautan ke transaksi asal

### Trial Balance
- Saldo akun per periode (bulan/tahun)
- Verifikasi bahwa total debit = total kredit
- Dasar untuk penyusunan laporan keuangan

## 4. Depresiasi Aset Tetap

### Metode Depresiasi
- **Garis Lurus (Straight Line)**: Biaya disebarkan merata selama umur manfaat
- **Saldo Menurun (Declining Balance)**: Tarif tetap diterapkan pada nilai buku

### Proses Depresiasi
1. Input data aset (nilai perolehan, umur manfaat, nilai residu)
2. Hitung depresiasi bulanan
3. Buat jurnal depresiasi otomatis
4. Update akumulasi dan nilai buku

## 5. Laporan Keuangan

### Laporan Utama
- **Neraca (Balance Sheet)** - PSAK 1
  - Disajikan posisi keuangan per tanggal tertentu
  - Aset = Kewajiban + Ekuitas

- **Laba Rugi (Income Statement)** - PSAK 23
  - Menunjukkan kinerja operasional periode tertentu
  - Pendapatan - Beban = Laba/Rugi Bersih

- **Arus Kas (Cash Flow Statement)** - PSAK 24
  - Menunjukkan pergerakan kas dari operasi, investasi, dan pendanaan

- **Ekuitas Pemilik (Statement of Equity)** - PSAK 1
  - Menunjukkan perubahan dalam ekuitas selama periode

### Proses Pembuatan Laporan
1. Ambil data dari trial balance
2. Kategorisasi akun sesuai PSAK
3. Terapkan prinsip akuntansi (accrual, matching, etc.)
4. Tambahkan catatan atas laporan keuangan

## 6. Implementasi Teknis

### Database Schema
- [ChartOfAccounts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L527-L544) - Struktur akun
- [Transaction](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L546-L563) - Transaksi akuntansi
- [TransactionDetail](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L565-L581) - Detail transaksi per akun
- [GeneralLedger](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L588-L605) - Buku besar
- [TrialBalance](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L574-L586) - Saldo percobaan
- [FinancialReport](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L607-L621) - Laporan keuangan
- [Depreciation](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/prisma/schema.prisma#L623-L639) - Depresiasi aset

### Backend Implementation
- [accounting.service.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/services/accounting.service.ts) - Business logic
- [accounting.controller.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/controllers/accounting.controller.ts) - API controllers
- [accounting.route.ts](file:///Users/jejenjaenudin/Documents/SIMRSZEN/backend/src/routes/accounting.route.ts) - API routes

### Frontend Implementation
- [AccountingModule.tsx](file:///Users/jejenjaenudin/Documents/SIMRSZEN/src/components/accounting/AccountingModule.tsx) - UI untuk manajemen akuntansi

## 7. Endpoint API

### Chart of Accounts
- `POST /api/accounting/accounts` - Membuat akun baru
- `GET /api/accounting/accounts` - Mendapatkan daftar akun

### Transaksi
- `POST /api/accounting/transactions` - Membuat transaksi baru
- `POST /api/accounting/transactions/:transactionId/post` - Posting transaksi ke ledger

### Laporan
- `GET /api/accounting/trial-balance/:period` - Mendapatkan trial balance
- `POST /api/accounting/reports` - Membuat laporan keuangan

### Depresiasi
- `POST /api/accounting/depreciation/:assetId` - Menghitung depresiasi

## 8. Validasi dan Pengawasan

### Validasi Transaksi
- Balance validation (debit = kredit)
- Approval workflow untuk transaksi besar
- Audit trail untuk semua perubahan

### Pengawasan Internal
- Pembagian tugas (segregation of duties)
- Otorisasi berdasarkan peran
- Logging aktivitas akunting

## 9. Kepatuhan dan Pelaporan

Modul ini dirancang untuk memenuhi kebutuhan pelaporan keuangan sesuai PSAK dan standar internasional, termasuk:
- Penyajian laporan keuangan yang konsisten
- Pengungkapan yang memadai
- Dokumentasi dan verifikasi yang memadai
- Kontrol internal yang efektif

## Kesimpulan

Modul akuntansi SIMRS ZEN dirancang secara komprehensif untuk memenuhi standar PSAK Indonesia dengan fitur-fitur yang lengkap untuk manajemen akuntansi rumah sakit, termasuk chart of accounts, transaksi, pelaporan, dan kontrol internal.
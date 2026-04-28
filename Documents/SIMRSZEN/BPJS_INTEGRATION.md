# Dokumentasi Integrasi BPJS Kesehatan - SIMRS ZEN

## Gambaran Umum

Integrasi BPJS Kesehatan ke dalam sistem SIMRS ZEN memungkinkan rumah sakit untuk menghubungkan sistem mereka langsung dengan platform resmi BPJS Kesehatan. Integrasi ini mencakup berbagai layanan penting seperti VClaim, Antrean RS, PCare, Apotek, iCare JKN, eRekamMedis, dan Aplicares (manajemen ketersediaan kamar).

## Tujuan Implementasi

- Menyediakan akses langsung ke data peserta BPJS secara real-time
- Memvalidasi kepesertaan BPJS sebelum pelayanan kesehatan
- Mengambil data master dokter dan poli dari sistem BPJS
- Menyediakan sistem antrean online untuk pasien BPJS
- Menyediakan manajemen ketersediaan tempat tidur dan kamar rawat inap
- Menyederhanakan proses pendaftaran pasien BPJS
- Memastikan kepatuhan terhadap regulasi dan standar BPJS Kesehatan
- Menyediakan fitur monitoring dan pelaporan kesehatan
- Menyediakan fitur Program Rujuk Balik (PRB)
- Menyediakan data referensi untuk kebutuhan operasional
- Menyediakan fitur Rencana Kontrol dan SPRI
- Menyediakan fitur Rujukan Antar RS
- Menyediakan fitur Surat Eligibilitas Peserta (SEP)
- Menyediakan fitur approval SEP dan suplesi Jasa Raharja
- Menyediakan sistem manajemen antrean untuk layanan kesehatan
- Menyediakan sistem manajemen apotek untuk layanan farmasi
- Menyediakan sistem manajemen PCare untuk layanan primer

## Keamanan dan Otentikasi

Komunikasi dengan API BPJS Kesehatan menggunakan beberapa komponen keamanan untuk memastikan bahwa permintaan berasal dari sumber yang sah dan data tetap terlindungi:

### Header Otentikasi

Setiap permintaan ke API BPJS Kesehatan harus menyertakan header berikut:

| Nama Header | Deskripsi |
|-------------|-----------|
| X-Cons-ID | Consumer ID dari BPJS Kesehatan |
| X-Timestamp | Unix-based timestamp saat permintaan dibuat |
| X-Signature | Signature yang dihasilkan menggunakan algoritma HMAC-SHA256 |
| X-Authorization | Authorization dengan pola Base64 (untuk PCare) |
| User-Key | User key untuk akses webservice |

### Pembuatan Signature

1. Gabungkan Consumer ID dan timestamp dengan karakter "&": `consID&timestamp`
2. Gunakan algoritma HMAC-SHA256 dengan Consumer Secret sebagai kunci untuk menghasilkan signature
3. Encode hasilnya ke base64

### Proses Dekripsi Respons

Respons dari BPJS Kesehatan dikembalikan dalam bentuk yang telah dikompres dan dienkripsi:
- Kompresi menggunakan metode: Lz-string
- Enkripsi menggunakan metode: AES 256 (mode CBC) - SHA256
- Kunci enkripsi: `consid + conspwd + timestamp request` (gabungan string)

## Layanan yang Didukung

### 1. VClaim
- Verifikasi data peserta BPJS berdasarkan nomor kartu atau NIK
- Pengelolaan SEP (Surat Eligibilitas Peserta)
- Pengajuan klaim JKN

### 2. VClaim 2.0
- Pembuatan SEP Rawat Jalan dan Rawat Inap
- Pembuatan SEP IGD, Rujukan, dan KLL
- Update dan hapus SEP
- Pembuatan dan pengelolaan rujukan antar RS
- Pembuatan dan pengelolaan surat kontrol/SPRI
- Perpanjangan rujukan khusus
- Pengajuan dan approval SEP backdate/fingerprint
- Update tanggal pulang SEP
- Referensi lengkap (diagnosa, poli, dokter, faskes, dll)

### 3. Program Rujuk Balik (PRB)
- Pembuatan surat rujuk balik (PRB)
- Update surat rujuk balik
- Hapus surat rujuk balik
- Pencarian data PRB berdasarkan nomor SRB dan SEP
- Pencarian data PRB berdasarkan rentang tanggal
- Rekap data peserta potensi PRB

### 4. Rencana Kontrol dan SPRI
- Pembuatan surat kontrol (rencana kontrol)
- Update surat kontrol
- Hapus surat kontrol
- Pembuatan SPRI (Surat Pengantar Rawat Inap)
- Update SPRI
- Pencarian data SEP untuk keperluan rencana kontrol
- Pencarian data surat kontrol berdasarkan nomor surat kontrol
- Pencarian list rencana kontrol berdasarkan nomor kartu
- Pencarian list rencana kontrol berdasarkan rentang tanggal
- Pencarian list spesialistik untuk rencana kontrol
- Pencarian jadwal dokter untuk rencana kontrol
- Pembuatan dan update rencana kontrol versi 2 (dengan form PRB)

### 5. Rujukan Antar RS
- Pembuatan rujukan antar rumah sakit (versi 1.0 dan 2.0)
- Update rujukan antar rumah sakit
- Hapus rujukan antar rumah sakit
- Pembuatan rujukan khusus (perpanjangan)
- Hapus rujukan khusus
- Pencarian list rujukan khusus
- Pencarian list spesialistik untuk rujukan
- Pencarian list sarana untuk rujukan
- Pencarian list rujukan keluar berdasarkan rentang tanggal
- Pencarian detail rujukan keluar berdasarkan nomor rujukan
- Pencarian jumlah SEP yang terbentuk berdasarkan nomor rujukan

### 6. Surat Eligibilitas Peserta (SEP)
- Pembuatan SEP versi 1.1 dan 2.0
- Update SEP versi 1.1 dan 2.0
- Hapus SEP versi 1.1 dan 2.0
- Pencarian data SEP berdasarkan nomor SEP
- Pencarian data SEP terakhir berdasarkan nomor rujukan

### 7. Approval dan Suplesi
- Pengajuan SEP backdate dan fingerprint
- Approval SEP
- Pencarian data potensi suplesi Jasa Raharja
- Pencarian data SEP induk kecelakaan
- Update tanggal pulang SEP
- Pencarian data SEP untuk integrasi Inacbg
- Pencarian dan penghapusan SEP internal
- Validasi fingerprint peserta
- Random question dan answer untuk verifikasi identitas

### 8. Antrean RS (HFIS - Hospital First Information System)
- Referensi poli yang tersedia di aplikasi HFIS
- Referensi dokter yang tersedia di aplikasi HFIS
- Referensi jadwal dokter berdasarkan kode poli dan tanggal
- Referensi poli fingerprint
- Referensi pasien fingerprint berdasarkan NIK atau nomor kartu
- Update jadwal dokter
- Penambahan antrean pasien
- Penambahan antrean farmasi
- Update waktu antrean (task ID)
- Pembatalan antrean
- Get list task ID
- Dashboard waktu tunggu per tanggal
- Dashboard waktu tunggu per bulan
- Antrean per tanggal
- Antrean per kode booking
- Antrean aktif (belum dilayani)
- Antrean aktif per poli, dokter, hari, dan jam praktek

### 9. Apotek
- Referensi DPHO (Daftar Obat DPHO)
- Referensi poli untuk apotek
- Referensi fasilitas kesehatan untuk apotek
- Setting apotek
- Referensi spesialistik untuk apotek
- Referensi obat untuk apotek
- Penyimpanan obat non racikan
- Penyimpanan obat racikan
- Update stok obat
- Hapus pelayanan obat
- Daftar pelayanan obat
- Riwayat pelayanan obat
- Simpan resep
- Hapus resep
- Daftar resep
- Cari SEP berdasarkan nomor SEP
- Data klaim apotek
- Rekap peserta PRB

### 10. PCare
- Get data diagnosa
- Get data dokter
- Get data club prolanis
- Get data kegiatan kelompok
- Get data peserta kegiatan kelompok
- Add kegiatan kelompok
- Add peserta kegiatan kelompok
- Delete kegiatan kelompok
- Delete peserta kegiatan kelompok
- Get data kesadaran
- Get data rujukan
- Get data riwayat kunjungan
- Add kunjungan
- Edit kunjungan
- Delete kunjungan

### 11. Referensi
- Data referensi diagnosa (ICD-10)
- Data referensi poli
- Data referensi fasilitas kesehatan (faskes)
- Data referensi dokter DPJP
- Data referensi propinsi, kabupaten, dan kecamatan
- Data referensi diagnosa dan obat program PRB
- Data referensi procedure/tindakan
- Data referensi kelas rawat
- Data referensi spesialistik
- Data referensi ruang rawat
- Data referensi cara keluar
- Data referensi pasca pulang

### 12. Monitoring
- Data kunjungan berdasarkan tanggal dan jenis pelayanan
- Data klaim berdasarkan tanggal, jenis pelayanan, dan status
- Histori pelayanan peserta berdasarkan nomor kartu dan rentang tanggal
- Data klaim jaminan Jasa Raharja

### 13. Antrean RS
- Sistem antrean online untuk rumah sakit
- Monitoring kapasitas layanan
- Jadwal dokter dan ketersediaan tempat tidur

### 14. Antrean FKTP
- Sistem antrean online untuk Fasilitas Kesehatan Tingkat Pertama
- Pengelolaan rujukan dari FKTP ke RS

### 15. Apotek
- Pengelolaan resep obat pasien BPJS
- Tracking pengambilan obat
- Verifikasi resep digital

### 16. PCare
- Pelayanan kesehatan tingkat pertama
- Pengelolaan data peserta BPJS di FKTP
- Pengelolaan kegiatan prolanis
- Pengelolaan kunjungan peserta

### 17. iCare JKN
- Sistem informasi kesehatan berbasis individu
- Monitoring kesehatan pasien secara menyeluruh

### 18. eRekamMedis
- Sistem rekam medis elektronik terintegrasi
- Penyimpanan dan akses data medis secara digital

### 19. Aplicares (Ketersediaan Kamar)
- Referensi kelas kamar rawat inap
- Update ketersediaan tempat tidur
- Penambahan ruangan baru
- Penghapusan ruangan
- Laporan ketersediaan kamar

## Arsitektur Sistem

### 1. Model Database

#### BpjsCredential
- **id**: String (Primary Key)
- **username**: String - Username dari akun BPJS
- **password**: String - Password dari akun BPJS
- **apiKey**: String - API Key atau Cons ID dari BPJS
- **consumerSecret**: String - Kunci rahasia untuk pembuatan signature
- **userKey**: String - Kunci pengguna untuk akses webservice
- **isActive**: Boolean - Status aktif credential
- **createdAt**: DateTime
- **updatedAt**: DateTime

#### BpjsApiConfig
- **id**: String (Primary Key)
- **vclaim**: String - URL endpoint VClaim
- **vclaim2**: String - URL endpoint VClaim 2.0
- **antreanRs**: String - URL endpoint Antrean RS
- **antreanFktp**: String - URL endpoint Antrean FKTP
- **apotek**: String - URL endpoint Apotek
- **pcare**: String - URL endpoint PCare
- **iCare**: String - URL endpoint iCare
- **eRekamMedis**: String - URL endpoint eRekamMedis
- **aplicares**: String - URL endpoint Aplicares
- **isActive**: Boolean - Status aktif konfigurasi
- **createdAt**: DateTime
- **updatedAt**: DateTime

### 2. Service Layer

#### BpjsService
- **setCredentials**: Mengatur kredensial BPJS Kesehatan
- **setApiConfig**: Mengatur konfigurasi endpoint API
- **loadCredentials**: Memuat kredensial dari database
- **loadApiConfig**: Memuat konfigurasi API dari database
- **createBpjsAuthHeaders**: Membuat header otentikasi BPJS
- **decryptBpjsResponse**: Mendekripsi respons dari BPJS
- **getVClaimParticipantByNoKartu**: Mendapatkan data peserta VClaim berdasarkan nomor kartu
- **getVClaimParticipantByNIK**: Mendapatkan data peserta VClaim berdasarkan NIK
- **insertSEP**: Membuat SEP versi 1.1 (VClaim 2.0)
- **updateSEP**: Memperbarui SEP versi 1.1 (VClaim 2.0)
- **deleteSEP**: Menghapus SEP versi 1.1 (VClaim 2.0)
- **getSEP**: Mendapatkan data SEP berdasarkan nomor SEP (VClaim 2.0)
- **getLastSEPByNoRujukan**: Mendapatkan data SEP terakhir berdasarkan nomor rujukan (VClaim 2.0)
- **insertSEP2**: Membuat SEP versi 2.0 (VClaim 2.0)
- **updateSEP2**: Memperbarui SEP versi 2.0 (VClaim 2.0)
- **deleteSEP2**: Menghapus SEP versi 2.0 (VClaim 2.0)
- **insertRujukan**: Membuat rujukan antar RS (VClaim 2.0)
- **updateRujukan**: Memperbarui rujukan antar RS (VClaim 2.0)
- **deleteRujukan**: Menghapus rujukan antar RS (VClaim 2.0)
- **insertRencanaKontrol**: Membuat surat kontrol (VClaim 2.0)
- **updateRencanaKontrol**: Memperbarui surat kontrol (VClaim 2.0)
- **deleteRencanaKontrol**: Menghapus surat kontrol (VClaim 2.0)
- **insertSPRI**: Membuat SPRI (VClaim 2.0)
- **updateSPRI**: Memperbarui SPRI (VClaim 2.0)
- **getJadwalSpesialistik**: Mendapatkan jadwal spesialistik (VClaim 2.0)
- **getJadwalDokter**: Mendapatkan jadwal dokter (VClaim 2.0)
- **getDiagnosaRef**: Mendapatkan referensi diagnosa (VClaim 2.0)
- **getPoliRef**: Mendapatkan referensi poli (VClaim 2.0)
- **getDokterRef**: Mendapatkan referensi dokter (VClaim 2.0)
- **getFaskesRef**: Mendapatkan referensi faskes (VClaim 2.0)
- **insertPRB**: Membuat PRB (Program Rujuk Balik)
- **updatePRB**: Memperbarui PRB (Program Rujuk Balik)
- **deletePRB**: Menghapus PRB (Program Rujuk Balik)
- **getPRBByNoSrbAndSep**: Mendapatkan data PRB berdasarkan nomor SRB dan SEP
- **getPRBByDateRange**: Mendapatkan data PRB berdasarkan rentang tanggal
- **getPRBPotensiSummary**: Mendapatkan rekap data peserta potensi PRB
- **getProcedureRef**: Mendapatkan referensi procedure (VClaim 2.0)
- **getKelasRawatRef**: Mendapatkan referensi kelas rawat (VClaim 2.0)
- **getSpesialistikRef**: Mendapatkan referensi spesialistik (VClaim 2.0)
- **getRuangRawatRef**: Mendapatkan referensi ruang rawat (VClaim 2.0)
- **getCaraKeluarRef**: Mendapatkan referensi cara keluar (VClaim 2.0)
- **getPascaPulangRef**: Mendapatkan referensi pasca pulang (VClaim 2.0)
- **getPropinsiRef**: Mendapatkan referensi propinsi (VClaim 2.0)
- **getKabupatenRef**: Mendapatkan referensi kabupaten (VClaim 2.0)
- **getKecamatanRef**: Mendapatkan referensi kecamatan (VClaim 2.0)
- **getDpjpRef**: Mendapatkan referensi dokter DPJP (VClaim 2.0)
- **getDiagnosaPrbRef**: Mendapatkan referensi diagnosa PRB (VClaim 2.0)
- **getObatPrbRef**: Mendapatkan referensi obat PRB (VClaim 2.0)
- **insertRencanaKontrolV2**: Membuat surat kontrol v2 (VClaim 2.0) dengan form PRB
- **updateRencanaKontrolV2**: Memperbarui surat kontrol v2 (VClaim 2.0) dengan form PRB
- **getSEPForRencanaKontrol**: Mendapatkan data SEP untuk keperluan rencana kontrol
- **getSuratKontrolByNoSuratKontrol**: Mendapatkan data surat kontrol berdasarkan nomor surat kontrol
- **getListRencanaKontrolByNoKartu**: Mendapatkan list rencana kontrol berdasarkan nomor kartu
- **getListRencanaKontrol**: Mendapatkan list rencana kontrol berdasarkan rentang tanggal
- **getListSpesialistikRencanaKontrol**: Mendapatkan list spesialistik untuk rencana kontrol
- **getJadwalDokterRencanaKontrol**: Mendapatkan jadwal dokter untuk rencana kontrol
- **insertRujukan2**: Membuat rujukan versi 2.0 (VClaim 2.0)
- **updateRujukan2**: Memperbarui rujukan versi 2.0 (VClaim 2.0)
- **getListSpesialistikRujukan**: Mendapatkan list spesialistik untuk rujukan
- **getListSaranaRujukan**: Mendapatkan list sarana untuk rujukan
- **getListRujukanKeluar**: Mendapatkan list rujukan keluar berdasarkan rentang tanggal
- **getRujukanKeluar**: Mendapatkan detail rujukan keluar berdasarkan nomor rujukan
- **getJumlahSEPRujukan**: Mendapatkan jumlah SEP yang terbentuk berdasarkan nomor rujukan
- **insertRujukanKhusus**: Membuat rujukan khusus (VClaim 2.0)
- **deleteRujukanKhusus**: Menghapus rujukan khusus (VClaim 2.0)
- **getListRujukanKhusus**: Mendapatkan list rujukan khusus berdasarkan bulan dan tahun
- **getSuplesi**: Mendapatkan data potensi suplesi Jasa Raharja
- **getDataIndukKecelakaan**: Mendapatkan data SEP induk kecelakaan
- **pengajuanSEP**: Melakukan pengajuan SEP
- **approveSEP**: Melakukan approval SEP
- **getListPersetujuanSEP**: Mendapatkan list persetujuan SEP
- **updateTanggalPulang**: Memperbarui tanggal pulang SEP
- **updateTanggalPulang2**: Memperbarui tanggal pulang SEP versi 2.0
- **getListUpdateTanggalPulang**: Mendapatkan list update tanggal pulang
- **getSEPForInacbg**: Mendapatkan data SEP untuk integrasi Inacbg
- **getSEPInternal**: Mendapatkan data SEP internal
- **deleteSEPInternal**: Menghapus SEP internal
- **getFingerprintStatus**: Mendapatkan status validasi fingerprint
- **getListFingerprint**: Mendapatkan list validasi fingerprint
- **getRandomQuestion**: Mendapatkan random question untuk verifikasi
- **submitRandomAnswer**: Mengirimkan jawaban random untuk verifikasi
- **getAntreanPoliRef**: Mendapatkan referensi poli Antrean RS
- **getAntreanDokterRef**: Mendapatkan referensi dokter Antrean RS
- **getAntreanJadwalDokterRef**: Mendapatkan referensi jadwal dokter Antrean RS
- **getAntreanPoliFpRef**: Mendapatkan referensi poli fingerprint Antrean RS
- **getAntreanPasienFpRef**: Mendapatkan referensi pasien fingerprint Antrean RS
- **updateJadwalDokterAntrean**: Memperbarui jadwal dokter Antrean RS
- **addAntrean**: Menambahkan antrean Antrean RS
- **addAntreanFarmasi**: Menambahkan antrean farmasi Antrean RS
- **updateWaktuAntrean**: Memperbarui waktu antrean Antrean RS
- **batalAntrean**: Membatalkan antrean Antrean RS
- **getListTaskAntrean**: Mendapatkan list task antrean Antrean RS
- **getDashboardAntreanPerTanggal**: Mendapatkan dashboard antrean per tanggal
- **getDashboardAntreanPerBulan**: Mendapatkan dashboard antrean per bulan
- **getAntreanPerTanggal**: Mendapatkan antrean per tanggal
- **getAntreanPerKodeBooking**: Mendapatkan antrean per kode booking
- **getAntreanAktif**: Mendapatkan antrean aktif (belum dilayani)
- **getAntreanAktifPerPoliDokterHariJam**: Mendapatkan antrean aktif per poli, dokter, hari, dan jam praktek
- **getReferensiDPHO**: Mendapatkan referensi DPHO untuk apotek
- **getReferensiPoliApotek**: Mendapatkan referensi poli untuk apotek
- **getReferensiFaskesApotek**: Mendapatkan referensi fasilitas kesehatan untuk apotek
- **getSettingApotek**: Mendapatkan setting apotek
- **getReferensiSpesialistikApotek**: Mendapatkan referensi spesialistik untuk apotek
- **getReferensiObatApotek**: Mendapatkan referensi obat untuk apotek
- **simpanObatNonRacikan**: Menyimpan obat non racikan
- **simpanObatRacikan**: Menyimpan obat racikan
- **updateStokObat**: Memperbarui stok obat
- **hapusPelayananObat**: Menghapus pelayanan obat
- **daftarPelayananObat**: Mendapatkan daftar pelayanan obat
- **riwayatPelayananObat**: Mendapatkan riwayat pelayanan obat
- **simpanResep**: Menyimpan resep
- **hapusResep**: Menghapus resep
- **daftarResep**: Mendapatkan daftar resep
- **cariSEP**: Mencari SEP berdasarkan nomor SEP
- **getDataKlaimApotek**: Mendapatkan data klaim apotek
- **getRekapPesertaPRB**: Mendapatkan rekap peserta PRB
- **getDiagnosaPCare**: Mendapatkan data diagnosa dari PCare
- **getDokterPCare**: Mendapatkan data dokter dari PCare
- **getClubProlanisPCare**: Mendapatkan data club prolanis dari PCare
- **getKegiatanKelompokPCare**: Mendapatkan data kegiatan kelompok dari PCare
- **getPesertaKegiatanKelompokPCare**: Mendapatkan data peserta kegiatan kelompok dari PCare
- **addKegiatanKelompokPCare**: Menambahkan kegiatan kelompok di PCare
- **addPesertaKegiatanKelompokPCare**: Menambahkan peserta kegiatan kelompok di PCare
- **deleteKegiatanKelompokPCare**: Menghapus kegiatan kelompok di PCare
- **deletePesertaKegiatanKelompokPCare**: Menghapus peserta kegiatan kelompok di PCare
- **getKesadaranPCare**: Mendapatkan data kesadaran dari PCare
- **getRujukanPCare**: Mendapatkan data rujukan dari PCare
- **getRiwayatKunjunganPCare**: Mendapatkan data riwayat kunjungan dari PCare
- **addKunjunganPCare**: Menambahkan kunjungan di PCare
- **editKunjunganPCare**: Mengedit kunjungan di PCare
- **deleteKunjunganPCare**: Menghapus kunjungan di PCare
- **getDataKunjungan**: Mendapatkan data kunjungan (Monitoring)
- **getDataKlaim**: Mendapatkan data klaim (Monitoring)
- **getHistoriPelayananPeserta**: Mendapatkan histori pelayanan peserta (Monitoring)
- **getDataKlaimJasaRaharja**: Mendapatkan data klaim jaminan Jasa Raharja (Monitoring)
- **getBedClassReference**: Mendapatkan referensi kelas kamar
- **updateBedAvailability**: Memperbarui ketersediaan tempat tidur
- **createNewRoom**: Menambahkan ruangan baru
- **getBedAvailability**: Mendapatkan ketersediaan kamar RS
- **deleteRoom**: Menghapus ruangan
- **getPoliList**: Mendapatkan daftar poli dari sistem BPJS
- **getDokterList**: Mendapatkan daftar dokter dari sistem BPJS

### 3. Controller Layer

#### BpjsController
- Menyediakan endpoint API untuk semua fungsi pada service layer
- Menangani validasi input
- Memberikan respon dalam format JSON standar

### 4. Frontend Component

#### BPJSIntegration
- Antarmuka pengguna untuk mengelola integrasi BPJS Kesehatan
- Terdiri dari sebelas tab: Verifikasi Peserta, Antrean RS, Apotek, iCare, Data Master, Ketersediaan Kamar, VClaim 2.0, Monitoring, PRB, Referensi, dan Pengaturan
- Fitur verifikasi peserta (VClaim dan PCare) berdasarkan nomor kartu atau NIK
- Tampilan data antrean rumah sakit
- Tampilan data resep apotek
- Tampilan data master dokter dan poli
- Tampilan dan manajemen ketersediaan kamar dan tempat tidur
- Tampilan dan manajemen SEP, rujukan, dan surat kontrol (VClaim 2.0)
- Tampilan dan manajemen PRB (Program Rujuk Balik)
- Tampilan dan manajemen referensi data
- Form untuk pengaturan kredensial

## Fungsi Utama

### 1. Verifikasi Peserta
- Verifikasi data peserta BPJS berdasarkan nomor kartu atau NIK
- Menampilkan informasi lengkap peserta (nama, status kepesertaan, alamat, dll)
- Dapat menggunakan layanan VClaim atau PCare

### 2. Manajemen Antrean
- Menampilkan daftar antrean rumah sakit
- Informasi estimasi waktu pelayanan
- Kapasitas kuota harian

### 3. Manajemen Apotek
- Menampilkan data resep berdasarkan kode booking
- Informasi obat dan aturan pakai
- Status pengambilan obat

### 4. Manajemen PCare
- Menampilkan data diagnosa peserta
- Menampilkan data dokter
- Menampilkan data kegiatan prolanis
- Menampilkan data kunjungan peserta
- Mengelola kegiatan kelompok prolanis

### 5. Ketersediaan Kamar
- Referensi kelas kamar berdasarkan standar BPJS
- Tambah, ubah, dan hapus informasi kamar
- Update ketersediaan tempat tidur
- Laporan ketersediaan kamar

### 6. VClaim 2.0
- Pembuatan dan pengelolaan SEP (Surat Eligibilitas Peserta)
- Pembuatan dan pengelolaan rujukan antar RS
- Pembuatan dan pengelolaan surat kontrol dan SPRI
- Referensi lengkap untuk keperluan pembuatan SEP
- Pengajuan dan approval SEP backdate/fingerprint

### 7. Program Rujuk Balik (PRB)
- Pembuatan surat rujuk balik (SRB) untuk pasien
- Update data surat rujuk balik
- Hapus data surat rujuk balik
- Pencarian data PRB berdasarkan nomor SRB dan SEP
- Pencarian data PRB berdasarkan rentang tanggal
- Laporan rekap data peserta potensi PRB

### 8. Rencana Kontrol dan SPRI
- Pembuatan surat kontrol untuk kontrol konsultasi pasien
- Update dan hapus surat kontrol
- Pembuatan SPRI untuk keperluan rawat inap
- Update SPRI
- Pencarian data SEP untuk keperluan pembuatan surat kontrol
- Pencarian data surat kontrol berdasarkan nomor surat kontrol
- Pencarian list rencana kontrol berdasarkan nomor kartu atau rentang tanggal
- Pencarian list spesialistik untuk rencana kontrol
- Pencarian jadwal dokter untuk rencana kontrol
- Pembuatan dan update versi 2 dari rencana kontrol yang menyertakan form PRB

### 9. Rujukan Antar RS
- Pembuatan rujukan antar rumah sakit (versi 1.0 dan 2.0)
- Update dan hapus rujukan antar rumah sakit
- Pembuatan rujukan khusus (perpanjangan)
- Hapus rujukan khusus
- Pencarian list rujukan khusus
- Pencarian list spesialistik untuk rujukan
- Pencarian list sarana untuk rujukan
- Pencarian list rujukan keluar berdasarkan rentang tanggal
- Pencarian detail rujukan keluar berdasarkan nomor rujukan
- Pencarian jumlah SEP yang terbentuk berdasarkan nomor rujukan

### 10. Surat Eligibilitas Peserta (SEP)
- Pembuatan SEP versi 1.1 dan 2.0
- Update dan hapus SEP versi 1.1 dan 2.0
- Pencarian data SEP berdasarkan nomor SEP
- Pencarian data SEP terakhir berdasarkan nomor rujukan

### 11. Approval dan Suplesi
- Pengajuan SEP backdate dan fingerprint
- Approval SEP
- Pencarian data potensi suplesi Jasa Raharja
- Pencarian data SEP induk kecelakaan
- Update tanggal pulang SEP
- Pencarian data SEP untuk integrasi Inacbg
- Pencarian dan penghapusan SEP internal
- Validasi fingerprint peserta
- Random question dan answer untuk verifikasi identitas

### 12. Antrean RS (HFIS - Hospital First Information System)
- Referensi poli yang tersedia di aplikasi HFIS
- Referensi dokter yang tersedia di aplikasi HFIS
- Referensi jadwal dokter berdasarkan kode poli dan tanggal
- Referensi poli fingerprint
- Referensi pasien fingerprint berdasarkan NIK atau nomor kartu
- Update jadwal dokter berdasarkan hari dan jam praktik
- Penambahan antrean pasien dengan berbagai informasi
- Penambahan antrean farmasi
- Update waktu antrean sesuai dengan task ID (1-7, 99 untuk pembatalan)
- Pembatalan antrean dengan keterangan
- Get list task ID untuk melihat riwayat waktu pelayanan
- Dashboard waktu tunggu per tanggal
- Dashboard waktu tunggu per bulan
- Antrean per tanggal
- Antrean per kode booking
- Antrean aktif (belum dilayani)
- Antrean aktif per poli, dokter, hari, dan jam praktek

### 13. Apotek
- Referensi DPHO (Daftar Obat DPHO)
- Referensi poli untuk apotek
- Referensi fasilitas kesehatan untuk apotek
- Setting apotek
- Referensi spesialistik untuk apotek
- Referensi obat untuk apotek
- Penyimpanan obat non racikan
- Penyimpanan obat racikan
- Update stok obat
- Hapus pelayanan obat
- Daftar pelayanan obat
- Riwayat pelayanan obat
- Simpan resep
- Hapus resep
- Daftar resep
- Cari SEP berdasarkan nomor SEP
- Data klaim apotek
- Rekap peserta PRB

### 14. PCare
- Get data diagnosa
- Get data dokter
- Get data club prolanis
- Get data kegiatan kelompok
- Get data peserta kegiatan kelompok
- Add kegiatan kelompok
- Add peserta kegiatan kelompok
- Delete kegiatan kelompok
- Delete peserta kegiatan kelompok
- Get data kesadaran
- Get data rujukan
- Get data riwayat kunjungan
- Add kunjungan
- Edit kunjungan
- Delete kunjungan

### 15. Data Referensi
- Mendapatkan data referensi diagnosa (ICD-10) berdasarkan kode atau nama
- Mendapatkan data referensi poli berdasarkan kode atau nama
- Mendapatkan data referensi fasilitas kesehatan berdasarkan nama/kode dan jenis faskes
- Mendapatkan data referensi dokter DPJP berdasarkan jenis pelayanan, tanggal pelayanan, dan spesialis
- Mendapatkan data referensi propinsi, kabupaten, dan kecamatan
- Mendapatkan data referensi diagnosa dan obat program PRB
- Mendapatkan data referensi procedure/tindakan
- Mendapatkan data referensi kelas rawat, spesialistik, ruang rawat
- Mendapatkan data referensi cara keluar dan pasca pulang

### 16. Monitoring
- Data kunjungan berdasarkan tanggal dan jenis pelayanan (rawat inap/rawat jalan)
- Data klaim berdasarkan tanggal pulang, jenis pelayanan, dan status klaim
- Histori pelayanan peserta berdasarkan nomor kartu dan rentang tanggal
- Data klaim jaminan Jasa Raharja

### 17. Data Master
- Mendapatkan daftar poli yang terdaftar di Faskes
- Mendapatkan daftar dokter yang aktif di Faskes
- Sinkronisasi data master dengan sistem BPJS

### 18. Pengaturan Kredensial
- Menyimpan kredensial API BPJS Kesehatan (Username, Password, API Key, Consumer Secret, User Key)
- Mengelola konfigurasi endpoint API
- Menggunakan database untuk menyimpan kredensial secara aman

## Endpoint API

- `POST /api/bpjs/credentials`: Mengatur kredensial BPJS Kesehatan
- `PUT /api/bpjs/config`: Mengatur konfigurasi API
- `GET /api/bpjs/vclaim/peserta/kartu/:noKartu`: Mendapatkan data peserta VClaim berdasarkan nomor kartu
- `GET /api/bpjs/vclaim/peserta/nik/:nik`: Mendapatkan data peserta VClaim berdasarkan NIK
- `POST /api/bpjs/vclaim2/sep/1.1/insert`: Membuat SEP versi 1.1 (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/1.1/update`: Memperbarui SEP versi 1.1 (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/1.1/delete`: Menghapus SEP versi 1.1 (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/:noSEP`: Mendapatkan data SEP berdasarkan nomor SEP (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/lastsep/norujukan/:noRujukan`: Mendapatkan data SEP terakhir berdasarkan nomor rujukan (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/2.0/insert`: Membuat SEP versi 2.0 (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/2.0/update`: Memperbarui SEP versi 2.0 (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/2.0/delete`: Menghapus SEP versi 2.0 (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/updtglplg`: Update tanggal pulang SEP (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/pengajuan`: Pengajuan SEP (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/approve`: Approval SEP (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/cbg/:noSep`: Mendapatkan data SEP untuk integrasi Inacbg (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/internal/:noSep`: Mendapatkan data SEP internal (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/internal/delete`: Menghapus SEP internal (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/persetujuanSEP/list/bulan/:bulan/tahun/:tahun`: Mendapatkan list persetujuan SEP (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/updtglplg/list/bulan/:bulan/tahun/:tahun/:filter`: Mendapatkan list update tanggal pulang (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/2.0/updtglplg`: Update tanggal pulang SEP 2.0 (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/fingerprint/peserta/:noKartu/tglPelayanan/:tglPelayanan`: Mendapatkan status validasi fingerprint (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/fingerprint/list/tglPelayanan/:tglPelayanan`: Mendapatkan list validasi fingerprint (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/fingerprint/randomquestion/:noKartu/tglSep/:tglSep`: Mendapatkan random question untuk verifikasi (VClaim 2.0)
- `POST /api/bpjs/vclaim2/sep/fingerprint/randomanswer`: Submit jawaban random untuk verifikasi (VClaim 2.0)
- `GET /api/bpjs/vclaim2/sep/kllinduk/list/:noKartu`: Mendapatkan data SEP induk kecelakaan (VClaim 2.0)
- `GET /api/bpjs/vclaim2/suplesi/:noKartu/:tglPelayanan`: Mendapatkan data potensi suplesi Jasa Raharja (VClaim 2.0)
- `POST /api/bpjs/vclaim2/rujukan/insert`: Membuat rujukan antar RS (VClaim 2.0)
- `POST /api/bpjs/vclaim2/rujukan/update`: Memperbarui rujukan antar RS (VClaim 2.0)
- `POST /api/bpjs/vclaim2/rujukan/delete`: Menghapus rujukan antar RS (VClaim 2.0)
- `POST /api/bpjs/vclaim2/kontrol/insert`: Membuat surat kontrol (VClaim 2.0)
- `POST /api/bpjs/vclaim2/kontrol/update`: Memperbarui surat kontrol (VClaim 2.0)
- `POST /api/bpjs/vclaim2/kontrol/delete`: Menghapus surat kontrol (VClaim 2.0)
- `POST /api/bpjs/vclaim2/spri/insert`: Membuat SPRI (VClaim 2.0)
- `POST /api/bpjs/vclaim2/spri/update`: Memperbarui SPRI (VClaim 2.0)
- `GET /api/bpjs/vclaim2/kontrol/jadwal-spesialistik/:jnsKontrol/:nomor/:tglRencanaKontrol`: Mendapatkan jadwal spesialistik (VClaim 2.0)
- `GET /api/bpjs/vclaim2/kontrol/jadwal-dokter/:jnsKontrol/:kdPoli/:tglRencanaKontrol`: Mendapatkan jadwal dokter (VClaim 2.0)
- `GET /api/bpjs/vclaim2/kontrol/list-sep/:tglAwal/:tglAkhir/:filter`: Mendapatkan list rencana kontrol (VClaim 2.0)
- `GET /api/bpjs/vclaim2/kontrol/:noSuratKontrol`: Mendapatkan data surat kontrol (VClaim 2.0)
- `POST /api/bpjs/vclaim2/kontrol/v2/insert`: Membuat surat kontrol v2 (VClaim 2.0) dengan form PRB
- `POST /api/bpjs/vclaim2/kontrol/v2/update`: Memperbarui surat kontrol v2 (VClaim 2.0) dengan form PRB
- `GET /api/bpjs/vclaim2/kontrol/sepnosep/:noSep`: Mendapatkan data SEP untuk rencana kontrol (VClaim 2.0)
- `GET /api/bpjs/vclaim2/kontrol/list-by-nokartu/:bulan/:tahun/:noKartu/:filter`: Mendapatkan list rencana kontrol by no kartu (VClaim 2.0)
- `GET /api/bpjs/vclaim2/ref/diagnosa/:param`: Mendapatkan referensi diagnosa (VClaim 2.0)
- `GET /api/bpjs/vclaim2/ref/poli/:param`: Mendapatkan referensi poli (VClaim 2.0)
- `GET /api/bpjs/vclaim2/ref/dokter/:param`: Mendapatkan referensi dokter (VClaim 2.0)
- `GET /api/bpjs/vclaim2/ref/faskes/:param1/:param2`: Mendapatkan referensi faskes (VClaim 2.0)
- `POST /api/bpjs/prb/insert`: Membuat PRB baru
- `PUT /api/bpjs/prb/update`: Memperbarui data PRB
- `DELETE /api/bpjs/prb/delete`: Menghapus data PRB
- `GET /api/bpjs/prb/srb/:noSrb/nosep/:noSep`: Mendapatkan data PRB berdasarkan nomor SRB dan SEP
- `GET /api/bpjs/prb/date/:tglMulai/:tglAkhir`: Mendapatkan data PRB berdasarkan rentang tanggal
- `GET /api/bpjs/prb/potensi/:tahun/:bulan`: Mendapatkan rekap data peserta potensi PRB
- `GET /api/bpjs/vclaim2/ref/procedure/:param`: Mendapatkan referensi procedure/tindakan
- `GET /api/bpjs/vclaim2/ref/kelasrawat`: Mendapatkan referensi kelas rawat
- `GET /api/bpjs/vclaim2/ref/ruangrawat`: Mendapatkan referensi ruang rawat
- `GET /api/bpjs/vclaim2/ref/spesialistik`: Mendapatkan referensi spesialistik
- `GET /api/bpjs/vclaim2/ref/carakeluar`: Mendapatkan referensi cara keluar
- `GET /api/bpjs/vclaim2/ref/pascapulang`: Mendapatkan referensi pasca pulang
- `GET /api/bpjs/vclaim2/ref/propinsi`: Mendapatkan referensi propinsi
- `GET /api/bpjs/vclaim2/ref/kabupaten/:propinsiId`: Mendapatkan referensi kabupaten
- `GET /api/bpjs/vclaim2/ref/kecamatan/:kabupatenId`: Mendapatkan referensi kecamatan
- `GET /api/bpjs/vclaim2/ref/dpjp/:pelayanan/:tglPelayanan/:spesialis`: Mendapatkan referensi dokter DPJP
- `GET /api/bpjs/vclaim2/ref/diagnosaprb`: Mendapatkan referensi diagnosa PRB
- `GET /api/bpjs/vclaim2/ref/obatprb/:param`: Mendapatkan referensi obat PRB
- `GET /api/bpjs/monitoring/kunjungan/:tanggal/:jnsPelayanan`: Mendapatkan data kunjungan
- `GET /api/bpjs/monitoring/klaim/:tanggal/:jnsPelayanan/:status`: Mendapatkan data klaim
- `GET /api/bpjs/monitoring/histori/:noKartu/:tglMulai/:tglAkhir`: Mendapatkan histori pelayanan peserta
- `GET /api/bpjs/monitoring/jasaraharja/:jnsPelayanan/:tglMulai/:tglAkhir`: Mendapatkan data klaim jaminan Jasa Raharja
- `GET /api/bpjs/antrean/rs/ref/poli`: Mendapatkan referensi poli Antrean RS
- `GET /api/bpjs/antrean/rs/ref/dokter`: Mendapatkan referensi dokter Antrean RS
- `GET /api/bpjs/antrean/rs/ref/jadwaldokter/:kodePoli/:tanggal`: Mendapatkan referensi jadwal dokter Antrean RS
- `GET /api/bpjs/antrean/rs/ref/poli/fp`: Mendapatkan referensi poli fingerprint Antrean RS
- `GET /api/bpjs/antrean/rs/ref/pasien/fp/identitas/:nik/noidentitas/:noka`: Mendapatkan referensi pasien fingerprint Antrean RS
- `POST /api/bpjs/antrean/rs/jadwaldokter/update`: Update jadwal dokter Antrean RS
- `POST /api/bpjs/antrean/rs/add`: Menambahkan antrean Antrean RS
- `POST /api/bpjs/antrean/rs/farmasi/add`: Menambahkan antrean farmasi Antrean RS
- `POST /api/bpjs/antrean/rs/updatewaktu`: Update waktu antrean Antrean RS
- `POST /api/bpjs/antrean/rs/batal`: Membatalkan antrean Antrean RS
- `POST /api/bpjs/antrean/rs/getlisttask/:kodeBooking`: Mendapatkan list task antrean Antrean RS
- `GET /api/bpjs/antrean/rs/dashboard/waktutunggu/tanggal/:tanggal/waktu/:waktu`: Mendapatkan dashboard antrean per tanggal
- `GET /api/bpjs/antrean/rs/dashboard/waktutunggu/bulan/:bulan/tahun/:tahun/waktu/:waktu`: Mendapatkan dashboard antrean per bulan
- `GET /api/bpjs/antrean/rs/pendaftaran/tanggal/:tanggal`: Mendapatkan antrean per tanggal
- `GET /api/bpjs/antrean/rs/pendaftaran/kodebooking/:kodeBooking`: Mendapatkan antrean per kode booking
- `GET /api/bpjs/antrean/rs/pendaftaran/aktif`: Mendapatkan antrean aktif (belum dilayani)
- `GET /api/bpjs/antrean/rs/pendaftaran/kodepoli/:kodePoli/kodedokter/:kodeDokter/hari/:hari/jampraktek/:jamPraktek`: Mendapatkan antrean aktif per poli, dokter, hari, dan jam praktek
- `GET /api/bpjs/apotek/ref/dpho`: Mendapatkan referensi DPHO untuk apotek
- `GET /api/bpjs/apotek/ref/poli/:param`: Mendapatkan referensi poli untuk apotek
- `GET /api/bpjs/apotek/ref/faskes/:param1/:param2`: Mendapatkan referensi fasilitas kesehatan untuk apotek
- `GET /api/bpjs/apotek/ref/settingppk/read/:param`: Mendapatkan setting apotek
- `GET /api/bpjs/apotek/ref/spesialistik`: Mendapatkan referensi spesialistik untuk apotek
- `GET /api/bpjs/apotek/ref/obat/:param1/:param2/:param3`: Mendapatkan referensi obat untuk apotek
- `POST /api/bpjs/apotek/obatnonracikan/v3/insert`: Menyimpan obat non racikan
- `POST /api/bpjs/apotek/obatracikan/v3/insert`: Menyimpan obat racikan
- `POST /api/bpjs/apotek/updatestok`: Memperbarui stok obat
- `DELETE /api/bpjs/apotek/pelayanan/obat/hapus`: Menghapus pelayanan obat
- `GET /api/bpjs/apotek/obat/daftar/:noSep`: Mendapatkan daftar pelayanan obat
- `GET /api/bpjs/apotek/riwayatobat/:tglAwal/:tglAkhir/:noKartu`: Mendapatkan riwayat pelayanan obat
- `POST /api/bpjs/apotek/sjpresep/v3/insert`: Menyimpan resep
- `DELETE /api/bpjs/apotek/hapusresep`: Menghapus resep
- `POST /api/bpjs/apotek/daftarresep`: Mendapatkan daftar resep
- `GET /api/bpjs/apotek/sep/:noSep`: Mendapatkan data SEP berdasarkan nomor SEP
- `GET /api/bpjs/apotek/monitoring/klaim/:bulan/:tahun/:jenisObat/:status`: Mendapatkan data klaim apotek
- `GET /api/bpjs/apotek/prb/rekappeserta/tahun/:tahun/bulan/:bulan`: Mendapatkan rekap peserta PRB
- `GET /api/bpjs/pcare/diagnosa/:param/:row/:limit`: Mendapatkan data diagnosa PCare
- `GET /api/bpjs/pcare/dokter/:row/:limit`: Mendapatkan data dokter PCare
- `GET /api/bpjs/pcare/kelompok/club/:kdJenisKelompok`: Mendapatkan data club prolanis PCare
- `GET /api/bpjs/pcare/kelompok/kegiatan/:bulan`: Mendapatkan data kegiatan kelompok PCare
- `GET /api/bpjs/pcare/kelompok/peserta/:eduId`: Mendapatkan data peserta kegiatan kelompok PCare
- `POST /api/bpjs/pcare/kelompok/kegiatan`: Menambahkan kegiatan kelompok PCare
- `POST /api/bpjs/pcare/kelompok/peserta`: Menambahkan peserta kegiatan kelompok PCare
- `DELETE /api/bpjs/pcare/kelompok/kegiatan/:eduId`: Menghapus kegiatan kelompok PCare
- `DELETE /api/bpjs/pcare/kelompok/peserta/:eduId/:noKartu`: Menghapus peserta kegiatan kelompok PCare
- `GET /api/bpjs/pcare/kesadaran`: Mendapatkan data kesadaran PCare
- `GET /api/bpjs/pcare/kunjungan/rujukan/:noKunjungan`: Mendapatkan data rujukan PCare
- `GET /api/bpjs/pcare/kunjungan/peserta/:noKartu`: Mendapatkan data riwayat kunjungan PCare
- `POST /api/bpjs/pcare/kunjungan`: Menambahkan kunjungan PCare
- `PUT /api/bpjs/pcare/kunjungan`: Mengedit kunjungan PCare
- `DELETE /api/bpjs/pcare/kunjungan/:noKunjungan`: Menghapus kunjungan PCare
- `GET /api/bpjs/antrean/rs/:tanggal/poli/:kodePoli`: Mendapatkan data antrean RS
- `GET /api/bpjs/apotek/resep/:kodeBooking`: Mendapatkan data resep Apotek
- `GET /api/bpjs/icare/nik/:nik`: Mendapatkan data iCare
- `GET /api/bpjs/aplicares/ref/kelas`: Mendapatkan referensi kelas kamar
- `POST /api/bpjs/aplicares/bed/update/:kodeppk`: Update ketersediaan tempat tidur
- `POST /api/bpjs/aplicares/bed/create/:kodeppk`: Tambah ruangan baru
- `GET /api/bpjs/aplicares/bed/read/:kodeppk/:start/:limit`: Lihat ketersediaan kamar RS
- `POST /api/bpjs/aplicares/bed/delete/:kodeppk`: Hapus ruangan
- `GET /api/bpjs/poli`: Mendapatkan daftar poli
- `GET /api/bpjs/dokter`: Mendapatkan daftar dokter

## Proses Otentikasi

1. Sistem menggunakan otentikasi berbasis username, password, API key (Cons ID), consumer secret, dan user key
2. Kredensial disimpan di database untuk persistensi
3. Timestamp dihasilkan untuk setiap permintaan
4. Signature dihasilkan berdasarkan kombinasi data untuk keamanan
5. Setiap permintaan API dilindungi dengan header otentikasi yang sesuai

## Integrasi dengan Sistem Lain

- Terhubung dengan modul pendaftaran untuk verifikasi peserta sebelum registrasi
- Dapat digunakan bersama sistem iDRG untuk proses klaim
- Membantu dalam pelaporan ke BPJS Kesehatan
- Integrasi dengan sistem antrean rumah sakit
- Integrasi dengan sistem manajemen rawat inap untuk ketersediaan tempat tidur

## Konfigurasi

Untuk mengaktifkan integrasi BPJS Kesehatan, Anda perlu:

1. Mendaftar sebagai mitra BPJS Kesehatan di https://dvlp.bpjs-kesehatan.go.id:8888/trust-mark/login.html
2. Mendapatkan Username, Password, API Key (Cons ID), Consumer Secret, dan User Key
3. Mengonfigurasi kredensial melalui antarmuka pengaturan
4. Menguji koneksi untuk memastikan integrasi berfungsi

Endpoint default untuk pengembangan:
- VClaim: https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev
- VClaim 2.0: https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev
- Antrean RS: https://apijkn-dev.bpjs-kesehatan.go.id/antreanrs_dev
- Antrean FKTP: https://apijkn-dev.bpjs-kesehatan.go.id/antreanfktp_dev
- Apotek: https://apijkn-dev.bpjs-kesehatan.go.id/apotek-rest-dev
- PCare: https://apijkn-dev.bpjs-kesehatan.go.id/pcare-rest-dev
- iCare JKN: https://apijkn-dev.bpjs-kesehatan.go.id/ihs_dev
- eRekamMedis: https://apijkn-dev.bpjs-kesehatan.go.id/erekammedis_dev
- Aplicares: https://apijkn-dev.bpjs-kesehatan.go.id/aplicaresws

Pastikan untuk selalu menjaga kerahasiaan kredensial ini dan tidak menyimpannya dalam bentuk teks biasa di luar sistem yang aman.
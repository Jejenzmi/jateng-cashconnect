# Implementasi Keamanan untuk Integrasi BPJS Kesehatan

## Overview

Dalam mengakses web-service dari BPJS Kesehatan, diperlukan beberapa komponen keamanan untuk memastikan bahwa komunikasi antara sistem SIMRS ZEN dan server BPJS Kesehatan aman dan terotentikasi. Dokumentasi ini menjelaskan cara implementasi pembuatan signature, proses dekripsi respons, dan integrasi dengan berbagai endpoint termasuk SEP (Surat Eligibilitas Peserta), Antrean RS, Apotek, dan PCare dari BPJS Kesehatan.

## Komponen Keamanan

Setiap pemanggilan web-service BPJS Kesehatan harus menyertakan beberapa header yang diperlukan untuk otentikasi dan validasi:

| Nama Header | Deskripsi |
|-------------|-----------|
| X-Cons-ID | Consumer ID dari BPJS Kesehatan |
| X-timestamp | Unix-based timestamp |
| X-signature | Generated signature dengan pola HMAC-256 |
| X-authorization | Generated signature dengan pola Base64 (untuk PCare) |
| User-Key | User key untuk akses webservice |

## Pembuatan Signature

### Algoritma
- Metode: HMAC-SHA256
- Parameter: `consID&timestamp`
- Key: `consumerSecret`

### Contoh Implementasi di TypeScript

```typescript
import * as crypto from 'crypto';

/**
 * Fungsi untuk membuat signature untuk otentikasi API BPJS
 * @param consumerId Consumer ID dari BPJS Kesehatan
 * @param consumerSecret Consumer Secret dari BPJS Kesehatan
 * @returns Object berisi timestamp dan signature
 */
export function createBpjsSignature(consumerId: string, consumerSecret: string): { timestamp: string; signature: string } {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const dataToSign = consumerId + '&' + timestamp;
  
  const signature = crypto
    .createHmac('sha256', consumerSecret)
    .update(dataToSign)
    .digest('base64');
  
  return {
    timestamp,
    signature
  };
}

/**
 * Fungsi untuk membuat header otentikasi BPJS (untuk VClaim)
 * @param consumerId Consumer ID dari BPJS Kesehatan
 * @param consumerSecret Consumer Secret dari BPJS Kesehatan
 * @param userKey User key dari BPJS Kesehatan
 * @returns Object berisi header yang diperlukan
 */
export function createBpjsAuthHeaders(
  consumerId: string, 
  consumerSecret: string, 
  userKey: string
): Record<string, string> {
  const { timestamp, signature } = createBpjsSignature(consumerId, consumerSecret);
  
  return {
    'X-Cons-ID': consumerId,
    'X-Timestamp': timestamp,
    'X-Signature': signature,
    'User-Key': userKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

/**
 * Fungsi untuk membuat header otentikasi BPJS (untuk PCare)
 * @param consumerId Consumer ID dari BPJS Kesehatan
 * @param consumerSecret Consumer Secret dari BPJS Kesehatan
 * @param userKey User key dari BPJS Kesehatan
 * @param username Username dari akun PCare
 * @param password Password dari akun PCare
 * @returns Object berisi header yang diperlukan
 */
export function createBpjsPcareAuthHeaders(
  consumerId: string, 
  consumerSecret: string, 
  userKey: string,
  username: string,
  password: string
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureData = consumerId + '&' + timestamp;
  const signature = crypto
    .createHmac('sha256', consumerSecret)
    .update(signatureData)
    .digest('base64');

  // Membuat authorization
  const authData = `${username}:${password}:095`;
  const authorization = Buffer.from(authData).toString('base64');

  return {
    'X-Cons-ID': consumerId,
    'X-Timestamp': timestamp,
    'X-Signature': signature,
    'X-Authorization': authorization,
    'User-Key': userKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}
```

## Proses Dekripsi Respons

Respons dari web-service BPJS Kesehatan dikembalikan dalam bentuk yang telah dikompres dan dienkripsi:

- Kompresi: Lz-string
- Enkripsi: AES 256 (mode CBC) - SHA256
- Kunci enkripsi: `consid + conspwd + timestamp request` (concatenate string)

### Contoh Implementasi Dekripsi di TypeScript

```typescript
import * as crypto from 'crypto';
import * as lzString from 'lz-string';

/**
 * Fungsi untuk mendekripsi respons dari BPJS Kesehatan
 * @param encryptedData Data terenkripsi dari respons API
 * @param consumerId Consumer ID dari BPJS Kesehatan
 * @param consumerSecret Consumer Secret dari BPJS Kesehatan
 * @param timestamp Timestamp yang digunakan dalam request
 * @returns Data yang telah didekripsi dan didekompresi
 */
export function decryptBpjsResponse(
  encryptedData: string, 
  consumerId: string, 
  consumerSecret: string, 
  timestamp: string
): any {
  // Buat kunci enkripsi dari concatenasi consid, conspwd dan timestamp
  const encryptionKey = consumerId + consumerSecret + timestamp;
  
  // Generate key dan IV dari SHA-256 hash dari encryptionKey
  const keyHash = crypto.createHash('sha256').update(encryptionKey).digest();
  const key = keyHash.slice(0, 32); // Ambil 32 byte untuk kunci AES
  const iv = keyHash.slice(0, 16);  // Ambil 16 byte pertama untuk IV
  
  // Dekripsi dengan AES-256-CBC
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  // Dekompresi dengan LZ-String
  const decompressed = lzString.decompressFromUTF16(decrypted);
  
  // Parse JSON jika berhasil
  return JSON.parse(decompressed);
}
```

## Endpoint Monitoring, PRB, Referensi, Rujukan, SEP, Approval, Antrean RS, Apotek, dan PCare

Beberapa endpoint monitoring, PRB, referensi, rujukan, SEP (Surat Eligibilitas Peserta), approval, Antrean RS, Apotek, dan PCare dari BPJS Kesehatan juga memerlukan header otentikasi yang sama:

1. **Data Kunjungan**
   - URL: `{Base URL}/Monitoring/Kunjungan/Tanggal/{Parameter 1}/JnsPelayanan/{Parameter 2}`
   - Method: GET
   - Parameter 1: Tanggal SEP format: yyyy-mm-dd
   - Parameter 2: Jenis Pelayanan (1. Inap 2. Jalan)

2. **Data Klaim**
   - URL: `{Base URL}/Monitoring/Klaim/Tanggal/{Parameter 1}/JnsPelayanan/{Parameter 2}/Status/{Parameter 3}`
   - Method: GET
   - Parameter 1: Tanggal Pulang format: yyyy-mm-dd
   - Parameter 2: Jenis Pelayanan (1. Inap 2. Jalan)
   - Parameter 3: Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)

3. **Histori Pelayanan Peserta**
   - URL: `{Base URL}/monitoring/HistoriPelayanan/NoKartu/{Parameter 1}/tglMulai/{Parameter 2}/tglAkhir/{Parameter 3}`
   - Method: GET
   - Parameter 1: No.Kartu Peserta
   - Parameter 2: Tgl Mulai Pencarian (yyyy-mm-dd)
   - Parameter 3: Tgl Akhir Pencarian (yyyy-mm-dd)

4. **Data Klaim Jaminan Jasa Raharja**
   - URL: `{Base URL}/monitoring/JasaRaharja/JnsPelayanan/{Parameter 1}/tglMulai/{Parameter 2}/tglAkhir/{Parameter 3}`
   - Method: GET
   - Parameter 1: Jenis Pelayanan (1. Rawat Inap, 2. Rawat Jalan)
   - Parameter 2: Tgl Mulai Pencarian (yyyy-mm-dd)
   - Parameter 3: Tgl Akhir Pencarian (yyyy-mm-dd)

5. **Program Rujuk Balik (PRB)**
   - Insert PRB: `{Base URL}/PRB/insert` (Method: POST)
   - Update PRB: `{Base URL}/PRB/Update` (Method: PUT)
   - Delete PRB: `{Base URL}/PRB/Delete` (Method: DELETE)
   - Get PRB by SRB/SEP: `{Base URL}/prb/{Parameter 1}/nosep/{Parameter 2}` (Method: GET)
   - Get PRB by Date Range: `{Base URL}/prb/tglMulai{Parameter 1}/tglAkhir{Parameter 2}` (Method: GET)
   - Get PRB Potential Summary: `{Base URL}/prbpotensi/tahun/{parameter 1}/bulan/{parameter 2}` (Method: GET)

6. **Referensi Data**
   - Diagnosa: `{Base URL}/referensi/diagnosa/{parameter}` (Method: GET)
   - Poli: `{Base URL}/referensi/poli/{Parameter}` (Method: GET)
   - Fasilitas Kesehatan: `{Base URL}/referensi/faskes/{Parameter 1}/{Parameter 2}` (Method: GET)
   - Dokter DPJP: `{Base URL}/referensi/dokter/pelayanan/{Parameter 1}/tglPelayanan/{Parameter 2}/Spesialis/{Parameter 3}` (Method: GET)
   - Propinsi: `{Base URL}/referensi/propinsi` (Method: GET)
   - Kabupaten: `{Base URL}/referensi/kabupaten/propinsi/{Parameter 1}` (Method: GET)
   - Kecamatan: `{Base URL}/referensi/kecamatan/kabupaten/{Parameter 1}` (Method: GET)
   - Diagnosa Program PRB: `{Base URL}/referensi/diagnosaprb` (Method: GET)
   - Obat Generik PRB: `{Base URL}/referensi/obatprb/{Parameter 1}` (Method: GET)
   - Procedure/Tindakan: `{Base URL}/referensi/procedure/{Parameter}` (Method: GET)
   - Kelas Rawat: `{Base URL}/referensi/kelasrawat` (Method: GET)
   - Dokter (untuk LPK): `{Base URL}/referensi/dokter/{Parameter}` (Method: GET)
   - Spesialistik: `{Base URL}/referensi/spesialistik` (Method: GET)
   - Ruang Rawat: `{Base URL}/referensi/ruangrawat` (Method: GET)
   - Cara Keluar: `{Base URL}/referensi/carakeluar` (Method: GET)
   - Pasca Pulang: `{Base URL}/referensi/pascapulang` (Method: GET)

7. **Rujukan Antar RS**
   - Insert Rujukan: `{Base URL}/Rujukan/insert` (Method: POST)
   - Update Rujukan: `{Base URL}/Rujukan/update` (Method: PUT)
   - Delete Rujukan: `{Base URL}/Rujukan/delete` (Method: DELETE)
   - Insert Rujukan 2.0: `{Base URL}/Rujukan/2.0/insert` (Method: POST)
   - Update Rujukan 2.0: `{Base URL}/Rujukan/2.0/Update` (Method: PUT)
   - Insert Rujukan Khusus: `{Base URL}/Rujukan/Khusus/insert` (Method: POST)
   - Delete Rujukan Khusus: `{Base URL}/Rujukan/Khusus/delete` (Method: POST)
   - List Rujukan Khusus: `{Base URL}/Rujukan/Khusus/List/Bulan/{Parameter 1}/Tahun/{Parameter 2}` (Method: GET)
   - List Spesialistik Rujukan: `{Base URL}/Rujukan/ListSpesialistik/PPKRujukan/{Parameter 1}/TglRujukan/{Parameter 2}` (Method: GET)
   - List Sarana Rujukan: `{Base URL}/Rujukan/ListSarana/PPKRujukan/{Parameter 1}` (Method: GET)
   - List Rujukan Keluar: `{Base URL}/Rujukan/Keluar/List/tglMulai/{Parameter 1}/tglAkhir/{Parameter 2}` (Method: GET)
   - Data Rujukan Keluar: `{Base URL}/Rujukan/Keluar/{Parameter 1}` (Method: GET)
   - Data Jumlah SEP Rujukan: `{Base URL}/Rujukan/JumlahSEP/{Parameter 1}/{Parameter 2}` (Method: GET)

8. **Surat Eligibilitas Peserta (SEP)**
   - Insert SEP 1.1: `{Base URL}/SEP/1.1/insert` (Method: POST)
   - Update SEP 1.1: `{Base URL}/SEP/1.1/Update` (Method: PUT)
   - Delete SEP: `{Base URL}/SEP/Delete` (Method: DELETE)
   - Get SEP: `{Base URL}/SEP/{Parameter}` (Method: GET)
   - Get Last SEP by No Rujukan: `{Base URL}/Rujukan/lastsep/norujukan/{Parameter}` (Method: GET)
   - Insert SEP 2.0: `{Base URL}/SEP/2.0/insert` (Method: POST)
   - Update SEP 2.0: `{Base URL}/SEP/2.0/update` (Method: PUT)
   - Delete SEP 2.0: `{Base URL}/SEP/2.0/delete` (Method: DELETE)

9. **Approval dan Suplesi**
   - Get Suplesi Jasa Raharja: `{Base URL}/sep/JasaRaharja/Suplesi/{Parameter 1}/tglPelayanan/{Parameter 2}` (Method: GET)
   - Get Data Induk Kecelakaan: `{Base URL}/sep/KllInduk/List/{Parameter 1}` (Method: GET)
   - Pengajuan SEP: `{Base URL}/Sep/pengajuanSEP` (Method: POST)
   - Approval SEP: `{Base URL}/Sep/aprovalSEP` (Method: POST)
   - List Persetujuan SEP: `{Base URL}/Sep/persetujuanSEP/list/bulan/{Parameter 1}/tahun/{Parameter 2}` (Method: GET)
   - Update Tanggal Pulang: `{Base URL}/Sep/updtglplg` (Method: PUT)
   - Update Tanggal Pulang 2.0: `{Base URL}/SEP/2.0/updtglplg` (Method: PUT)
   - List Update Tanggal Pulang: `{Base URL}/Sep/updtglplg/list/bulan/{Parameter 1}/tahun/{Parameter 2}/{Parameter 3}` (Method: GET)
   - Get SEP for Inacbg: `{Base URL}/sep/cbg/{Parameter}` (Method: GET)
   - Get SEP Internal: `{Base URL}/SEP/Internal/{Parameter}` (Method: GET)
   - Delete SEP Internal: `{Base URL}/SEP/Internal/delete` (Method: DELETE)
   - Get Fingerprint Status: `{Base URL}/SEP/FingerPrint/Peserta/{Parameter1}/TglPelayanan/{Parameter2}` (Method: GET)
   - Get List Fingerprint: `{Base URL}/SEP/FingerPrint/List/Peserta/TglPelayanan/{Parameter}` (Method: GET)
   - Get Random Question: `{Base URL}/SEP/FingerPrint/randomquestion/faskesterdaftar/nokapst/{Parameter1}/tglsep/{Parameter2}` (Method: GET)
   - Submit Random Answer: `{Base URL}/SEP/FingerPrint/randomanswer` (Method: POST)

10. **Antrean RS (HFIS - Hospital First Information System)**
   - Get Referensi Poli: `{Base URL}/ref/poli` (Method: GET)
   - Get Referensi Dokter: `{Base URL}/ref/dokter` (Method: GET)
   - Get Referensi Jadwal Dokter: `{Base URL}/jadwaldokter/kodepoli/{Parameter1}/tanggal/{Parameter2}` (Method: GET)
   - Get Referensi Poli FP: `{Base URL}/ref/poli/fp` (Method: GET)
   - Get Referensi Pasien FP: `{Base URL}/ref/pasien/fp/identitas/{nik/noka}/noidentitas/{noidentitas}` (Method: GET)
   - Update Jadwal Dokter: `{Base URL}/jadwaldokter/updatejadwaldokter` (Method: POST)
   - Tambah Antrean: `{Base URL}/antrean/add` (Method: POST)
   - Tambah Antrean Farmasi: `{Base URL}/antrean/farmasi/add` (Method: POST)
   - Update Waktu Antrean: `{Base URL}/antrean/updatewaktu` (Method: POST)
   - Batal Antrean: `{Base URL}/antrean/batal` (Method: POST)
   - Get List Task: `{Base URL}/antrean/getlisttask` (Method: POST)
   - Dashboard Per Tanggal: `{Base URL}/dashboard/waktutunggu/tanggal/{Parameter1}/waktu/{Parameter2}` (Method: GET)
   - Dashboard Per Bulan: `{Base URL}/dashboard/waktutunggu/bulan/{Parameter1}/tahun/{Parameter2}/waktu/{Parameter3}` (Method: GET)
   - Antrean Per Tanggal: `{Base URL}/antrean/pendaftaran/tanggal/{tanggal}` (Method: GET)
   - Antrean Per Kode Booking: `{Base URL}/antrean/pendaftaran/kodebooking/{kodebooking}` (Method: GET)
   - Antrean Aktif: `{Base URL}/antrean/pendaftaran/aktif` (Method: GET)
   - Antrean Aktif Per Poli Dokter: `{Base URL}/antrean/pendaftaran/kodepoli/{kodepoli}/kodedokter/{kodedokter}/hari/{hari}/jampraktek/{jampraktek}` (Method: GET)

11. **Apotek**
   - Get Referensi DPHO: `{Base URL}/referensi/dpho` (Method: GET)
   - Get Referensi Poli Apotek: `{Base URL}/referensi/poli/{Parameter}` (Method: GET)
   - Get Referensi Fasilitas Kesehatan Apotek: `{Base URL}/referensi/ppk/{Parameter1}/{Parameter2}` (Method: GET)
   - Get Setting Apotek: `{Base URL}/referensi/settingppk/read/{Parameter}` (Method: GET)
   - Get Referensi Spesialistik Apotek: `{Base URL}/referensi/spesialistik` (Method: GET)
   - Get Referensi Obat Apotek: `{Base URL}/referensi/obat/{Parameter1}/{Parameter2}/{Parameter3}` (Method: GET)
   - Simpan Obat Non Racikan: `{Base URL}/obatnonracikan/v3/insert` (Method: POST)
   - Simpan Obat Racikan: `{Base URL}/obatracikan/v3/insert` (Method: POST)
   - Update Stok Obat: `{Base URL}/UpdateStokObat/updatestok` (Method: POST)
   - Hapus Pelayanan Obat: `{Base URL}/pelayanan/obat/hapus/` (Method: DELETE)
   - Daftar Pelayanan Obat: `{Base URL}/obat/daftar/{Parameter1}` (Method: GET)
   - Riwayat Pelayanan Obat: `{Base URL}/riwayatobat/{Parameter1}/{Parameter2}/{Parameter3}` (Method: GET)
   - Simpan Resep: `{Base URL}/sjpresep/v3/insert` (Method: POST)
   - Hapus Resep: `{Base URL}/hapusresep` (Method: DELETE)
   - Daftar Resep: `{Base URL}/daftarresep` (Method: POST)
   - Cari SEP: `{Base URL}/sep/{Parameter1}` (Method: GET)
   - Data Klaim: `{Base URL}/monitoring/klaim/{Parameter1}/{Parameter2}/{Parameter3}/{Parameter4}` (Method: GET)
   - Rekap Peserta PRB: `{Base URL}/Prb/rekappeserta/tahun/{Parameter1}/bulan/{Parameter2}` (Method: GET)

12. **PCare**
   - Get Diagnosa: `{Base URL}/diagnosa/{Parameter1}/{Parameter2}/{Parameter3}` (Method: GET)
   - Get Dokter: `{Base URL}/dokter/{Parameter1}/{Parameter2}` (Method: GET)
   - Get Club Prolanis: `{Base URL}/kelompok/club/{Parameter1}` (Method: GET)
   - Get Kegiatan Kelompok: `{Base URL}/kelompok/kegiatan/{Parameter1}` (Method: GET)
   - Get Peserta Kegiatan Kelompok: `{Base URL}/kelompok/peserta/{Parameter1}` (Method: GET)
   - Add Kegiatan Kelompok: `{Base URL}/kelompok/kegiatan` (Method: POST)
   - Add Peserta Kegiatan Kelompok: `{Base URL}/kelompok/peserta` (Method: POST)
   - Delete Kegiatan Kelompok: `{Base URL}/kelompok/kegiatan/{Parameter1}` (Method: DELETE)
   - Delete Peserta Kegiatan Kelompok: `{Base URL}/kelompok/peserta/{Parameter1}/{Parameter2}` (Method: DELETE)
   - Get Kesadaran: `{Base URL}/kesadaran` (Method: GET)
   - Get Rujukan: `{Base URL}/kunjungan/rujukan/{Parameter1}` (Method: GET)
   - Get Riwayat Kunjungan: `{Base URL}/kunjungan/peserta/{Parameter1}` (Method: GET)
   - Add Kunjungan: `{Base URL}/kunjungan` (Method: POST)
   - Edit Kunjungan: `{Base URL}/kunjungan` (Method: PUT)
   - Delete Kunjungan: `{Base URL}/kunjungan/{Parameter1}` (Method: DELETE)

Semua endpoint monitoring, PRB, referensi, rujukan, SEP, approval, Antrean RS, Apotek, dan PCare ini memerlukan header otentikasi yang sama dengan endpoint lainnya.

## Contoh Penggunaan Lengkap

```typescript
import axios from 'axios';
import { createBpjsAuthHeaders, createBpjsPcareAuthHeaders, decryptBpjsResponse } from './bpjs-security';

async function getBpjsReferenceData(param: string) {
  const consumerId = process.env.BPJS_CONSUMER_ID!;
  const consumerSecret = process.env.BPJS_CONSUMER_SECRET!;
  const userKey = process.env.BPJS_USER_KEY!;
  const baseUrl = process.env.BPJS_BASE_URL!;
  
  const headers = createBpjsAuthHeaders(consumerId, consumerSecret, userKey);
  
  try {
    const response = await axios.get(`${baseUrl}/referensi/diagnosa/${param}`, {
      headers
    });
    
    // Jika respons terenkripsi, kita perlu mendekripsinya
    // const decryptedData = decryptBpjsResponse(response.data, consumerId, consumerSecret, headers['X-Timestamp']);
    
    return response.data;
  } catch (error) {
    console.error('Error getting reference data from BPJS:', error);
    throw error;
  }
}

async function getPcareData(param: string) {
  const consumerId = process.env.BPJS_CONSUMER_ID!;
  const consumerSecret = process.env.BPJS_CONSUMER_SECRET!;
  const userKey = process.env.BPJS_USER_KEY!;
  const username = process.env.BPJS_PCARE_USERNAME!;
  const password = process.env.BPJS_PCARE_PASSWORD!;
  const pcareBaseUrl = process.env.BPJS_PCARE_BASE_URL!;
  
  const headers = createBpjsPcareAuthHeaders(consumerId, consumerSecret, userKey, username, password);
  
  try {
    const response = await axios.get(`${pcareBaseUrl}/diagnosa/${param}/0/10`, {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting PCare data from BPJS:', error);
    throw error;
  }
}
```

## Catatan Penting

1. Consumer Secret hanya disimpan di sisi client dan tidak dikirim ke server BPJS Kesehatan
2. Timestamp harus dalam format unix timestamp (jumlah detik sejak 1 Januari 1970)
3. Setiap request harus memiliki timestamp yang unik untuk mencegah replay attack
4. Pastikan untuk menyimpan kredensial BPJS dengan aman, sebaiknya di environment variables
5. Untuk produksi, pastikan untuk menangani kesalahan secara benar dan log yang sensitif tidak dicatat
6. Endpoint monitoring, PRB, referensi, rujukan, SEP, approval, Antrean RS, Apotek, dan PCare memerlukan otentikasi yang sama dengan endpoint lainnya
7. PCare memiliki mekanisme otentikasi yang berbeda dengan VClaim, yaitu dengan menambahkan header X-Authorization

## Dependencies yang Dibutuhkan

Untuk mengimplementasikan fungsionalitas ini, Anda perlu menginstal beberapa dependencies tambahan:

```bash
npm install crypto-js lz-string
npm install --save-dev @types/lz-string
```

## Kesimpulan

Implementasi keamanan yang benar sangat penting untuk integrasi dengan BPJS Kesehatan. Dengan mengikuti panduan ini, Anda dapat memastikan bahwa komunikasi antara sistem SIMRS ZEN dan server BPJS Kesehatan aman dan terotentikasi.
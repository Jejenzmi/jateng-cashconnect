# Implementasi Kompresi dan Enkripsi BPJS

## Pendahuluan

Dokumen ini menjelaskan implementasi kompresi dan enkripsi yang digunakan dalam layanan BPJS sebagai bagian dari sistem integrasi BPJS dalam sistem SIMRS ZEN. Ini mencakup teknik-teknik yang digunakan untuk mengamankan data yang dikirim ke dan dari layanan BPJS.

## Spesifikasi Otentikasi

### Header yang Dibutuhkan

| Nama Header | Contoh Nilai | Keterangan |
|-------------|--------------|------------|
| X-cons-id | 743627386 | Consumer ID dari BPJS Kesehatan |
| X-timestamp | 234234234 | Generated unix-based timestamp (detik) |
| X-signature | DogC5UiQurNcigrBdQ3QN5oYvXeUF5E82I/LHUcI9v0= | Generated signature dengan pola HMAC-256 |

### Cara Membuat Signature

Untuk dapat mengakses web-service dari BPJS Kesehatan, pemanggil web service akan mendapatkan:
- Consumer ID
- Consumer Secret

Consumer Secret hanya disimpan oleh service consumer dan tidak dikirim ke server. Consumer Secret digunakan untuk membuat signature (X-signature).

Langkah-langkah:
1. Gabungkan Consumer ID dan timestamp: `variabel1 = consumerID + "&" + timestamp`
2. Gunakan HMAC-SHA256 untuk membuat signature:
   - Signature = HMAC-SHA256(variabel1, consumerSecret)

Contoh:
- consumerID: 1234
- consumerSecret: pwd
- timestamp: 433223232
- variabel1: "1234&433223232"

Signature = HMAC-SHA256("1234&433223232", "pwd")

## Kompresi GZip

Untuk mengurangi ukuran data yang dikirim ke layanan BPJS, beberapa endpoint memerlukan kompresi menggunakan metode GZip.

### Implementasi Kompresi GZip dalam TypeScript

```typescript
import { gzipSync, deflateSync, gunzipSync, inflateSync } from 'zlib';

/**
 * Melakukan kompresi data menggunakan GZip
 */
function compressWithGzip(data: string): Buffer {
  return gzipSync(Buffer.from(data, 'utf8'));
}

/**
 * Melakukan dekompresi data menggunakan GZip
 */
function decompressWithGzip(compressedData: Buffer): string {
  return gunzipSync(compressedData).toString('utf8');
}

/**
 * Alternatif menggunakan deflate/inflate
 */
function compressWithDataDeflate(data: string): Buffer {
  return deflateSync(Buffer.from(data, 'utf8'));
}

function decompressWithDataInflate(compressedData: Buffer): string {
  return inflateSync(compressedData).toString('utf8');
}
```

## Enkripsi AES

Beberapa data yang dikirim ke layanan BPJS perlu dienkripsi menggunakan algoritma AES.

### Implementasi Enkripsi AES dalam TypeScript

```typescript
import * as crypto from 'crypto';

/**
 * Fungsi untuk membuat enkripsi AES
 */
function encryptWithAES(data: string, consid: string, conspwd: string, kodefaskes: string): string {
  // Kunci enkripsi adalah kombinasi dari consid + conspwd + kodefaskes
  const key = consid + conspwd + kodefaskes;
  
  // Buat kunci dan IV dari hash SHA-256 dari kunci
  const hash = crypto.createHash('sha256').update(key).digest();
  const aesKey = hash.slice(0, 32); // 32 byte untuk AES-256
  const iv = hash.slice(0, 16);     // 16 byte untuk IV
  
  // Buat cipher AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  
  // Enkripsi data
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return encrypted;
}

/**
 * Fungsi untuk mendekripsi data AES
 */
function decryptWithAES(encryptedData: string, consid: string, conspwd: string, kodefaskes: string): string {
  // Kunci dekripsi adalah kombinasi dari consid + conspwd + kodefaskes
  const key = consid + conspwd + kodefaskes;
  
  // Buat kunci dan IV dari hash SHA-256 dari kunci
  const hash = crypto.createHash('sha256').update(key).digest();
  const aesKey = hash.slice(0, 32); // 32 byte untuk AES-256
  const iv = hash.slice(0, 16);     // 16 byte untuk IV
  
  // Buat decipher AES-256-CBC
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  
  // Dekripsi data
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Fungsi untuk mendapatkan kunci dan IV dari string kunci
 */
function getHashKeys(key: string): [Buffer, Buffer] {
  const hash = crypto.createHash('sha256').update(key).digest();
  const aesKey = hash.slice(0, 32); // 32 byte untuk AES-256
  const iv = hash.slice(0, 16);     // 16 byte untuk IV
  return [aesKey, iv];
}
```

## Kombinasi Kompresi dan Enkripsi

Untuk endpoint yang memerlukan kompresi dan enkripsi, urutan yang benar adalah:

1. Kompresi data menggunakan GZip
2. Enkripsi hasil kompresi menggunakan AES

### Implementasi Kombinasi dalam TypeScript

```typescript
/**
 * Kompresi dan enkripsi data
 */
function compressAndEncrypt(data: string, consid: string, conspwd: string, kodefaskes: string): string {
  // Langkah 1: Kompres data
  const compressedData = gzipSync(Buffer.from(data, 'utf8'));
  
  // Langkah 2: Enkripsi data yang telah dikompresi
  const key = consid + conspwd + kodefaskes;
  const hash = crypto.createHash('sha256').update(key).digest();
  const aesKey = hash.slice(0, 32);
  const iv = hash.slice(0, 16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(compressedData);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Kembalikan dalam bentuk base64
  return encrypted.toString('base64');
}

/**
 * Dekripsi dan dekompresi data
 */
function decryptAndDecompress(encryptedData: string, consid: string, conspwd: string, kodefaskes: string): string {
  // Decode dari base64
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  
  // Langkah 1: Dekripsi data
  const key = consid + conspwd + kodefaskes;
  const hash = crypto.createHash('sha256').update(key).digest();
  const aesKey = hash.slice(0, 32);
  const iv = hash.slice(0, 16);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  // Langkah 2: Dekompresi data
  const decompressedData = gunzipSync(decrypted);
  
  return decompressedData.toString('utf8');
}
```

## Penggunaan dalam Layanan BPJS

Contoh penggunaan dalam layanan BPJS untuk mengirim data rekam medis:

```typescript
/**
 * Contoh penggunaan dalam layanan rekam medis
 */
async function sendMedicalRecord(
  noSep: string,
  jnsPelayanan: string,
  bulan: string,
  tahun: string,
  consid: string,
  conspwd: string,
  kodefaskes: string,
  medicalRecordData: any
): Promise<any> {
  // 1. Siapkan data dalam format JSON
  const jsonData = JSON.stringify(medicalRecordData);
  
  // 2. Kompresi dan enkripsi data
  const encryptedData = compressAndEncrypt(jsonData, consid, conspwd, kodefaskes);
  
  // 3. Buat payload untuk dikirim
  const payload = {
    request: {
      noSep,
      jnsPelayanan,
      bulan,
      tahun,
      dataMR: encryptedData
    }
  };
  
  // 4. Buat signature dan header
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature(timestamp, consid, conspwd);
  
  const headers = {
    'X-cons-id': consid,
    'X-timestamp': timestamp.toString(),
    'X-signature': signature,
    'Content-Type': 'application/json'
  };
  
  // 5. Kirim data ke layanan BPJS
  const response = await fetch('https://api.bpjs-kesehatan.go.id/...', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  return response.json();
}

/**
 * Fungsi untuk membuat signature HMAC-SHA256
 */
function generateSignature(timestamp: number, consid: string, conspwd: string): string {
  const dataToSign = `${consid}&${timestamp}`;
  const hmac = crypto.createHmac('sha256', conspwd);
  hmac.update(dataToSign);
  return hmac.digest('base64');
}
```

## Kesimpulan

Implementasi kompresi dan enkripsi BPJS ini sangat penting untuk memastikan bahwa data sensitif pasien dikirim secara aman ke layanan BPJS. Dengan mengikuti spesifikasi yang ditetapkan oleh BPJS, kita memastikan bahwa sistem SIMRS ZEN dapat berkomunikasi dengan aman dan efisien dengan layanan BPJS.
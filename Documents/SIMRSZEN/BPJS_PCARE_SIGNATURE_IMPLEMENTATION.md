# Implementasi Signature dan Dekripsi untuk Integrasi BPJS PCare

## Pendahuluan

Dokumen ini menjelaskan implementasi signature dan dekripsi yang diperlukan untuk berkomunikasi dengan layanan BPJS PCare. Dalam komunikasi dengan layanan BPJS, ada beberapa header HTTP yang wajib disertakan untuk otentikasi dan validasi permintaan.

## Header yang Dibutuhkan

| Nama Header | Contoh Nilai | Keterangan |
|-------------|--------------|------------|
| X-cons-id | 743627386 | Consumer ID dari BPJS Kesehatan |
| X-timestamp | 234234234 | Timestamp dalam format Unix-based |
| X-signature | DogC5UiQurNcigrBdQ3QN5oYvXeUF5E82I/LHUcI9v0= | Signature yang dihasilkan menggunakan HMAC-SHA256 |
| X-authorization | MDkwMzA0MDI6UXdlcnR5MSE6MDk1 | Signature yang dihasilkan dengan Base64 encoding |
| user_key | d795b04f4a72d74fae727be9da0xxxxx | Key untuk akses webservice |

## Penjelasan Header

### X-cons-id
Merupakan kode consumer (pengakses web-service). Kode ini akan diberikan oleh BPJS Kesehatan.

### X-timestamp
Timestamp yang di-generate oleh client saat ingin memanggil setiap service. Format waktu ini ditulis dengan format unix-based-time (jumlah detik sejak 1 Januari 1970). Format waktu menggunakan Coordinated Universal Time (UTC).

### X-signature
Hasil dari pembuatan signature yang dibuat oleh client menggunakan metode HMAC-SHA256.

### X-authorization
Kombinasi dari username dan password aplikasi yang akan di-bridging, dengan enkripsi Base64.
Format: Base64(username:password:kdAplikasi)

### user_key
Key untuk mengakses webservice. Setiap service consumer memiliki user_key masing-masing.

## Proses Pembuatan Signature

Untuk mengakses web-service dari BPJS Kesehatan, pemanggil (service consumer) akan mendapatkan:
- Consumer ID
- Consumer Secret

Consumer Secret hanya disimpan oleh service consumer dan tidak dikirim ke server. Consumer Secret digunakan untuk men-generate Signature (X-signature).

### Langkah-langkah Pembuatan Signature

1. Gabungkan Consumer ID dan timestamp: `variabel1 = consumerID + "&" + timestamp`
2. Gunakan HMAC-SHA256 untuk membuat signature:
   - Signature = HMAC-SHA256(variabel1, consumerSecret)
   
### Contoh Perhitungan
- consumerID: 1234
- consumerSecret: pwd
- timestamp: 433223232
- variabel1: "1234&433223232"

Signature = HMAC-SHA256("1234&433223232", "pwd")

## Implementasi dalam TypeScript

```typescript
import * as crypto from 'crypto';
import * as axios from 'axios';

export class BpjsPcareSignature {
  private consumerId: string;
  private consumerSecret: string;
  private username: string;
  private password: string;
  private kdAplikasi: string;
  private userKey: string;
  private baseUrl: string;

  constructor(
    consumerId: string,
    consumerSecret: string,
    username: string,
    password: string,
    kdAplikasi: string,
    userKey: string,
    baseUrl: string
  ) {
    this.consumerId = consumerId;
    this.consumerSecret = consumerSecret;
    this.username = username;
    this.password = password;
    this.kdAplikasi = kdAplikasi;
    this.userKey = userKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Menghasilkan timestamp dalam format Unix (detik sejak 1 Jan 1970)
   */
  private getUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Membuat signature menggunakan HMAC-SHA256
   */
  private generateSignature(timestamp: number): string {
    const dataToSign = `${this.consumerId}&${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.consumerSecret);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  }

  /**
   * Membuat header otentikasi dalam format Base64
   */
  private generateAuthorizationHeader(): string {
    const authString = `${this.username}:${this.password}:${this.kdAplikasi}`;
    return Buffer.from(authString).toString('base64');
  }

  /**
   * Membuat konfigurasi header untuk permintaan ke layanan BPJS
   */
  private createHeaders(): Record<string, string> {
    const timestamp = this.getUnixTimestamp();
    const signature = this.generateSignature(timestamp);
    const authorization = this.generateAuthorizationHeader();

    return {
      'X-cons-id': this.consumerId,
      'X-timestamp': timestamp.toString(),
      'X-signature': signature,
      'X-authorization': `Basic ${authorization}`,
      'user_key': this.userKey,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  /**
   * Melakukan permintaan GET ke layanan BPJS
   */
  async get(endpoint: string): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await axios.get(url, { headers });
      return this.decryptResponse(response.data);
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan POST ke layanan BPJS
   */
  async post(endpoint: string, data: any): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await axios.post(url, data, { headers });
      return this.decryptResponse(response.data);
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan PUT ke layanan BPJS
   */
  async put(endpoint: string, data: any): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await axios.put(url, data, { headers });
      return this.decryptResponse(response.data);
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan DELETE ke layanan BPJS
   */
  async delete(endpoint: string): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await axios.delete(url, { headers });
      return this.decryptResponse(response.data);
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Mendekripsi respons dari layanan BPJS
   * Respons dari BPJS dikompresi menggunakan lz-string dan dienkripsi menggunakan AES-256-CBC
   */
  private decryptResponse(encryptedResponse: any): any {
    // Jika respons tidak terenkripsi, langsung kembalikan
    if (typeof encryptedResponse !== 'string') {
      return encryptedResponse;
    }

    // Implementasi dekripsi akan dilakukan sesuai dokumentasi BPJS
    // Kunci dekripsi: consid + conspwd + timestamp request
    // Metode enkripsi: AES-256 (mode CBC) - SHA256
    // Metode kompresi: Lz-string
    
    // Karena implementasi lengkap dekripsi memerlukan library tambahan seperti lz-string dan crypto,
    // kita hanya menyediakan kerangka di sini
    console.log('Response decryption needed but not fully implemented yet');
    return encryptedResponse;
  }
}
```

## Implementasi Dekripsi Respons

Respons dari layanan BPJS sudah dalam bentuk terkompresi dan terenkripsi:
- Kompresi menggunakan metode: Lz-string
- Enkripsi menggunakan metode: AES 256 (mode CBC) - SHA256
- Kunci enkripsi: `consid + conspwd + timestamp request` (concatenate string)

### Langkah-langkah Dekripsi
1. Dekripsi menggunakan AES-256 (mode CBC) - SHA256
2. Dekompresi menggunakan Lz-string (decompressFromEncodedURIComponent)
3. Kunci: `consid + conspwd + timestamp request` (concatenate string)

### Implementasi Dekripsi dalam TypeScript

```typescript
import * as crypto from 'crypto';
import * as LZString from 'lz-string';

/**
 * Fungsi untuk mendekripsi respons dari layanan BPJS
 */
export function decryptBpjsResponse(
  encryptedData: string,
  consumerId: string,
  consumerSecret: string,
  timestamp: number
): any {
  // Buat kunci dari gabungan: consumerId + consumerSecret + timestamp
  const keyString = `${consumerId}${consumerSecret}${timestamp}`;
  
  // Hash kunci menggunakan SHA-256 untuk mendapatkan kunci 32-byte
  const key = crypto.createHash('sha256').update(keyString).digest();
  
  // Ambil 16 byte pertama dari hash untuk digunakan sebagai IV
  const iv = key.slice(0, 16);
  
  // Pisahkan IV dan ciphertext
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  // Dekompresi menggunakan LZ-String
  const decompressed = LZString.decompressFromUTF16(decrypted);
  
  // Parse JSON dari hasil dekompresi
  return JSON.parse(decompressed);
}
```

## Contoh Penggunaan

```typescript
// Konfigurasi BPJS
const bpjsConfig = {
  consumerId: '1234',
  consumerSecret: 'your_secret_here',
  username: 'usernamePcare',
  password: 'passwordPcare',
  kdAplikasi: '095',
  userKey: 'd795b04f4a72d74fae727be9da0xxxxx',
  baseUrl: 'https://pcare.bpjs-kesehatan.go.id'
};

// Inisialisasi klien
const bpjsClient = new BpjsPcareSignature(
  bpjsConfig.consumerId,
  bpjsConfig.consumerSecret,
  bpjsConfig.username,
  bpjsConfig.password,
  bpjsConfig.kdAplikasi,
  bpjsConfig.userKey,
  bpjsConfig.baseUrl
);

// Contoh penggunaan untuk mendapatkan data diagnosa
try {
  const diagnosa = await bpjsClient.get('diagnosa/A001/0/10');
  console.log(diagnosa);
} catch (error) {
  console.error('Error:', error);
}
```

## Instalasi Dependencies

Untuk menggunakan implementasi di atas, Anda perlu menginstal beberapa dependensi:

```bash
npm install crypto-js lz-string axios @types/node
```

Catatan: Untuk Node.js versi tertentu, Anda mungkin perlu menginstal `@types/crypto-js` juga.

## Kesimpulan

Implementasi signature dan dekripsi sangat penting dalam komunikasi dengan layanan BPJS PCare. Dengan mengikuti spesifikasi yang telah ditentukan oleh BPJS, aplikasi kita dapat secara aman berkomunikasi dengan layanan mereka dan memproses data yang dikembalikan.

Pastikan untuk menyimpan informasi sensitif seperti `consumerSecret`, `username`, dan `password` dalam konfigurasi yang aman dan tidak dipublikasikan.
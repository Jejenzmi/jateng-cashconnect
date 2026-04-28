# Implementasi Layanan Antrean BPJS yang Diakses oleh Sistem FKTP

## Pendahuluan

Dokumen ini menjelaskan implementasi layanan Antrean BPJS yang diakses oleh sistem FKTP (Fasilitas Kesehatan Tingkat Pertama) sebagai bagian dari sistem integrasi BPJS dalam sistem SIMRS ZEN. Layanan ini memungkinkan FKTP untuk mengelola antrean pasien BPJS yang dirujuk ke rumah sakit.

## Endpoint yang Tersedia

### 1. Referensi Poli
- **URL**: `{BASE URL}/{Service Name}/ref/poli/tanggal/{tanggal}`
- **Fungsi**: Melihat referensi poli
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-cons-id`: Consumer ID akses
  - `x-timestamp`: Timestamp akses
  - `x-signature`: Signature akses
  - `user_key`: User key akses

#### Contoh Respon:
```json
{
    "metadata": {
        "code": 1,
        "message": "OK"
    },
    "response": {
        "list": [
            {
                "namapoli": "POLI UMUM",
                "nmsubspesialis": "AKUPUNTUR MEDIK",
                "kdsubspesialis": "AKP",
                "kodepoli": "001"
            },
            {
                "namapoli": "POLI GIGI & MULUT",
                "kodepoli": "002"
            }
        ]
    }
}
```

**Catatan**: Respons perlu dilakukan dekripsi di sisi klien.

### 2. Referensi Dokter
- **URL**: `{BASE URL}/{Service Name}/ref/dokter/kodepoli/{kodepoli}/tanggal/{tanggal}`
- **Fungsi**: Melihat list dokter per poli
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-cons-id`: Consumer ID akses
  - `x-timestamp`: Timestamp akses
  - `x-signature`: Signature akses
  - `user_key`: User key akses

#### Contoh Respon:
```json
{
    "metadata": {
        "code": 1,
        "message": "OK"
    },
    "response": {
        "list": [
            {
                "namadokter": "drg. Kusumawati Sukadi, Sp.BM",
                "kodedokter": 700,
                "jampraktek": "07:00-12:00",
                "kapasitas": 100
            },
            {
                "namadokter": "Dr. Dr. Noer Rachma, Sp.KFR",
                "kodedokter": 854,
                "jampraktek": "12:00-16:00",
                "kapasitas": 60
            }
        ]
    }
}
```

**Catatan**: Respons perlu dilakukan dekripsi di sisi klien.

### 3. Tambah Antrean
- **URL**: `{BASE URL}/{Service Name}/antrean/add`
- **Fungsi**: Menambah Antrean
- **Method**: POST
- **Format**: JSON

#### Contoh Request:
```json
{
   "nomorkartu": "00012345678",
   "nik": "3212345678987654",
   "nohp": "085635228888",
   "kodepoli": "ANA",
   "namapoli": "Anak",
   "norm": "123345",
   "tanggalperiksa": "2021-01-28",
   "kodedokter": 12345,
   "namadokter": "Dr. Hendra",
   "jampraktek": "08:00-16:00",
   "nomorantrean": "A-12",
   "angkaantrean": 12,
   "keterangan": ""
}
```

#### Contoh Respon:
```json
{
   "metadata": {
      "message": "Ok",
      "code": 200
   }
}
```

### 4. Update Status / Panggil Antrean
- **URL**: `{BASE URL}/{Service Name}/antrean/panggil`
- **Fungsi**: Update status antrean hadir/tidak hadir
- **Method**: POST
- **Format**: JSON
- **Header**:
  - `x-cons-id`: Consumer ID akses
  - `x-timestamp`: Timestamp akses
  - `x-signature`: Signature akses
  - `user_key`: User key akses

#### Contoh Request:
```json
{
   "tanggalperiksa": "2024-03-01",
   "kodepoli": "001",
   "nomorkartu": "0000034563234",
   "status": 1,
   "waktu": 1616559330000
}
```

**Deskripsi field status**:
- `status`: 1 = Hadir; 2 = Tidak Hadir
- `waktu`: Waktu dalam bentuk timestamp milidetik

#### Contoh Respon:
```json
{
   "metadata": {
      "message": "Ok",
      "code": 200
   }
}
```

### 5. Batal Antrean
- **URL**: `{BASE URL}/{Service Name}/antrean/batal`
- **Fungsi**: Membatalkan antrean pasien
- **Method**: POST
- **Format**: JSON
- **Header**:
  - `x-cons-id`: Consumer ID akses
  - `x-timestamp`: Timestamp akses
  - `x-signature`: Signature akses
  - `user_key`: User key akses

#### Contoh Request:
```json
{
   "tanggalperiksa": "2024-01-03",
   "kodepoli": "001",
   "nomorkartu": "0000045258563",
   "alasan": "Terjadi perubahan jadwal dokter"
}
```

#### Contoh Respon:
```json
{
   "metadata": {
      "message": "Ok",
      "code": 200
   }
}
```

## Kode Metadata

- code: 1 atau 200: Sukses
- code: selain itu: Gagal

## Implementasi dalam TypeScript

Berikut adalah implementasi layanan Antrean BPJS FKTP dalam TypeScript:

```typescript
import axios, { AxiosRequestConfig } from 'axios';
import { BpjsDecryptUtils } from './bpjs-decrypt-utils';

export interface BpjsAntreanFktpConfig {
  consumerId: string;
  consumerSecret: string;
  userKey: string;
  baseUrl: string;
  serviceName: string;
}

export interface RefPoliResponse {
  metadata: {
    code: number;
    message: string;
  };
  response: {
    list: Array<{
      namapoli: string;
      nmsubspesialis?: string;
      kdsubspesialis?: string;
      kodepoli: string;
    }>;
  };
}

export interface RefDokterResponse {
  metadata: {
    code: number;
    message: string;
  };
  response: {
    list: Array<{
      namadokter: string;
      kodedokter: number;
      jampraktek: string;
      kapasitas: number;
    }>;
  };
}

export interface TambahAntreanRequest {
  nomorkartu: string;
  nik: string;
  nohp: string;
  kodepoli: string;
  namapoli: string;
  norm: string;
  tanggalperiksa: string;
  kodedokter: number;
  namadokter: string;
  jampraktek: string;
  nomorantrean: string;
  angkaantrean: number;
  keterangan: string;
}

export interface UpdateStatusAntreanRequest {
  tanggalperiksa: string;
  kodepoli: string;
  nomorkartu: string;
  status: 1 | 2; // 1 = Hadir, 2 = Tidak Hadir
  waktu: number; // timestamp milisecond
}

export interface BatalAntreanRequest {
  tanggalperiksa: string;
  kodepoli: string;
  nomorkartu: string;
  alasan: string;
}

export class BpjsAntreanFktpIntegration {
  private config: BpjsAntreanFktpConfig;

  constructor(config: BpjsAntreanFktpConfig) {
    this.config = config;
  }

  /**
   * Menghasilkan timestamp dalam format Unix (milidetik sejak 1 Januari 1970)
   */
  private getUnixTimestamp(): number {
    return Date.now(); // mengembalikan milidetik
  }

  /**
   * Membuat signature menggunakan HMAC-SHA256
   */
  private generateSignature(timestamp: number): string {
    const dataToSign = `${this.config.consumerId}&${timestamp}`;
    const crypto = require('crypto'); // menggunakan require karena node crypto mungkin tidak tersedia di semua konteks
    const hmac = crypto.createHmac('sha256', this.config.consumerSecret);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  }

  /**
   * Membuat konfigurasi header untuk permintaan ke layanan BPJS
   */
  private createHeaders(): Record<string, string> {
    const timestamp = this.getUnixTimestamp();
    const signature = this.generateSignature(timestamp);

    return {
      'x-cons-id': this.config.consumerId,
      'x-timestamp': timestamp.toString(),
      'x-signature': signature,
      'user_key': this.config.userKey,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  /**
   * Melakukan permintaan GET ke layanan BPJS dengan header otentikasi
   */
  private async makeGetRequest(endpoint: string): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.config.baseUrl}/${this.config.serviceName}/${endpoint}`;

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan POST ke layanan BPJS dengan header otentikasi
   */
  private async makePostRequest(endpoint: string, data: any): Promise<any> {
    const headers = this.createHeaders();
    const url = `${this.config.baseUrl}/${this.config.serviceName}/${endpoint}`;

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error during BPJS request:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan referensi poli berdasarkan tanggal
   */
  async getRefPoli(tanggal: string): Promise<RefPoliResponse> {
    const endpoint = `ref/poli/tanggal/${tanggal}`;
    const encryptedResponse = await this.makeGetRequest(endpoint);

    // Karena respons perlu didekripsi di sisi klien, kita gunakan fungsi dekripsi
    // Ini hanya contoh - implementasi sebenarnya perlu disesuaikan dengan cara enkripsi BPJS
    try {
      const decryptedData = BpjsDecryptUtils.fullDecrypt(
        JSON.stringify(encryptedResponse),
        this.config.consumerId,
        this.config.consumerSecret,
        this.getUnixTimestamp()
      );
      return decryptedData;
    } catch (decryptError) {
      console.warn('Could not decrypt response, returning raw data:', decryptError);
      return encryptedResponse;
    }
  }

  /**
   * Mendapatkan referensi dokter berdasarkan kode poli dan tanggal
   */
  async getRefDokter(kodePoli: string, tanggal: string): Promise<RefDokterResponse> {
    const endpoint = `ref/dokter/kodepoli/${kodePoli}/tanggal/${tanggal}`;
    const encryptedResponse = await this.makeGetRequest(endpoint);

    // Karena respons perlu didekripsi di sisi klien, kita gunakan fungsi dekripsi
    try {
      const decryptedData = BpjsDecryptUtils.fullDecrypt(
        JSON.stringify(encryptedResponse),
        this.config.consumerId,
        this.config.consumerSecret,
        this.getUnixTimestamp()
      );
      return decryptedData;
    } catch (decryptError) {
      console.warn('Could not decrypt response, returning raw data:', decryptError);
      return encryptedResponse;
    }
  }

  /**
   * Menambahkan antrean baru
   */
  async tambahAntrean(request: TambahAntreanRequest): Promise<any> {
    const endpoint = 'antrean/add';
    return this.makePostRequest(endpoint, request);
  }

  /**
   * Memperbarui status antrean (hadir/tidak hadir)
   */
  async updateStatusAntrean(request: UpdateStatusAntreanRequest): Promise<any> {
    const endpoint = 'antrean/panggil';
    return this.makePostRequest(endpoint, request);
  }

  /**
   * Membatalkan antrean
   */
  async batalAntrean(request: BatalAntreanRequest): Promise<any> {
    const endpoint = 'antrean/batal';
    return this.makePostRequest(endpoint, request);
  }
}
```

## Kesimpulan

Implementasi layanan Antrean BPJS FKTP ini memungkinkan sistem SIMRS ZEN untuk berintegrasi dengan sistem antrean BPJS dari sisi FKTP, memungkinkan FKTP untuk mengelola antrean pasien yang dirujuk ke rumah sakit secara efektif. Ini termasuk mendapatkan referensi poli dan dokter, menambahkan antrean, memperbarui status antrean, dan membatalkan antrean.
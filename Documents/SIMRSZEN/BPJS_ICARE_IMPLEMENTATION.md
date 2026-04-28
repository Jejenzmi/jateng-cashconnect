# Implementasi Layanan iCare JKN BPJS

## Pendahuluan

Dokumen ini menjelaskan implementasi layanan iCare JKN BPJS sebagai bagian dari sistem integrasi BPJS dalam sistem SIMRS ZEN. Layanan ini memungkinkan rumah sakit untuk mengakses riwayat pelayanan pasien BPJS melalui sistem iCare JKN.

## Spesifikasi Otentikasi

### Header yang Dibutuhkan

| Nama Header | Contoh Nilai | Keterangan |
|-------------|--------------|------------|
| X-cons-id | 743627386 | Consumer ID dari BPJS Kesehatan |
| X-timestamp | 234234234 | Generated unix-based timestamp (detik) |
| X-signature | DogC5UiQurNcigrBdQ3QN5oYvXeUF5E82I/LHUcI9v0= | Generated signature dengan pola HMAC-256 |
| user_key | d795b04f4a72d74fae727be9da0xxxxx | User key untuk akses webservice |

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

## Endpoint yang Tersedia

### 1. Validasi FKRTL (Rumah Sakit)
- **URL**: `{BASE URL}/{Service Name}/api/rs/validate`
- **Fungsi**: API Data Riwayat Pelayanan untuk rumah sakit
- **Method**: POST
- **Format**: JSON
- **Content-Type**: application/json

#### Contoh Request:
```json
{
  "param": "2200009338321",
  "kodedokter": 11111
}
```

#### Contoh Response:
```json
{
  "response": {
    "url": "https://dvlp.bpjs-kesehatan.go.id/ihs/history?token=e6b610b4-2960-46a3-8420-de879756dce3"
  },
  "metaData": {
    "code": 200,
    "message": "Sukses"
  }
}
```

### 2. Validasi FKTP (Faskes Tingkat Pertama)
- **URL**: `{BASE URL}/{Service Name}/api/pcare/validate`
- **Fungsi**: API Data Riwayat Pelayanan untuk faskes tingkat pertama
- **Method**: POST
- **Format**: JSON
- **Content-Type**: application/json

#### Contoh Request:
```json
{
  "param": "2200009338321"
}
```

#### Contoh Response:
```json
{
  "response": {
    "url": "https://dvlp.bpjs-kesehatan.go.id/ihs/history?token=e6b610b4-2960-46a3-8420-de879756dce3"
  },
  "metaData": {
    "code": 200,
    "message": "Sukses"
  }
}
```

## Kode Metadata

- code: 200: Sukses
- code: selain itu: Gagal

## Implementasi dalam TypeScript

Berikut adalah implementasi layanan iCare JKN BPJS dalam TypeScript:

```typescript
import axios, { AxiosRequestConfig } from 'axios';
import { BpjsDecryptUtils } from './bpjs-decrypt-utils';

export interface BpjsIcareConfig {
  consumerId: string;
  consumerSecret: string;
  userKey: string;
  baseUrl: string;
  serviceName: string;
}

export interface IcareValidateRequest {
  param: string;       // nomorkartu
  kodedokter?: number; // hanya untuk FKRTL
}

export interface IcareValidateResponse {
  response: {
    url: string;
  };
  metaData: {
    code: number;
    message: string;
  };
}

export class BpjsIcareIntegration {
  private config: BpjsIcareConfig;

  constructor(config: BpjsIcareConfig) {
    this.config = config;
  }

  /**
   * Menghasilkan timestamp dalam format Unix (detik sejak 1 Januari 1970)
   */
  private getUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000); // mengembalikan detik
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
      'X-cons-id': this.config.consumerId,
      'X-timestamp': timestamp.toString(),
      'X-signature': signature,
      'user_key': this.config.userKey,
      'Content-Type': 'application/json; charset=utf-8',
    };
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
      console.error('Error during BPJS iCare request:', error);
      throw error;
    }
  }

  /**
   * Validasi data pasien FKRTL (rumah sakit) untuk akses ke iCare JKN
   */
  async validateFkrtl(nomorKartu: string, kodeDokter: number): Promise<IcareValidateResponse> {
    const endpoint = 'api/rs/validate';
    const requestData: IcareValidateRequest = {
      param: nomorKartu,
      kodedokter: kodeDokter
    };

    return this.makePostRequest(endpoint, requestData);
  }

  /**
   * Validasi data pasien FKTP (faskes tingkat pertama) untuk akses ke iCare JKN
   */
  async validateFktp(nomorKartu: string): Promise<IcareValidateResponse> {
    const endpoint = 'api/pcare/validate';
    const requestData: IcareValidateRequest = {
      param: nomorKartu
    };

    return this.makePostRequest(endpoint, requestData);
  }

  /**
   * Mendapatkan URL untuk mengakses riwayat pelayanan pasien FKRTL (rumah sakit)
   */
  async getFkrtlHistoryUrl(nomorKartu: string, kodeDokter: number): Promise<string> {
    const response = await this.validateFkrtl(nomorKartu, kodeDokter);
    return response.response.url;
  }

  /**
   * Mendapatkan URL untuk mengakses riwayat pelayanan pasien FKTP (faskes tingkat pertama)
   */
  async getFktpHistoryUrl(nomorKartu: string): Promise<string> {
    const response = await this.validateFktp(nomorKartu);
    return response.response.url;
  }
}
```

## Kesimpulan

Implementasi layanan iCare JKN BPJS ini memungkinkan sistem SIMRS ZEN untuk berintegrasi dengan sistem iCare JKN BPJS, memberikan kemampuan untuk mengakses riwayat pelayanan pasien BPJS baik dari FKRTL (rumah sakit) maupun FKTP (faskes tingkat pertama). Ini meningkatkan kualitas pelayanan dan efisiensi dalam memberikan perawatan medis dengan adanya akses ke riwayat pelayanan pasien yang komprehensif.
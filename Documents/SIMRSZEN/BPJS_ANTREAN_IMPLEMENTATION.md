# Implementasi Layanan Antrean BPJS

## Pendahuluan

Dokumen ini menjelaskan implementasi layanan Antrean BPJS yang merupakan bagian dari sistem integrasi BPJS dalam sistem SIMRS ZEN. Layanan ini memungkinkan rumah sakit untuk mengambil, membatalkan, dan memonitor antrean pasien BPJS.

## Endpoint yang Tersedia

### 1. Token
- **URL**: `{BASE_URL}/auth`
- **Fungsi**: Membuat token otentikasi
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-username`: Username akses
  - `x-password`: Password akses

#### Contoh Respon:
```json
{
    "response": {
        "token": "1231242353534645645"
    },
    "metadata": {
        "message": "Ok",
        "code": 200
    }
}
```

### 2. Status Antrean
- **URL**: `{BASE_URL}/antrean/status/{kode_poli}/{tanggalperiksa}`
- **Contoh URL**: `{BASE_URL}/antrean/status/001/2020-01-28`
- **Fungsi**: Menampilkan status antrean per poli
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Respon:
```json
{
    "response": {
        "namapoli": "Poli Umum",
        "totalantrean": "25",
        "sisaantrean": "4",
        "antreanpanggil": "A21",
        "keterangan": ""
    },
    "metadata": {
        "message": "Ok",
        "code": 200
    }
}
```

### 3. Ambil Antrean
- **URL**: `{BASE_URL}/antrean`
- **Fungsi**: Mengambil antrean
- **Method**: POST
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Request:
```json
{
    "nomorkartu": "00012345678",
    "nik": "3212345678987654",
    "kodepoli": "001",
    "tanggalperiksa": "2020-01-28",
    "keluhan": "sakit kepala"
}
```

### 4. Sisa Antrean
- **URL**: `{BASE_URL}/antrean/sisapeserta/{nomorkartu_jkn}/{kode_poli}/{tanggalperiksa}`
- **Contoh URL**: `{BASE_URL}/antrean/sisapeserta/00012345678/001/2020-01-28`
- **Fungsi**: Melihat sisa antrean di hari H pelayanan
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Respon:
```json
{
    "response": {
        "nomorantrean": "A20",
        "namapoli": "Poli Umum",
        "sisaantrean": "4",
        "antreanpanggil": "A8",
        "keterangan": ""
    },
    "metadata": {
        "message": "Ok",
        "code": 200
    }
}
```

### 5. Pasien Baru
- **URL**: `{BASE_URL}/peserta`
- **Fungsi**: Kirim informasi identitas peserta sebagai pasien baru
- **Method**: POST
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Request:
```json
{
    "nomorkartu": "00012345678",
    "nik": "3212345678987654",
    "nomorkk": "3212345678987654",
    "nama": "sumarsono",
    "jeniskelamin": "L",
    "tanggallahir": "1985-03-01",
    "alamat": "alamat yang muncul merupakan alamat lengkap",
    "kodeprop": "11",
    "namaprop": "Jawa Barat",
    "kodedati2": "0120",
    "namadati2": "Kab. Bandung",
    "kodekec": "1319",
    "namakec": "Soreang",
    "kodekel": "D2105",
    "namakel": "Cingcin",
    "rw": "001",
    "rt": "013"
}
```

### 6. Batal Antrean
- **URL**: `{BASE_URL}/antrean/batal`
- **Fungsi**: Membatalkan antrean peserta
- **Method**: PUT
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Request:
```json
{
    "nomorkartu": "00012345678",
    "kodepoli": "001",
    "tanggalperiksa": "2020-01-28"
}
```

### 7. Ambil Antrean V2
- **URL**: `{BASE_URL}/antrean`
- **Fungsi**: Mengambil antrean (versi baru)
- **Method**: POST
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Request:
```json
{
    "nomorkartu": "0000012345678",
    "nik": "3212345678987654",
    "kodepoli": "001",
    "tanggalperiksa": "2020-01-28",
    "keluhan": "sakit kepala",
    "kodedokter": 123456,
    "jampraktek": "08:00-12:00",
    "norm": "654321",
    "nohp": "081234567890"
}
```

#### Contoh Respon:
```json
{
    "response": {
        "nomorantrean": "A12",
        "angkaantrean": 12,
        "namapoli": "Poli Umum",
        "sisaantrean": "4",
        "antreanpanggil": "A8",
        "keterangan": "Apabila antrean terlewat harap mengambil antrean kembali."
    },
    "metadata": {
        "message": "Ok",
        "code": 200
    }
}
```

### 8. Status Antrean V2
- **URL**: `{BASE_URL}/antrean/status/{kode_poli}/{tanggalperiksa}`
- **Contoh URL**: `{BASE_URL}/antrean/status/001/2020-01-28`
- **Fungsi**: Menampilkan daftar status antrean per poli
- **Method**: GET
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Respon:
```json
{
    "response": [
        {
            "namapoli": "Poli Umum",
            "totalantrean": "25",
            "sisaantrean": 4,
            "antreanpanggil": "A1-21",
            "keterangan": "",
            "kodedokter": 123456,
            "namadokter": "Dr. Ali",
            "jampraktek": "08:00-13:00"
        },
        {
            "namapoli": "Poli Umum",
            "totalantrean": "11",
            "sisaantrean": 1,
            "antreanpanggil": "A2-10",
            "keterangan": "",
            "kodedokter": 123466,
            "namadokter": "Dr. Adi",
            "jampraktek": "08:00-12:00"
        }
    ],
    "metadata": {
        "message": "Ok",
        "code": 200
    }
}
```

### 9. Batal Antrean V2
- **URL**: `{BASE_URL}/antrean/batal`
- **Fungsi**: Membatalkan antrean peserta (versi baru)
- **Method**: PUT
- **Format**: JSON
- **Header**:
  - `x-token`: Token otentikasi
  - `x-username`: Username akses

#### Contoh Request:
```json
{
    "nomorkartu": "00012345678",
    "kodepoli": "001",
    "tanggalperiksa": "2020-01-28",
    "keterangan": "peserta batal hadir"
}
```

## Kode Metadata

- 200: Sukses
- 201: Gagal
- 202: Pasien Baru (khusus untuk pengambilan antrean)

## Implementasi dalam TypeScript

Berikut adalah implementasi layanan Antrean BPJS dalam TypeScript:

```typescript
import axios, { AxiosRequestConfig } from 'axios';

export interface BpjsAntreanConfig {
  username: string;
  password: string;
  baseUrl: string;
}

export interface PasienBaruData {
  nomorkartu: string;
  nik: string;
  nomorkk: string;
  nama: string;
  jeniskelamin: string;
  tanggallahir: string;
  alamat: string;
  kodeprop: string;
  namaprop: string;
  kodedati2: string;
  namadati2: string;
  kodekec: string;
  namakec: string;
  kodekel: string;
  namakel: string;
  rw: string;
  rt: string;
}

export interface AmbilAntreanData {
  nomorkartu: string;
  nik: string;
  kodepoli: string;
  tanggalperiksa: string;
  keluhan: string;
}

export interface AmbilAntreanV2Data extends AmbilAntreanData {
  kodedokter: number;
  jampraktek: string;
  norm: string;
  nohp: string;
}

export interface BatalAntreanData {
  nomorkartu: string;
  kodepoli: string;
  tanggalperiksa: string;
}

export interface BatalAntreanV2Data extends BatalAntreanData {
  keterangan: string;
}

export interface StatusAntreanResponse {
  response: {
    namapoli: string;
    totalantrean: string;
    sisaantrean: string;
    antreanpanggil: string;
    keterangan: string;
  };
  metadata: {
    message: string;
    code: number;
  };
}

export interface SisaAntreanResponse {
  response: {
    nomorantrean: string;
    namapoli: string;
    sisaantrean: string;
    antreanpanggil: string;
    keterangan: string;
  };
  metadata: {
    message: string;
    code: number;
  };
}

export interface StatusAntreanV2Response {
  response: Array<{
    namapoli: string;
    totalantrean: string;
    sisaantrean: number;
    antreanpanggil: string;
    keterangan: string;
    kodedokter: number;
    namadokter: string;
    jampraktek: string;
  }>;
  metadata: {
    message: string;
    code: number;
  };
}

export interface AmbilAntreanV2Response {
  response: {
    nomorantrean: string;
    angkaantrean: number;
    namapoli: string;
    sisaantrean: string;
    antreanpanggil: string;
    keterangan: string;
  };
  metadata: {
    message: string;
    code: number;
  };
}

export class BpjsAntreanIntegration {
  private config: BpjsAntreanConfig;
  private token: string | null = null;

  constructor(config: BpjsAntreanConfig) {
    this.config = config;
  }

  /**
   * Mendapatkan token otentikasi
   */
  async getToken(): Promise<string> {
    const url = `${this.config.baseUrl}/auth`;

    const headers = {
      'x-username': this.config.username,
      'x-password': this.config.password,
    };

    try {
      const response = await axios.get(url, { headers });
      this.token = response.data.response.token;
      return this.token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  /**
   * Membuat konfigurasi header dengan token
   */
  private async createAuthHeaders(): Promise<Record<string, string>> {
    // Jika belum ada token atau akan kedaluwarsa, minta token baru
    if (!this.token) {
      await this.getToken();
    }

    return {
      'x-token': this.token!,
      'x-username': this.config.username,
    };
  }

  /**
   * Mendapatkan status antrean per poli
   */
  async getStatusAntrean(kodePoli: string, tanggalPeriksa: string): Promise<StatusAntreanResponse> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean/status/${kodePoli}/${tanggalPeriksa}`;

    try {
      const response = await axios.get<StatusAntreanResponse>(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error getting status antrean:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan status antrean per poli (versi 2)
   */
  async getStatusAntreanV2(kodePoli: string, tanggalPeriksa: string): Promise<StatusAntreanV2Response> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean/status/${kodePoli}/${tanggalPeriksa}`;

    try {
      const response = await axios.get<StatusAntreanV2Response>(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error getting status antrean V2:', error);
      throw error;
    }
  }

  /**
   * Mengambil antrean
   */
  async ambilAntrean(data: AmbilAntreanData): Promise<any> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean`;

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error taking appointment:', error);
      throw error;
    }
  }

  /**
   * Mengambil antrean (versi 2)
   */
  async ambilAntreanV2(data: AmbilAntreanV2Data): Promise<AmbilAntreanV2Response> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean`;

    try {
      const response = await axios.post<AmbilAntreanV2Response>(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error taking appointment V2:', error);
      throw error;
    }
  }

  /**
   * Melihat sisa antrean
   */
  async getSisaAntrean(nomorKartu: string, kodePoli: string, tanggalPeriksa: string): Promise<SisaAntreanResponse> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean/sisapeserta/${nomorKartu}/${kodePoli}/${tanggalPeriksa}`;

    try {
      const response = await axios.get<SisaAntreanResponse>(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error getting remaining queue:', error);
      throw error;
    }
  }

  /**
   * Mengirim data pasien baru
   */
  async kirimPasienBaru(data: PasienBaruData): Promise<any> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/peserta`;

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending new patient data:', error);
      throw error;
    }
  }

  /**
   * Membatalkan antrean
   */
  async batalAntrean(data: BatalAntreanData): Promise<any> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean/batal`;

    try {
      const response = await axios.put(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  }

  /**
   * Membatalkan antrean (versi 2)
   */
  async batalAntreanV2(data: BatalAntreanV2Data): Promise<any> {
    const headers = await this.createAuthHeaders();
    const url = `${this.config.baseUrl}/antrean/batal`;

    try {
      const response = await axios.put(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment V2:', error);
      throw error;
    }
  }
}
```

## Kesimpulan

Implementasi layanan Antrean BPJS ini memungkinkan sistem SIMRS ZEN untuk berintegrasi dengan sistem antrean BPJS, memungkinkan rumah sakit untuk mengelola antrean pasien BPJS secara efektif. Ini termasuk pengambilan antrean, pembatalan, dan pemantauan status antrean secara real-time.
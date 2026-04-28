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
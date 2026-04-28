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
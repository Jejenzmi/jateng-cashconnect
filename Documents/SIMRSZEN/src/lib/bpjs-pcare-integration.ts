import * as crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';

export interface BpjsPcareConfig {
  consumerId: string;
  consumerSecret: string;
  username: string;
  password: string;
  kdAplikasi: string;
  userKey: string;
  baseUrl: string;
}

export class BpjsPcareIntegration {
  private config: BpjsPcareConfig;

  constructor(config: BpjsPcareConfig) {
    this.config = config;
  }

  /**
   * Menghasilkan timestamp dalam format Unix (detik sejak 1 Janu1970)
   */
  private getUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Membuat signature menggunakan HMAC-SHA256
   */
  private generateSignature(timestamp: number): string {
    const dataToSign = `${this.config.consumerId}&${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.config.consumerSecret);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  }

  /**
   * Membuat header otentikasi dalam format Base64
   */
  private generateAuthorizationHeader(): string {
    const authString = `${this.config.username}:${this.config.password}:${this.config.kdAplikasi}`;
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
      'X-cons-id': this.config.consumerId,
      'X-timestamp': timestamp.toString(),
      'X-signature': signature,
      'X-authorization': `Basic ${authorization}`,
      'user_key': this.config.userKey,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  /**
   * Membuat konfigurasi permintaan Axios dengan header yang diperlukan
   */
  private createAxiosConfig(): AxiosRequestConfig {
    return {
      headers: this.createHeaders(),
    };
  }

  /**
   * Melakukan permintaan GET ke layanan BPJS
   */
  async get(endpoint: string): Promise<any> {
    const config = this.createAxiosConfig();
    const url = `${this.config.baseUrl}/${endpoint}`;

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.error('Error during BPJS GET request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan POST ke layanan BPJS
   */
  async post(endpoint: string, data: any): Promise<any> {
    const config = this.createAxiosConfig();
    const url = `${this.config.baseUrl}/${endpoint}`;

    try {
      const response = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error('Error during BPJS POST request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan PUT ke layanan BPJS
   */
  async put(endpoint: string, data: any): Promise<any> {
    const config = this.createAxiosConfig();
    const url = `${this.config.baseUrl}/${endpoint}`;

    try {
      const response = await axios.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error('Error during BPJS PUT request:', error);
      throw error;
    }
  }

  /**
   * Melakukan permintaan DELETE ke layanan BPJS
   */
  async delete(endpoint: string): Promise<any> {
    const config = this.createAxiosConfig();
    const url = `${this.config.baseUrl}/${endpoint}`;

    try {
      const response = await axios.delete(url, config);
      return response.data;
    } catch (error) {
      console.error('Error during BPJS DELETE request:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan data diagnosa berdasarkan parameter
   */
  async getDiagnosa(parameter1: string, parameter2: string, parameter3: string): Promise<any> {
    return this.get(`diagnosa/${parameter1}/${parameter2}/${parameter3}`);
  }

  /**
   * Mendapatkan data dokter
   */
  async getDokter(parameter1: string, parameter2: string): Promise<any> {
    return this.get(`dokter/${parameter1}/${parameter2}`);
  }

  /**
   * Mendapatkan data kunjungan berdasarkan nomor kunjungan
   */
  async getKunjunganByNoKunjungan(noKunjungan: string): Promise<any> {
    return this.get(`kunjungan/rujukan/${noKunjungan}`);
  }

  /**
   * Mendapatkan riwayat kunjungan berdasarkan nomor kartu peserta
   */
  async getRiwayatKunjungan(nomorKartu: string): Promise<any> {
    return this.get(`kunjungan/peserta/${nomorKartu}`);
  }

  /**
   * Menambahkan data kunjungan baru
   */
  async addKunjungan(kunjunganData: any): Promise<any> {
    return this.post('kunjungan', kunjunganData);
  }

  /**
   * Memperbarui data kunjungan
   */
  async updateKunjungan(kunjunganData: any): Promise<any> {
    return this.put('kunjungan', kunjunganData);
  }

  /**
   * Menghapus data kunjungan berdasarkan nomor kunjungan
   */
  async deleteKunjungan(noKunjungan: string): Promise<any> {
    return this.delete(`kunjungan/${noKunjungan}`);
  }

  /**
   * Mendapatkan data kesadaran
   */
  async getKesadaran(): Promise<any> {
    return this.get('kesadaran');
  }

  /**
   * Mendapatkan data club prolanis
   */
  async getClubProlanis(jenisKelompok: string): Promise<any> {
    return this.get(`kelompok/club/${jenisKelompok}`);
  }

  /**
   * Mendapatkan data kegiatan kelompok
   */
  async getKegiatanKelompok(bulan: string): Promise<any> {
    return this.get(`kelompok/kegiatan/${bulan}`);
  }

  /**
   * Mendapatkan data peserta kegiatan kelompok
   */
  async getPesertaKegiatanKelompok(eduId: string): Promise<any> {
    return this.get(`kelompok/peserta/${eduId}`);
  }

  /**
   * Menambahkan kegiatan kelompok
   */
  async addKegiatanKelompok(kegiatanData: any): Promise<any> {
    return this.post('kelompok/kegiatan', kegiatanData);
  }

  /**
   * Menambahkan peserta kegiatan kelompok
   */
  async addPesertaKegiatanKelompok(pesertaData: any): Promise<any> {
    return this.post('kelompok/peserta', pesertaData);
  }

  /**
   * Menghapus kegiatan kelompok
   */
  async deleteKegiatanKelompok(eduId: string): Promise<any> {
    return this.delete(`kelompok/kegiatan/${eduId}`);
  }

  /**
   * Menghapus peserta kegiatan kelompok
   */
  async deletePesertaKegiatanKelompok(eduId: string, nomorKartu: string): Promise<any> {
    return this.delete(`kelompok/peserta/${eduId}/${nomorKartu}`);
  }
}
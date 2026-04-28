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
import axios from 'axios';
import * as crypto from 'crypto';
import logger from '../utils/logger';
import { BpjsCrypto } from '../utils/bpjsCrypto';
import { BpjsConfigService } from './bpjsConfigService';

interface BpjsCredentials {
  apiKey: string;
  consumerSecret: string;
  username: string;
  password: string;
  userKey: string;
  apiUrl: string;
}

export class BpjsService {
  private static credentials: BpjsCredentials | null = null;
  private static apiConfig = (() => {
    const baseURL = process.env.BPJS_BASE_URL || 'https://new-api.bpjs-kesehatan.go.id';
    const v1 = process.env.BPJS_V1 || '/vclaim-rest';
    const v2 = process.env.BPJS_V2 || '/v2';

    return {
      baseURL,
      v1,
      v2,
      vclaim2: process.env.BPJS_VCLAIM2_URL || `${baseURL}${v1}`,
      pcare: process.env.BPJS_PCARE_URL || `${baseURL}/pcare-rest`,
      antreanRs: process.env.BPJS_ANTREAN_RS_URL || `${baseURL}/antreanrs`,
      apotek: process.env.BPJS_APOTEK_URL || `${baseURL}/apotek-rest`,
    };
  })();

  /**
   * Load BPJS credentials from environment or database
   */
  private static async loadCredentials(): Promise<void> {
    try {
      const dbConfig = await BpjsConfigService.getConfig();
      if (dbConfig && dbConfig.consId && dbConfig.secretKey) {
        this.credentials = {
          apiKey: dbConfig.consId,
          consumerSecret: dbConfig.secretKey,
          username: process.env.BPJS_USERNAME || '',
          password: process.env.BPJS_PASSWORD || '',
          userKey: dbConfig.userKey || process.env.BPJS_USER_KEY || '',
          apiUrl: dbConfig.baseUrl || this.apiConfig.baseURL,
        };
        return;
      }
    } catch (e) {
      logger.warn('Gagal memuat konfigurasi BPJS dari database, menggunakan fallback .env');
    }

    this.credentials = {
      apiKey: process.env.BPJS_API_KEY || '',
      consumerSecret: process.env.BPJS_SECRET_KEY || '',
      username: process.env.BPJS_USERNAME || '',
      password: process.env.BPJS_PASSWORD || '',
      userKey: process.env.BPJS_USER_KEY || '',
      apiUrl: this.apiConfig.baseURL,
    };
  }

  /**
   * Get SEP (Surat Eligibilitas Peserta) data
   */
  static async getSEP(sepNumber: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.get(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/SEP/${sepNumber}`,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          noSep: sepNumber,
          tglSep: '2023-01-01',
          jnsPelayanan: '1',
          kelasRawat: '1',
          // ... other fields
        }
      };
    } catch (error: any) {
      logger.error('Failed to get SEP data:', error.message);
      throw new Error(`Failed to get SEP data: ${error.message}`);
    }
  }

  /**
   * Create new SEP (Surat Eligibilitas Peserta)
   */
  static async createSEP(sepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.post(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/SEP/2.0/insert`,
      //   sepData,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          sep: {
            ...sepData,
            noSep: '1234567890',
            tglSep: new Date().toISOString().split('T')[0],
            // ... other fields
          }
        }
      };
    } catch (error: any) {
      logger.error('Failed to create SEP:', error.message);
      throw new Error(`Failed to create SEP: ${error.message}`);
    }
  }

  /**
   * Update SEP (Surat Eligibilitas Peserta)
   */
  static async updateSEP(sepNumber: string, sepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.put(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/SEP/2.0/update`,
      //   sepData,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          sep: {
            ...sepData,
            noSep: sepNumber,
            // ... other fields
          }
        }
      };
    } catch (error: any) {
      logger.error('Failed to update SEP:', error.message);
      throw new Error(`Failed to update SEP: ${error.message}`);
    }
  }

  /**
   * Delete SEP (Surat Eligibilitas Peserta)
   */
  static async deleteSEP(sepNumber: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.delete(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/SEP/2.0/delete`,
      //   {
      //     headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp},
      //     data: { noSep: sepNumber }
      //   }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          noSep: sepNumber,
        }
      };
    } catch (error: any) {
      logger.error('Failed to delete SEP:', error.message);
      throw new Error(`Failed to delete SEP: ${error.message}`);
    }
  }

  /**
   * Get patient data from BPJS
   */
  static async getPatient(nik: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.get(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/Peserta/nik/${nik}/tglLahir/${new Date().toISOString().split('T')[0]}`,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          peserta: {
            noKartu: '000000000000',
            nik,
            nama: 'John Doe',
            jenisKelamin: 'L',
            tglLahir: '1990-01-01',
            // ... other fields
          }
        }
      };
    } catch (error: any) {
      logger.error('Failed to get patient data from BPJS:', error.message);
      throw new Error(`Failed to get patient data from BPJS: ${error.message}`);
    }
  }

  /**
   * Get referral data
   */
  static async getReferral(refNumber: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.get(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/Rujukan/norujuk/${refNumber}`,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          rujukan: {
            noRujukan: refNumber,
            tglRujukan: '2023-01-01',
            // ... other fields
          }
        }
      };
    } catch (error: any) {
      logger.error('Failed to get referral data:', error.message);
      throw new Error(`Failed to get referral data: ${error.message}`);
    }
  }

  /**
   * Get claim data
   */
  static async getClaim(claimId: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('BPJS Kesehatan credentials not configured');
      }

      const headers = this.createBpjsAuthHeaders();
      const timestamp = new Date().getTime().toString();
      const signature = this.generateSignature(timestamp);
      
      // Placeholder for actual API call
      // const response = await axios.get(
      //   `${this.apiConfig.baseURL}${this.apiConfig.v1}/pelayanan/klaim/JASA_RAHA/${claimId}`,
      //   { headers: {...headers, 'X-Signature': signature, 'X-Timestamp': timestamp} }
      // );

      // Placeholder response
      return {
        metadata: {
          code: '200',
          message: 'Sukses',
        },
        response: {
          klaim: {
            noKlaim: claimId,
            tglKlaim: '2023-01-01',
            // ... other fields
          }
        }
      };
    } catch (error: any) {
      logger.error('Failed to get claim data:', error.message);
      throw new Error(`Failed to get claim data: ${error.message}`);
    }
  }

  /**
   * Get SEP data for Inacbg integration
   */
  /**
   * Pengajuan SEP
   */
  static async pengajuanSEP(sepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();

      const response = await axios.post(
        `${this.apiConfig.vclaim2}/Sep/pengajuanSEP`,
        { request: { t_sep: sepData } },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal melakukan pengajuan SEP:', error.response?.data || error.message);
      throw new Error(`Gagal melakukan pengajuan SEP: ${error.message}`);
    }
  }

  /**
   * Approval SEP
   */
  static async approveSEP(sepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.vclaim2}/Sep/aprovalSEP`,
        { request: { t_sep: sepData } },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal melakukan approval SEP:', error.response?.data || error.message);
      throw new Error(`Gagal melakukan approval SEP: ${error.message}`);
    }
  }

  /**
   * Get list persetujuan SEP
   */
  static async getListPersetujuanSEP(bulan: string, tahun: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/Sep/persetujuanSEP/list/bulan/${bulan}/tahun/${tahun}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan list persetujuan SEP:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan list persetujuan SEP: ${error.message}`);
    }
  }

  /**
   * Update tanggal pulang SEP
   */
  static async updateTanggalPulang(updateData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.put(
        `${this.apiConfig.vclaim2}/Sep/updtglplg`,
        { request: { t_sep: updateData } },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengupdate tanggal pulang SEP:', error.response?.data || error.message);
      throw new Error(`Gagal mengupdate tanggal pulang SEP: ${error.message}`);
    }
  }

  /**
   * Update tanggal pulang SEP 2.0
   */
  static async updateTanggalPulang2(updateData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.put(
        `${this.apiConfig.vclaim2}/SEP/2.0/updtglplg`,
        { request: { t_sep: updateData } },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengupdate tanggal pulang SEP 2.0:', error.response?.data || error.message);
      throw new Error(`Gagal mengupdate tanggal pulang SEP 2.0: ${error.message}`);
    }
  }

  /**
   * Get list update tanggal pulang
   */
  static async getListUpdateTanggalPulang(bulan: string, tahun: string, filter: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/Sep/updtglplg/list/bulan/${bulan}/tahun/${tahun}/${filter}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan list update tanggal pulang:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan list update tanggal pulang: ${error.message}`);
    }
  }

  /**
   * Get diagnosa PCare
   */
  static async getDiagnosaPCare(param: string, row: number, limit: number): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/diagnosa/${param}/${row}/${limit}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan diagnosa PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan diagnosa PCare: ${error.message}`);
    }
  }

  /**
   * Get dokter PCare
   */
  static async getDokterPCare(row: number, limit: number): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/dokter/${row}/${limit}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan dokter PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan dokter PCare: ${error.message}`);
    }
  }

  /**
   * Get club prolanis PCare
   */
  static async getClubProlanisPCare(kdJenisKelompok: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kelompok/club/${kdJenisKelompok}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan club prolanis PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan club prolanis PCare: ${error.message}`);
    }
  }

  /**
   * Get kegiatan kelompok PCare
   */
  static async getKegiatanKelompokPCare(bulan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kelompok/kegiatan/${bulan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Get peserta kegiatan kelompok PCare
   */
  static async getPesertaKegiatanKelompokPCare(eduId: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kelompok/peserta/${eduId}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan peserta kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan peserta kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Add kegiatan kelompok PCare
   */
  static async addKegiatanKelompokPCare(kegiatanData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      };

      const response = await axios.post(
        `${this.apiConfig.pcare}/kelompok/kegiatan`,
        kegiatanData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menambahkan kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menambahkan kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Add peserta kegiatan kelompok PCare
   */
  static async addPesertaKegiatanKelompokPCare(pesertaData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      };

      const response = await axios.post(
        `${this.apiConfig.pcare}/kelompok/peserta`,
        pesertaData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menambahkan peserta kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menambahkan peserta kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Delete kegiatan kelompok PCare
   */
  static async deleteKegiatanKelompokPCare(eduId: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.delete(
        `${this.apiConfig.pcare}/kelompok/kegiatan/${eduId}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Delete peserta kegiatan kelompok PCare
   */
  static async deletePesertaKegiatanKelompokPCare(eduId: string, noKartu: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.delete(
        `${this.apiConfig.pcare}/kelompok/peserta/${eduId}/${noKartu}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus peserta kegiatan kelompok PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus peserta kegiatan kelompok PCare: ${error.message}`);
    }
  }

  /**
   * Get kesadaran PCare
   */
  static async getKesadaranPCare(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kesadaran`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan kesadaran PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan kesadaran PCare: ${error.message}`);
    }
  }

  /**
   * Get rujukan PCare
   */
  static async getRujukanPCare(noKunjungan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kunjungan/rujukan/${noKunjungan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan rujukan PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan rujukan PCare: ${error.message}`);
    }
  }

  /**
   * Get riwayat kunjungan PCare
   */
  static async getRiwayatKunjunganPCare(noKartu: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get(
        `${this.apiConfig.pcare}/kunjungan/peserta/${noKartu}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan riwayat kunjungan PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan riwayat kunjungan PCare: ${error.message}`);
    }
  }

  /**
   * Add kunjungan PCare
   */
  static async addKunjunganPCare(kunjunganData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      };

      const response = await axios.post(
        `${this.apiConfig.pcare}/kunjungan`,
        kunjunganData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menambahkan kunjungan PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menambahkan kunjungan PCare: ${error.message}`);
    }
  }

  /**
   * Edit kunjungan PCare
   */
  static async editKunjunganPCare(kunjunganData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      };

      const response = await axios.put(
        `${this.apiConfig.pcare}/kunjungan`,
        kunjunganData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengedit kunjungan PCare:', error.response?.data || error.message);
      throw new Error(`Gagal mengedit kunjungan PCare: ${error.message}`);
    }
  }

  /**
   * Delete kunjungan PCare
   */
  static async deleteKunjunganPCare(noKunjungan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      // Membuat timestamp dan signature
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signatureData = `${this.credentials.apiKey}&${timestamp}`;
      const signature = crypto
        .createHmac('sha256', this.credentials.consumerSecret)
        .update(signatureData)
        .digest('base64');

      // Membuat authorization
      const authData = `${this.credentials.username}:${this.credentials.password}:095`;
      const authorization = Buffer.from(authData).toString('base64');

      const headers = {
        'X-cons-id': this.credentials.apiKey,
        'X-timestamp': timestamp,
        'X-signature': signature,
        'X-authorization': authorization,
        'user_key': this.credentials.userKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.delete(
        `${this.apiConfig.pcare}/kunjungan/${noKunjungan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus kunjungan PCare:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus kunjungan PCare: ${error.message}`);
    }
  }

  /**
   * Get data SEP untuk integrasi Inacbg
   */
  static async getSEPForInacbg(noSep: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/sep/cbg/${noSep}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan data SEP untuk Inacbg:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan data SEP untuk Inacbg: ${error.message}`);
    }
  }

  /**
   * Get data SEP internal
   */
  static async getSEPInternal(noSep: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/SEP/Internal/${noSep}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan data SEP internal:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan data SEP internal: ${error.message}`);
    }
  }

  /**
   * Delete SEP internal
   */
  static async deleteSEPInternal(deleteData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.delete(
        `${this.apiConfig.vclaim2}/SEP/Internal/delete`,
        { 
          data: { request: { t_sep: deleteData } },
          headers 
        }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus SEP internal:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus SEP internal: ${error.message}`);
    }
  }

  /**
   * Hapus pelayanan obat
   */
  static async hapusPelayananObat(hapusData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.delete(
        `${this.apiConfig.apotek}/pelayanan/obat/hapus/`,
        {
          data: hapusData,
          headers
        }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus pelayanan obat:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus pelayanan obat: ${error.message}`);
    }
  }

  /**
   * Daftar pelayanan obat
   */
  static async daftarPelayananObat(noSep: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.apotek}/obat/daftar/${noSep}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan daftar pelayanan obat:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan daftar pelayanan obat: ${error.message}`);
    }
  }

  /**
   * Riwayat pelayanan obat
   */
  static async riwayatPelayananObat(tglAwal: string, tglAkhir: string, noKartu: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.apotek}/riwayatobat/${tglAwal}/${tglAkhir}/${noKartu}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan riwayat pelayanan obat:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan riwayat pelayanan obat: ${error.message}`);
    }
  }

  /**
   * Simpan resep
   */
  static async simpanResep(resepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.apotek}/sjpresep/v3/insert`,
        resepData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menyimpan resep:', error.response?.data || error.message);
      throw new Error(`Gagal menyimpan resep: ${error.message}`);
    }
  }

  /**
   * Hapus resep
   */
  static async hapusResep(hapusResepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.delete(
        `${this.apiConfig.apotek}/hapusresep`,
        {
          data: hapusResepData,
          headers
        }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menghapus resep:', error.response?.data || error.message);
      throw new Error(`Gagal menghapus resep: ${error.message}`);
    }
  }

  /**
   * Daftar resep
   */
  static async daftarResep(daftarResepData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.apotek}/daftarresep`,
        daftarResepData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan daftar resep:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan daftar resep: ${error.message}`);
    }
  }

  /**
   * Cari SEP berdasarkan nomor SEP
   */
  static async cariSEP(noSep: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.apotek}/sep/${noSep}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mencari SEP:', error.response?.data || error.message);
      throw new Error(`Gagal mencari SEP: ${error.message}`);
    }
  }

  /**
   * Data klaim
   */
  static async getDataKlaimApotek(bulan: string, tahun: string, jenisObat: string, status: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.apotek}/monitoring/klaim/${bulan}/${tahun}/${jenisObat}/${status}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan data klaim apotek:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan data klaim apotek: ${error.message}`);
    }
  }

  /**
   * Rekap peserta PRB
   */
  static async getRekapPesertaPRB(tahun: string, bulan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.apotek}/Prb/rekappeserta/tahun/${tahun}/bulan/${bulan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan rekap peserta PRB:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan rekap peserta PRB: ${error.message}`);
    }
  }

  /**
   * Get fingerprint validation status
   */
  static async getFingerprintStatus(noKartu: string, tglPelayanan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/SEP/FingerPrint/Peserta/${noKartu}/TglPelayanan/${tglPelayanan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan status fingerprint:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan status fingerprint: ${error.message}`);
    }
  }

  /**
   * Get list fingerprint validation
   */
  static async getListFingerprint(tglPelayanan: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/SEP/FingerPrint/List/Peserta/TglPelayanan/${tglPelayanan}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan list fingerprint:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan list fingerprint: ${error.message}`);
    }
  }

  /**
   * Get random question for fingerprint validation
   */
  static async getRandomQuestion(noKartu: string, tglSep: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.vclaim2}/SEP/FingerPrint/randomquestion/faskesterdaftar/nokapst/${noKartu}/tglsep/${tglSep}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan random question:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan random question: ${error.message}`);
    }
  }

  /**
   * Submit random answer for fingerprint validation
   */
  static async submitRandomAnswer(answerData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.vclaim2}/SEP/FingerPrint/randomanswer`,
        { request: { t_sep: answerData } },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal submit random answer:', error.response?.data || error.message);
      throw new Error(`Gagal submit random answer: ${error.message}`);
    }
  }

  /**
   * Get referensi poli untuk Antrean RS
   */
  static async getAntreanPoliRef(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/ref/poli`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi poli Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi poli Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get referensi dokter untuk Antrean RS
   */
  static async getAntreanDokterRef(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/ref/dokter`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi dokter Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi dokter Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get referensi jadwal dokter untuk Antrean RS
   */
  static async getAntreanJadwalDokterRef(kodePoli: string, tanggal: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/jadwaldokter/kodepoli/${kodePoli}/tanggal/${tanggal}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi jadwal dokter Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi jadwal dokter Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get referensi poli fingerprint untuk Antrean RS
   */
  static async getAntreanPoliFpRef(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/ref/poli/fp`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi poli fingerprint Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi poli fingerprint Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get referensi pasien fingerprint untuk Antrean RS
   */
  static async getAntreanPasienFpRef(nik: string, noka: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/ref/pasien/fp/identitas/${nik}/noidentitas/${noka}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi pasien fingerprint Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi pasien fingerprint Antrean RS: ${error.message}`);
    }
  }

  /**
   * Update jadwal dokter untuk Antrean RS
   */
  static async updateJadwalDokterAntrean(jadwalData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/jadwaldokter/updatejadwaldokter`,
        jadwalData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengupdate jadwal dokter Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mengupdate jadwal dokter Antrean RS: ${error.message}`);
    }
  }

  /**
   * Tambah antrean untuk Antrean RS
   */
  static async addAntrean(antreanData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/antrean/add`,
        antreanData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menambah antrean Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal menambah antrean Antrean RS: ${error.message}`);
    }
  }

  /**
   * Tambah antrean farmasi untuk Antrean RS
   */
  static async addAntreanFarmasi(antreanFarmasiData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/antrean/farmasi/add`,
        antreanFarmasiData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menambah antrean farmasi Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal menambah antrean farmasi Antrean RS: ${error.message}`);
    }
  }

  /**
   * Update waktu antrean untuk Antrean RS
   */
  static async updateWaktuAntrean(waktuData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/antrean/updatewaktu`,
        waktuData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengupdate waktu antrean Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mengupdate waktu antrean Antrean RS: ${error.message}`);
    }
  }

  /**
   * Batalkan antrean untuk Antrean RS
   */
  static async batalAntrean(batalData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/antrean/batal`,
        batalData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal membatalkan antrean Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal membatalkan antrean Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get list task antrean untuk Antrean RS
   */
  static async getListTaskAntrean(kodeBooking: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.antreanRs}/antrean/getlisttask`,
        { kodebooking: kodeBooking },
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan list task antrean Antrean RS:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan list task antrean Antrean RS: ${error.message}`);
    }
  }

  /**
   * Get dashboard antrean per tanggal
   */
  static async getDashboardAntreanPerTanggal(tanggal: string, waktu: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/dashboard/waktutunggu/tanggal/${tanggal}/waktu/${waktu}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan dashboard antrean per tanggal:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan dashboard antrean per tanggal: ${error.message}`);
    }
  }

  /**
   * Get dashboard antrean per bulan
   */
  static async getDashboardAntreanPerBulan(bulan: string, tahun: string, waktu: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/dashboard/waktutunggu/bulan/${bulan}/tahun/${tahun}/waktu/${waktu}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan dashboard antrean per bulan:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan dashboard antrean per bulan: ${error.message}`);
    }
  }

  /**
   * Get antrean per tanggal
   */
  static async getAntreanPerTanggal(tanggal: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/antrean/tanggal/${tanggal}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan antrean per tanggal:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan antrean per tanggal: ${error.message}`);
    }
  }

  /**
   * Get antrean per kode booking
   */
  static async getAntreanPerKodeBooking(kodeBooking: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/antrean/kodebooking/${kodeBooking}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan antrean per kode booking:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan antrean per kode booking: ${error.message}`);
    }
  }

  /**
   * Get antrean aktif
   */
  static async getAntreanAktif(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/antrean/aktif`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan antrean aktif:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan antrean aktif: ${error.message}`);
    }
  }

  /**
   * Get antrean aktif per poli, dokter, hari, dan jam
   */
  static async getAntreanAktifPerPoliDokterHariJam(
    kodePoli: string,
    kodeDokter: string,
    hari: string,
    jamPraktek: string
  ): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.antreanRs}/antrean/aktif/poli/${kodePoli}/dokter/${kodeDokter}/hari/${hari}/jampraktek/${jamPraktek}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan antrean aktif per poli, dokter, hari, dan jam:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan antrean aktif per poli, dokter, hari, dan jam: ${error.message}`);
    }
  }

  /**
   * Get referensi DPHO
   */
  static async getReferensiDPHO(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/referensi/dpho`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi DPHO:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi DPHO: ${error.message}`);
    }
  }

  /**
   * Get referensi poli
   */
  static async getReferensiPoli(param: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/referensi/poli/${param}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi poli:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi poli: ${error.message}`);
    }
  }

  /**
   * Get referensi fasilitas kesehatan
   */
  static async getReferensiFaskes(param1: string, param2: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/referensi/faskes/${param1}/${param2}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi fasilitas kesehatan:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi fasilitas kesehatan: ${error.message}`);
    }
  }

  /**
   * Get setting layanan
   */
  static async getSettingLayanan(param: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/setting/layanan/${param}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan setting layanan:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan setting layanan: ${error.message}`);
    }
  }

  /**
   * Get referensi spesialistik
   */
  static async getReferensiSpesialistik(): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/referensi/spesialistik`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi spesialistik:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi spesialistik: ${error.message}`);
    }
  }

  /**
   * Get referensi obat
   */
  static async getReferensiObat(param1: string, param2: string, param3: string): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.get(
        `${this.apiConfig.v2}/referensi/obat/${param1}/${param2}/${param3}`,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mendapatkan referensi obat:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan referensi obat: ${error.message}`);
    }
  }

  /**
   * Simpan obat non racikan
   */
  static async simpanObatNonRacikan(obatData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.v2}/pelayanan/obat/nonracikan`,
        obatData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menyimpan obat non racikan:', error.response?.data || error.message);
      throw new Error(`Gagal menyimpan obat non racikan: ${error.message}`);
    }
  }

  /**
   * Simpan obat racikan
   */
  static async simpanObatRacikan(obatData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.post(
        `${this.apiConfig.v2}/pelayanan/obat/racikan`,
        obatData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal menyimpan obat racikan:', error.response?.data || error.message);
      throw new Error(`Gagal menyimpan obat racikan: ${error.message}`);
    }
  }

  /**
   * Update stok obat
   */
  static async updateStokObat(stokData: any): Promise<any> {
    try {
      if (!this.credentials) {
        await this.loadCredentials();
      }

      if (!this.credentials) {
        throw new Error('Kredensial BPJS Kesehatan belum diatur');
      }

      const headers = this.createBpjsAuthHeaders();
      
      const response = await axios.put(
        `${this.apiConfig.v2}/pelayanan/stok`,
        stokData,
        { headers }
      );

      // Coba dekripsi respons jika diperlukan
      const decryptedResponse = this.decryptBpjsResponse(response.data, headers['X-Timestamp']);
      return decryptedResponse;
    } catch (error: any) {
      logger.error('Gagal mengupdate stok obat:', error.response?.data || error.message);
      throw new Error(`Gagal mengupdate stok obat: ${error.message}`);
    }
  }

  /**
   * Fungsi untuk menghasilkan signature menggunakan BpjsCrypto
   */
  private static generateSignature(timestamp: string): string {
    if (!this.credentials) return '';
    return BpjsCrypto.generateSignature(
      this.credentials.apiKey, 
      this.credentials.consumerSecret, 
      timestamp
    );
  }

  // Fungsi-fungsi tambahan yang diperlukan
  private static createBpjsAuthHeaders(timestamp?: string): any {
    if (!this.credentials) return {};
    const ts = timestamp || BpjsCrypto.getTimestamp();
    const signature = this.generateSignature(ts);

    return {
      'X-cons-id': this.credentials.apiKey,
      'X-timestamp': ts,
      'X-signature': signature,
      'user_key': this.credentials.userKey,
      'Accept': 'application/json',
      'Content-Type': 'Application/x-www-form-urlencoded',
    };
  }

  private static decryptBpjsResponse(response: any, timestamp: string): any {
    if (!this.credentials || !response || !response.response) return response;
    
    // Jika ada response dan status code 200, lakukan dekripsi
    if (response.metaData && response.metaData.code === '200' && typeof response.response === 'string') {
      try {
        const decrypted = BpjsCrypto.decryptResponse(
          response.response,
          this.credentials.apiKey,
          this.credentials.consumerSecret,
          timestamp
        );
        return {
          metaData: response.metaData,
          response: decrypted
        };
      } catch (e) {
        logger.error('Gagal dekripsi BPJS response:', e);
        return response; // Return original if failed
      }
    }
    return response;
  }
}

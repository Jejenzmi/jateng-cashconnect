import axios from 'axios';
import { SatuSehatConfigService } from './satusehatConfigService';
import { logger } from '../utils/logger';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class SatuSehatAuthService {
  private static instance: SatuSehatAuthService;
  private tokenCache: { token: string; expiresAt: Date } | null = null;

  private constructor() {}

  public static getInstance(): SatuSehatAuthService {
    if (!SatuSehatAuthService.instance) {
      SatuSehatAuthService.instance = new SatuSehatAuthService();
    }
    return SatuSehatAuthService.instance;
  }

  async getToken(): Promise<string> {
    // Periksa apakah token masih valid
    if (this.tokenCache && new Date() < this.tokenCache.expiresAt) {
      logger.info('Using cached token for Satu Sehat API');
      return this.tokenCache.token;
    }

    try {
      // Ambil konfigurasi dari database
      const config = await SatuSehatConfigService.getConfig();
      
      if (!config) {
        throw new Error('Konfigurasi Satu Sehat belum disetel di database');
      }

      const response = await axios.post(
        config.authUrl,
        new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const data = response.data as TokenResponse;
      const token = data.access_token;

      // Simpan token ke cache dengan waktu kedaluwarsa
      const expiresInMs = data.expires_in * 1000; // ubah ke milidetik
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + expiresInMs - 60000); // kurangi 1 menit sebagai buffer
      
      this.tokenCache = {
        token,
        expiresAt,
      };

      logger.info('Successfully obtained new token for Satu Sehat API');
      return token;
    } catch (error: any) {
      logger.error('Error getting token from Satu Sehat API:', error.message);
      throw new Error(`Gagal mendapatkan token dari Satu Sehat API: ${error.message}`);
    }
  }

  // Getter untuk informasi token (untuk debugging)
  getTokenInfo(): { isValid: boolean; expiresAt: Date | null } {
    if (!this.tokenCache) {
      return { isValid: false, expiresAt: null };
    }
    const isValid = new Date() < this.tokenCache.expiresAt;
    return { isValid, expiresAt: this.tokenCache.expiresAt };
  }
}
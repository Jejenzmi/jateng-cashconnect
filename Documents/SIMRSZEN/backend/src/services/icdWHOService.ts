import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

interface ICDCredentials {
  clientId: string;
  clientSecret: string;
}

interface ICDTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface ICDSearchResult {
  id: string;
  code: string;
  label: string;
  description?: string;
  score?: number;
}

export class ICDWHOService {
  private static credentials: ICDCredentials | null = null;

  /**
   * Mengatur kredensial ICD WHO
   */
  static async setCredentials(clientId: string, clientSecret: string): Promise<void> {
    this.credentials = { clientId, clientSecret };
    
    // Simpan kredensial ke database
    await prisma.iCDCredential.upsert({
      where: { id: 'default' },
      update: { clientId, clientSecret },
      create: { id: 'default', clientId, clientSecret },
    });
    
    logger.info('Kredensial ICD WHO telah diatur');
  }

  /**
   * Mendapatkan kredensial dari database
   */
  static async loadCredentials(): Promise<void> {
    const dbCredentials = await prisma.iCDCredential.findUnique({
      where: { id: 'default' },
    });
    
    if (dbCredentials) {
      this.credentials = {
        clientId: dbCredentials.clientId,
        clientSecret: dbCredentials.clientSecret,
      };
    }
  }

  /**
   * Mendapatkan token akses dari ICD WHO
   */
  static async getAccessToken(): Promise<string> {
    if (!this.credentials) {
      await this.loadCredentials();
    }

    if (!this.credentials) {
      throw new Error('Kredensial ICD WHO belum diatur');
    }

    try {
      const response = await axios.post<ICDTokenResponse>(
        'https://icd.who.int/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'icdapi_access',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${this.credentials.clientId}:${this.credentials.clientSecret}`
            ).toString('base64')}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      logger.error('Gagal mendapatkan token akses ICD WHO:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan token akses ICD WHO: ${error.message}`);
    }
  }

  /**
   * Mencari kode ICD berdasarkan istilah pencarian
   */
  static async searchICDCodes(searchTerm: string, limit: number = 10): Promise<ICDSearchResult[]> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get<any>(
        `https://id.who.int/icd/entity/search`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Accept-Language': 'en',
          },
          params: {
            q: searchTerm,
            limit,
          },
        }
      );

      if (!response.data || !response.data.entities) {
        return [];
      }

      return response.data.entities.map((item: any) => ({
        id: item.ID,
        code: item.Code,
        label: item.Label,
        description: item.Description || undefined,
        score: item.Score || undefined,
      }));
    } catch (error: any) {
      logger.error('Gagal mencari kode ICD:', error.response?.data || error.message);
      throw new Error(`Gagal mencari kode ICD: ${error.message}`);
    }
  }

  /**
   * Mendapatkan detail kode ICD berdasarkan ID
   */
  static async getICDDetails(codeId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get<any>(
        `https://id.who.int/icd/entity/${codeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Accept-Language': 'en',
          },
        }
      );

      return {
        id: response.data.ID,
        code: response.data.Code,
        label: response.data.Label,
        description: response.data.Description,
        chapters: response.data.Chapter,
        blocks: response.data.Block,
        parent: response.data.Parent,
        child: response.data.Child,
        linearizations: response.data.Linearization,
      };
    } catch (error: any) {
      logger.error('Gagal mendapatkan detail ICD:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan detail ICD: ${error.message}`);
    }
  }

  /**
   * Mendapatkan semua chapter ICD
   */
  static async getICDChapters(): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get<any>(
        `https://id.who.int/icd/release/11/2024-01/mms/categories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.data || !response.data.children) {
        return [];
      }

      return response.data.children.map((chapter: any) => ({
        id: chapter.ID,
        code: chapter.Code,
        label: chapter.Label,
        isCategory: chapter.isCategory,
      }));
    } catch (error: any) {
      logger.error('Gagal mendapatkan chapter ICD:', error.response?.data || error.message);
      throw new Error(`Gagal mendapatkan chapter ICD: ${error.message}`);
    }
  }
}
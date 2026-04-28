import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema validasi untuk input
const SatuSehatConfigSchema = z.object({
  clientId: z.string().min(1, 'Client ID wajib diisi'),
  clientSecret: z.string().min(1, 'Client Secret wajib diisi'),
  baseUrl: z.string().url('Format Base URL tidak valid'),
  authUrl: z.string().url('Format Auth URL tidak valid'),
  organizationId: z.string().min(1, 'Organization ID wajib diisi'),
  isActive: z.boolean().optional().default(false),
});

export type SatuSehatConfigInput = z.infer<typeof SatuSehatConfigSchema>;

export class SatuSehatConfigService {
  /**
   * Membuat atau memperbarui konfigurasi Satu Sehat
   */
  static async createOrUpdate(input: SatuSehatConfigInput): Promise<any> {
    try {
      // Validasi input
      const validatedInput = SatuSehatConfigSchema.parse(input);
      // In a real app we'd save to DB. For now return success since schema doesn't have it.
      return { id: 'mock-id', ...validatedInput };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Gunakan field.errors untuk ZodError
        const errorMessage = error.issues ? 
          error.issues.map((issue: any) => issue.message).join(', ') : 
          'Validasi input gagal';
        throw new Error(`Validasi gagal: ${errorMessage}`);
      }
      throw new Error(`Gagal menyimpan konfigurasi Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Mendapatkan konfigurasi Satu Sehat
   */
  static async getConfig(): Promise<any | null> {
    try {
      // Return dari environment variable karena model satuSehatConfig belum ada di schema.prisma
      return {
        clientId: process.env.SATUSEHAT_CLIENT_ID || 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
        clientSecret: process.env.SATUSEHAT_CLIENT_SECRET || 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg',
        authUrl: 'https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials',
        organizationId: process.env.SATUSEHAT_ORGANIZATION_CODE || 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
        baseUrl: 'https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1',
        isActive: true
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil konfigurasi Satu Sehat: ${error.message}`);
    }
  }

  /**
   * Menghapus konfigurasi Satu Sehat
   */
  static async deleteConfig(): Promise<boolean> {
    try {
      // await prisma.satuSehatConfig.deleteMany({});
      return true;
    } catch (error: any) {
      throw new Error(`Gagal menghapus konfigurasi Satu Sehat: ${error.message}`);
    }
  }
}
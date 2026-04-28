import { PrismaClient, KYCDocument, DICOMConfig, FaskesProfile } from '@prisma/client';
import { z } from 'zod';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Schema validasi untuk KYC
const KYCDocumentSchema = z.object({
  faskesProfileId: z.string().min(1, 'ID Faskes Profile wajib diisi'),
  documentType: z.string().min(1, 'Jenis dokumen wajib diisi'),
  documentNumber: z.string().min(1, 'Nomor dokumen wajib diisi'),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime(),
  issuer: z.string().min(1, 'Instansi penerbit wajib diisi'),
  filePath: z.string().min(1, 'Lokasi file wajib diisi'),
  status: z.enum(['VERIFIED', 'PENDING', 'REJECTED']),
  notes: z.string().optional(),
});

// Schema validasi untuk DICOM
const DICOMConfigSchema = z.object({
  faskesProfileId: z.string().min(1, 'ID Faskes Profile wajib diisi'),
  aeTitle: z.string().min(1, 'AE Title wajib diisi'),
  ipAddress: z.string().ip(),
  port: z.number().int().min(1).max(65535),
  protocol: z.enum(['DICOM', 'HL7', 'FHIR']),
  username: z.string().optional(),
  password: z.string().optional(),
  isEnabled: z.boolean().optional().default(false),
});

export type KYCDocumentInput = z.infer<typeof KYCDocumentSchema>;
export type DICOMConfigInput = z.infer<typeof DICOMConfigSchema>;

export class KYCDicomService {
  /**
   * Membuat dokumen KYC baru
   */
  static async createKYCDocument(input: KYCDocumentInput): Promise<KYCDocument> {
    try {
      const validatedInput = KYCDocumentSchema.parse(input);
      
      // Periksa apakah faskes profile ada
      const faskesProfile = await prisma.faskesProfile.findUnique({
        where: { id: validatedInput.faskesProfileId },
      });
      
      if (!faskesProfile) {
        throw new Error('Faskes Profile tidak ditemukan');
      }
      
      // Buat dokumen KYC
      const kycDocument = await prisma.kYCDocument.create({
        data: validatedInput,
      });
      
      logger.info(`Dokumen KYC berhasil dibuat: ${kycDocument.id}`);
      return kycDocument;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Gagal membuat dokumen KYC: ${error.message}`);
    }
  }

  /**
   * Mendapatkan semua dokumen KYC untuk suatu faskes
   */
  static async getKYCDocuments(faskesProfileId: string): Promise<KYCDocument[]> {
    try {
      const documents = await prisma.kYCDocument.findMany({
        where: { faskesProfileId },
        orderBy: { createdAt: 'desc' },
      });
      
      return documents;
    } catch (error: any) {
      throw new Error(`Gagal mengambil dokumen KYC: ${error.message}`);
    }
  }

  /**
   * Memperbarui status dokumen KYC
   */
  static async updateKYCStatus(documentId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED', notes?: string): Promise<KYCDocument> {
    try {
      const updatedDocument = await prisma.kYCDocument.update({
        where: { id: documentId },
        data: {
          status,
          notes: notes || undefined,
        },
      });
      
      logger.info(`Status dokumen KYC diperbarui: ${documentId}, status: ${status}`);
      return updatedDocument;
    } catch (error: any) {
      throw new Error(`Gagal memperbarui status dokumen KYC: ${error.message}`);
    }
  }

  /**
   * Menghapus dokumen KYC
   */
  static async deleteKYCDocument(documentId: string): Promise<boolean> {
    try {
      await prisma.kYCDocument.delete({
        where: { id: documentId },
      });
      
      logger.info(`Dokumen KYC dihapus: ${documentId}`);
      return true;
    } catch (error: any) {
      throw new Error(`Gagal menghapus dokumen KYC: ${error.message}`);
    }
  }

  /**
   * Membuat atau memperbarui konfigurasi DICOM
   */
  static async createOrUpdateDICOMConfig(input: DICOMConfigInput): Promise<DICOMConfig> {
    try {
      const validatedInput = DICOMConfigSchema.parse(input);
      
      // Periksa apakah faskes profile ada
      const faskesProfile = await prisma.faskesProfile.findUnique({
        where: { id: validatedInput.faskesProfileId },
      });
      
      if (!faskesProfile) {
        throw new Error('Faskes Profile tidak ditemukan');
      }
      
      // Cek apakah sudah ada konfigurasi untuk faskes ini
      const existingConfig = await prisma.dICOMConfig.findFirst({
        where: { faskesProfileId: validatedInput.faskesProfileId },
      });
      
      if (existingConfig) {
        // Update konfigurasi yang sudah ada
        return await prisma.dICOMConfig.update({
          where: { id: existingConfig.id },
          data: validatedInput,
        });
      } else {
        // Buat konfigurasi baru
        return await prisma.dICOMConfig.create({
          data: validatedInput,
        });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Gagal menyimpan konfigurasi DICOM: ${error.message}`);
    }
  }

  /**
   * Mendapatkan konfigurasi DICOM untuk suatu faskes
   */
  static async getDICOMConfig(faskesProfileId: string): Promise<DICOMConfig | null> {
    try {
      return await prisma.dICOMConfig.findFirst({
        where: { faskesProfileId },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengambil konfigurasi DICOM: ${error.message}`);
    }
  }

  /**
   * Mengaktifkan atau menonaktifkan konfigurasi DICOM
   */
  static async toggleDICOMConfig(configId: string, isEnabled: boolean): Promise<DICOMConfig> {
    try {
      return await prisma.dICOMConfig.update({
        where: { id: configId },
        data: { isEnabled },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengubah status konfigurasi DICOM: ${error.message}`);
    }
  }

  /**
   * Menghapus konfigurasi DICOM
   */
  static async deleteDICOMConfig(configId: string): Promise<boolean> {
    try {
      await prisma.dICOMConfig.delete({
        where: { id: configId },
      });
      
      logger.info(`Konfigurasi DICOM dihapus: ${configId}`);
      return true;
    } catch (error: any) {
      throw new Error(`Gagal menghapus konfigurasi DICOM: ${error.message}`);
    }
  }
}
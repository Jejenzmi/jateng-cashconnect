import { PrismaClient, IDRGRule, IDRGPatientCase } from '@prisma/client';
import { z } from 'zod';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Schema validasi untuk aturan iDRG
const IDRGRuleSchema = z.object({
  code: z.string().min(1, 'Kode iDRG wajib diisi'),
  description: z.string().min(1, 'Deskripsi iDRG wajib diisi'),
  baseWeight: z.number().positive('Bobot dasar harus positif'),
  adjustmentFactor: z.number().optional(),
  group: z.string().min(1, 'Kelompok iDRG wajib diisi'),
  subGroup: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

// Schema validasi untuk kasus pasien iDRG
const IDRGPatientCaseSchema = z.object({
  patientId: z.string().min(1, 'ID Pasien wajib diisi'),
  medicalRecordId: z.string().min(1, 'ID Rekam Medis wajib diisi'),
  idrgRuleId: z.string().min(1, 'ID Aturan iDRG wajib diisi'),
  admissionDate: z.string().datetime(),
  dischargeDate: z.string().datetime(),
  diagnosisCode: z.string().min(1, 'Kode diagnosis wajib diisi'),
  procedureCodes: z.array(z.string()).optional().default([]),
  complications: z.string().optional(),
  comorbidities: z.string().optional(),
  totalDays: z.number().int().nonnegative('Lama hari rawat harus non-negatif'),
  calculatedWeight: z.number().nonnegative('Bobot yang dihitung harus non-negatif'),
  finalAmount: z.number().nonnegative('Jumlah akhir harus non-negatif'),
  status: z.enum(['DRAFT', 'CALCULATED', 'SUBMITTED', 'PAID']),
  notes: z.string().optional(),
});

export type IDRGRuleInput = z.infer<typeof IDRGRuleSchema>;
export type IDRGPatientCaseInput = z.infer<typeof IDRGPatientCaseSchema>;

export class IDRGLService {
  /**
   * Membuat aturan iDRG baru
   */
  static async createIDRGRule(input: IDRGRuleInput): Promise<IDRGRule> {
    try {
      const validatedInput = IDRGRuleSchema.parse(input);
      
      // Cek apakah kode iDRG sudah ada
      const existingRule = await prisma.iDRGRule.findUnique({
        where: { code: validatedInput.code },
      });
      
      if (existingRule) {
        throw new Error('Kode iDRG sudah digunakan');
      }
      
      const idrgRule = await prisma.iDRGRule.create({
        data: validatedInput,
      });
      
      logger.info(`Aturan iDRG berhasil dibuat: ${idrgRule.code}`);
      return idrgRule;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Gagal membuat aturan iDRG: ${error.message}`);
    }
  }

  /**
   * Mendapatkan semua aturan iDRG
   */
  static async getIDRGRules(isActive?: boolean): Promise<IDRGRule[]> {
    try {
      return await prisma.iDRGRule.findMany({
        where: { isActive: isActive ?? true },
        orderBy: { code: 'asc' },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengambil aturan iDRG: ${error.message}`);
    }
  }

  /**
   * Mendapatkan aturan iDRG berdasarkan ID
   */
  static async getIDRGRuleById(id: string): Promise<IDRGRule | null> {
    try {
      return await prisma.iDRGRule.findUnique({
        where: { id },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengambil aturan iDRG: ${error.message}`);
    }
  }

  /**
   * Memperbarui aturan iDRG
   */
  static async updateIDRGRule(id: string, input: Partial<IDRGRuleInput>): Promise<IDRGRule> {
    try {
      const validatedInput = IDRGRuleSchema.partial().parse(input);
      
      const updatedRule = await prisma.iDRGRule.update({
        where: { id },
        data: validatedInput,
      });
      
      logger.info(`Aturan iDRG diperbarui: ${updatedRule.code}`);
      return updatedRule;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Gagal memperbarui aturan iDRG: ${error.message}`);
    }
  }

  /**
   * Menghapus aturan iDRG
   */
  static async deleteIDRGRule(id: string): Promise<boolean> {
    try {
      await prisma.iDRGRule.delete({
        where: { id },
      });
      
      logger.info(`Aturan iDRG dihapus: ${id}`);
      return true;
    } catch (error: any) {
      throw new Error(`Gagal menghapus aturan iDRG: ${error.message}`);
    }
  }

  /**
   * Membuat kasus pasien iDRG baru
   */
  static async createIDRGPatientCase(input: IDRGPatientCaseInput): Promise<IDRGPatientCase> {
    try {
      const validatedInput = IDRGPatientCaseSchema.parse(input);
      
      // Cek apakah pasien dan aturan iDRG valid
      const patient = await prisma.patient.findUnique({
        where: { id: validatedInput.patientId },
      });
      
      if (!patient) {
        throw new Error('Pasien tidak ditemukan');
      }
      
      const idrgRule = await prisma.iDRGRule.findUnique({
        where: { id: validatedInput.idrgRuleId },
      });
      
      if (!idrgRule) {
        throw new Error('Aturan iDRG tidak ditemukan');
      }
      
      // Hitung jumlah hari rawat jika belum disediakan
      let totalDays = validatedInput.totalDays;
      if (totalDays <= 0) {
        const admissionDate = new Date(validatedInput.admissionDate);
        const dischargeDate = new Date(validatedInput.dischargeDate);
        const diffTime = Math.abs(dischargeDate.getTime() - admissionDate.getTime());
        totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Tambah 1 hari karena perhitungan inklusif
      }
      
      // Hitung bobot akhir berdasarkan faktor penyesuaian dan jumlah hari
      let calculatedWeight = idrgRule.baseWeight;
      if (idrgRule.adjustmentFactor) {
        calculatedWeight *= idrgRule.adjustmentFactor;
      }
      
      // Hitung jumlah akhir berdasarkan bobot dan tarif dasar rumah sakit
      // Di sini diasumsikan ada tarif dasar per bobot (dapat dikonfigurasi)
      const baseRatePerWeight = 100000; // Contoh: Rp 100,000 per unit bobot
      const finalAmount = calculatedWeight * baseRatePerWeight * totalDays;
      
      const patientCase = await prisma.iDRGPatientCase.create({
        data: {
          ...validatedInput,
          totalDays,
          calculatedWeight,
          finalAmount,
        },
        include: {
          patient: true,
          idrgRule: true,
        },
      });
      
      logger.info(`Kasus pasien iDRG dibuat: ${patientCase.id} untuk pasien ${patientCase.patientId}`);
      return patientCase;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validasi gagal: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Gagal membuat kasus pasien iDRG: ${error.message}`);
    }
  }

  /**
   * Mendapatkan semua kasus pasien iDRG
   */
  static async getIDRGPatientCases(status?: string, patientId?: string): Promise<IDRGPatientCase[]> {
    try {
      return await prisma.iDRGPatientCase.findMany({
        where: {
          ...(status && { status }),
          ...(patientId && { patientId }),
        },
        include: {
          patient: {
            select: {
              fullName: true,
              nik: true,
            }
          },
          idrgRule: {
            select: {
              code: true,
              description: true,
            }
          },
        },
        orderBy: { admissionDate: 'desc' },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengambil kasus pasien iDRG: ${error.message}`);
    }
  }

  /**
   * Mendapatkan kasus pasien iDRG berdasarkan ID
   */
  static async getIDRGPatientCaseById(id: string): Promise<IDRGPatientCase | null> {
    try {
      return await prisma.iDRGPatientCase.findUnique({
        where: { id },
        include: {
          patient: true,
          idrgRule: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Gagal mengambil kasus pasien iDRG: ${error.message}`);
    }
  }

  /**
   * Memperbarui status kasus pasien iDRG
   */
  static async updateIDRGPatientCaseStatus(id: string, status: 'DRAFT' | 'CALCULATED' | 'SUBMITTED' | 'PAID', notes?: string): Promise<IDRGPatientCase> {
    try {
      const updatedCase = await prisma.iDRGPatientCase.update({
        where: { id },
        data: {
          status,
          notes: notes || undefined,
        },
        include: {
          patient: true,
          idrgRule: true,
        },
      });
      
      logger.info(`Status kasus pasien iDRG diperbarui: ${id}, status: ${status}`);
      return updatedCase;
    } catch (error: any) {
      throw new Error(`Gagal memperbarui status kasus pasien iDRG: ${error.message}`);
    }
  }

  /**
   * Menghitung ulang biaya untuk kasus pasien iDRG
   */
  static async recalculateIDRGCost(id: string): Promise<IDRGPatientCase> {
    try {
      const patientCase = await prisma.iDRGPatientCase.findUnique({
        where: { id },
        include: {
          idrgRule: true,
        },
      });
      
      if (!patientCase) {
        throw new Error('Kasus pasien iDRG tidak ditemukan');
      }
      
      // Hitung ulang bobot berdasarkan faktor penyesuaian
      let calculatedWeight = patientCase.idrgRule.baseWeight;
      if (patientCase.idrgRule.adjustmentFactor) {
        calculatedWeight *= patientCase.idrgRule.adjustmentFactor;
      }
      
      // Hitung jumlah akhir berdasarkan bobot dan tarif dasar rumah sakit
      const baseRatePerWeight = 100000; // Contoh: Rp 100,000 per unit bobot
      const finalAmount = calculatedWeight * baseRatePerWeight * patientCase.totalDays;
      
      const updatedCase = await prisma.iDRGPatientCase.update({
        where: { id },
        data: {
          calculatedWeight,
          finalAmount,
        },
        include: {
          patient: true,
          idrgRule: true,
        },
      });
      
      logger.info(`Biaya iDRG dihitung ulang untuk kasus: ${id}`);
      return updatedCase;
    } catch (error: any) {
      throw new Error(`Gagal menghitung ulang biaya iDRG: ${error.message}`);
    }
  }
}
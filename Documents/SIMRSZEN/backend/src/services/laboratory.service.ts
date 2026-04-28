import { PrismaClient, LaboratoryTest, LaboratoryResult, Patient, Visit } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class LaboratoryService {
  /**
   * Membuat permintaan pemeriksaan laboratorium baru
   */
  static async createLaboratoryTest(data: {
    patientId: string;
    visitId: string;
    kodePermintaan: string;
    tanggalPermintaan?: Date;
    parameterTests: Array<{
      parameter: string;
      nilaiNormal?: string;
    }>;
    catatan?: string;
  }): Promise<LaboratoryTest> {
    try {
      // Buat permintaan pemeriksaan laboratorium
      const laboratoryTest = await prisma.laboratoryTest.create({
        data: {
          patientId: data.patientId,
          visitId: data.visitId,
          kodePermintaan: data.kodePermintaan,
          tanggalPermintaan: data.tanggalPermintaan || new Date(),
          catatan: data.catatan || '',
          status: 'pending',
          laboratoryResults: {
            create: data.parameterTests.map(param => ({
              parameter: param.parameter,
              nilai: '-', // Belum ada hasil
              nilaiNormal: param.nilaiNormal || null,
              catatan: '-'
            }))
          }
        },
        include: {
          patient: true,
          visit: true,
          laboratoryResults: true
        }
      });

      return laboratoryTest;
    } catch (error) {
      logger.error('Error creating laboratory test:', error);
      throw error;
    }
  }

  /**
   * Memperbarui hasil pemeriksaan laboratorium
   */
  static async updateLaboratoryResults(testId: string, results: Array<{
    parameter: string;
    nilai: string;
    catatan?: string;
  }>): Promise<LaboratoryTest> {
    try {
      // Ambil data uji laboratorium
      const test = await prisma.laboratoryTest.findUnique({
        where: { id: testId },
        include: {
          laboratoryResults: true
        }
      });

      if (!test) {
        throw new Error(`Pemeriksaan laboratorium dengan ID ${testId} tidak ditemukan`);
      }

      if (test.status === 'completed') {
        throw new Error('Hasil pemeriksaan sudah selesai dan tidak bisa diubah');
      }

      // Update hasil untuk setiap parameter
      for (const result of results) {
        await prisma.laboratoryResult.updateMany({
          where: {
            laboratoryTestId: testId,
            parameter: result.parameter
          },
          data: {
            nilai: result.nilai,
            catatan: result.catatan || '-'
          }
        });
      }

      // Update status dan tanggal selesai
      const updatedTest = await prisma.laboratoryTest.update({
        where: { id: testId },
        data: {
          status: 'completed',
          tanggalSelesai: new Date()
        },
        include: {
          patient: true,
          visit: true,
          laboratoryResults: true
        }
      });

      // Sinkronisasi ke BPJS jika diperlukan
      // await BpjsSyncService.syncLaboratoryResultToBpjs(updatedTest.id);

      return updatedTest;
    } catch (error) {
      logger.error('Error updating laboratory results:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar pemeriksaan laboratorium
   */
  static async getLaboratoryTests(filter: {
    patientId?: string;
    visitId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<LaboratoryTest[]> {
    try {
      const whereClause: any = {};

      if (filter.patientId) whereClause.patientId = filter.patientId;
      if (filter.visitId) whereClause.visitId = filter.visitId;
      if (filter.status) whereClause.status = filter.status;

      if (filter.startDate || filter.endDate) {
        whereClause.tanggalPermintaan = {};
        if (filter.startDate) whereClause.tanggalPermintaan.gte = filter.startDate;
        if (filter.endDate) whereClause.tanggalPermintaan.lte = filter.endDate;
      }

      return await prisma.laboratoryTest.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: true,
          laboratoryResults: true
        },
        orderBy: { tanggalPermintaan: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting laboratory tests:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan detail pemeriksaan laboratorium
   */
  static async getLaboratoryTestDetail(testId: string): Promise<LaboratoryTest | null> {
    try {
      return await prisma.laboratoryTest.findUnique({
        where: { id: testId },
        include: {
          patient: true,
          visit: true,
          laboratoryResults: true
        }
      });
    } catch (error) {
      logger.error('Error getting laboratory test detail:', error);
      throw error;
    }
  }

  /**
   * Membatalkan pemeriksaan laboratorium
   */
  static async cancelLaboratoryTest(testId: string): Promise<LaboratoryTest> {
    try {
      const test = await prisma.laboratoryTest.findUnique({
        where: { id: testId }
      });

      if (!test) {
        throw new Error(`Pemeriksaan laboratorium dengan ID ${testId} tidak ditemukan`);
      }

      if (test.status === 'completed') {
        throw new Error('Tidak bisa membatalkan pemeriksaan yang sudah selesai');
      }

      const updatedTest = await prisma.laboratoryTest.update({
        where: { id: testId },
        data: {
          status: 'cancelled'
        },
        include: {
          patient: true,
          visit: true,
          laboratoryResults: true
        }
      });

      return updatedTest;
    } catch (error) {
      logger.error('Error cancelling laboratory test:', error);
      throw error;
    }
  }
}
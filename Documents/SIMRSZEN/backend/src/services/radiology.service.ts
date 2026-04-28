import { PrismaClient, RadiologyExam, Patient, Visit } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class RadiologyService {
  /**
   * Membuat permintaan pemeriksaan radiologi baru
   */
  static async createRadiologyExam(data: {
    patientId: string;
    visitId: string;
    kodePermintaan: string;
    tanggalPermintaan?: Date;
    jenisPemeriksaan: string;
    indikasiKlinis: string;
    catatan?: string;
  }): Promise<RadiologyExam> {
    try {
      // Buat permintaan pemeriksaan radiologi
      const radiologyExam = await prisma.radiologyExam.create({
        data: {
          patientId: data.patientId,
          visitId: data.visitId,
          kodePermintaan: data.kodePermintaan,
          tanggalPermintaan: data.tanggalPermintaan || new Date(),
          catatan: data.catatan || '',
          status: 'pending'
        },
        include: {
          patient: true,
          visit: true
        }
      });

      return radiologyExam;
    } catch (error) {
      logger.error('Error creating radiology exam:', error);
      throw error;
    }
  }

  /**
   * Memperbarui hasil pemeriksaan radiologi
   */
  static async updateRadiologyResult(examId: string, result: {
    hasil: string;
    gambar?: string;
    catatan?: string;
  }): Promise<RadiologyExam> {
    try {
      const exam = await prisma.radiologyExam.findUnique({
        where: { id: examId }
      });

      if (!exam) {
        throw new Error(`Pemeriksaan radiologi dengan ID ${examId} tidak ditemukan`);
      }

      if (exam.status === 'completed') {
        throw new Error('Hasil pemeriksaan sudah selesai dan tidak bisa diubah');
      }

      const updatedExam = await prisma.radiologyExam.update({
        where: { id: examId },
        data: {
          hasil: result.hasil,
          gambar: result.gambar,
          catatan: result.catatan || exam.catatan,
          status: 'completed',
          tanggalSelesai: new Date()
        },
        include: {
          patient: true,
          visit: true
        }
      });

      // Sinkronisasi ke BPJS jika diperlukan
      // await BpjsSyncService.syncRadiologyResultToBpjs(updatedExam.id);

      return updatedExam;
    } catch (error) {
      logger.error('Error updating radiology result:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar pemeriksaan radiologi
   */
  static async getRadiologyExams(filter: {
    patientId?: string;
    visitId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<RadiologyExam[]> {
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

      return await prisma.radiologyExam.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: true
        },
        orderBy: { tanggalPermintaan: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting radiology exams:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan detail pemeriksaan radiologi
   */
  static async getRadiologyExamDetail(examId: string): Promise<RadiologyExam | null> {
    try {
      return await prisma.radiologyExam.findUnique({
        where: { id: examId },
        include: {
          patient: true,
          visit: true
        }
      });
    } catch (error) {
      logger.error('Error getting radiology exam detail:', error);
      throw error;
    }
  }

  /**
   * Membatalkan pemeriksaan radiologi
   */
  static async cancelRadiologyExam(examId: string): Promise<RadiologyExam> {
    try {
      const exam = await prisma.radiologyExam.findUnique({
        where: { id: examId }
      });

      if (!exam) {
        throw new Error(`Pemeriksaan radiologi dengan ID ${examId} tidak ditemukan`);
      }

      if (exam.status === 'completed') {
        throw new Error('Tidak bisa membatalkan pemeriksaan yang sudah selesai');
      }

      const updatedExam = await prisma.radiologyExam.update({
        where: { id: examId },
        data: {
          status: 'cancelled'
        },
        include: {
          patient: true,
          visit: true
        }
      });

      return updatedExam;
    } catch (error) {
      logger.error('Error cancelling radiology exam:', error);
      throw error;
    }
  }
}
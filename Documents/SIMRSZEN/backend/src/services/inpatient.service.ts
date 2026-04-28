import { PrismaClient, InpatientStay, Kamar, Patient, Visit, Poli } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class InpatientService {
  /**
   * Menambahkan pasien rawat inap
   */
  static async admitPatient(data: {
    patientId: string;
    visitId: string;
    poliId: string;
    kamarId: string;
    noKamar: string;
    tanggalMasuk?: Date;
  }): Promise<InpatientStay> {
    try {
      // Periksa ketersediaan kamar
      const kamar = await prisma.kamar.findUnique({
        where: { id: data.kamarId }
      });

      if (!kamar) {
        throw new Error(`Kamar dengan ID ${data.kamarId} tidak ditemukan`);
      }

      if (kamar.terisi >= kamar.kapasitas) {
        throw new Error(`Kamar ${kamar.nama} sudah penuh`);
      }

      // Update jumlah terisi kamar
      await prisma.kamar.update({
        where: { id: data.kamarId },
        data: {
          terisi: { increment: 1 }
        }
      });

      // Buat data rawat inap
      const inpatientStay = await prisma.inpatientStay.create({
        data: {
          patientId: data.patientId,
          visitId: data.visitId,
          poliId: data.poliId,
          kamarId: data.kamarId,
          noKamar: data.noKamar,
          tanggalMasuk: data.tanggalMasuk || new Date(),
          status: 'aktif'
        },
        include: {
          patient: true,
          visit: true,
          poli: true,
          kamar: true
        }
      });

      // Sinkronisasi ke BPJS jika diperlukan
      // await BpjsSyncService.syncInpatientToBpjs(inpatientStay.id);

      return inpatientStay;
    } catch (error) {
      logger.error('Error admitting patient:', error);
      throw error;
    }
  }

  /**
   * Memindahkan pasien ke kamar lain
   */
  static async movePatient(inpatientStayId: string, newKamarId: string, newNoKamar: string): Promise<InpatientStay> {
    try {
      const stay = await prisma.inpatientStay.findUnique({
        where: { id: inpatientStayId }
      });

      if (!stay) {
        throw new Error(`Data rawat inap dengan ID ${inpatientStayId} tidak ditemukan`);
      }

      if (stay.status !== 'aktif') {
        throw new Error('Hanya bisa memindahkan pasien yang masih aktif dirawat');
      }

      // Kurangi jumlah terisi dari kamar lama
      await prisma.kamar.update({
        where: { id: stay.kamarId },
        data: { terisi: { decrement: 1 } }
      });

      // Periksa ketersediaan kamar baru
      const newKamar = await prisma.kamar.findUnique({
        where: { id: newKamarId }
      });

      if (!newKamar) {
        throw new Error(`Kamar dengan ID ${newKamarId} tidak ditemukan`);
      }

      if (newKamar.terisi >= newKamar.kapasitas) {
        throw new Error(`Kamar ${newKamar.nama} sudah penuh`);
      }

      // Update jumlah terisi kamar baru
      await prisma.kamar.update({
        where: { id: newKamarId },
        data: { terisi: { increment: 1 } }
      });

      // Update data rawat inap
      const updatedStay = await prisma.inpatientStay.update({
        where: { id: inpatientStayId },
        data: {
          kamarId: newKamarId,
          noKamar: newNoKamar
        },
        include: {
          patient: true,
          visit: true,
          poli: true,
          kamar: true
        }
      });

      return updatedStay;
    } catch (error) {
      logger.error('Error moving patient:', error);
      throw error;
    }
  }

  /**
   * Memulangkan pasien
   */
  static async dischargePatient(inpatientStayId: string, tanggalKeluar?: Date): Promise<InpatientStay> {
    try {
      const stay = await prisma.inpatientStay.findUnique({
        where: { id: inpatientStayId }
      });

      if (!stay) {
        throw new Error(`Data rawat inap dengan ID ${inpatientStayId} tidak ditemukan`);
      }

      if (stay.status !== 'aktif') {
        throw new Error('Hanya bisa memulangkan pasien yang masih aktif dirawat');
      }

      // Kurangi jumlah terisi dari kamar
      await prisma.kamar.update({
        where: { id: stay.kamarId },
        data: { terisi: { decrement: 1 } }
      });

      // Update status rawat inap
      const dischargedStay = await prisma.inpatientStay.update({
        where: { id: inpatientStayId },
        data: {
          tanggalKeluar: tanggalKeluar || new Date(),
          status: 'pulang'
        },
        include: {
          patient: true,
          visit: true,
          poli: true,
          kamar: true
        }
      });

      return dischargedStay;
    } catch (error) {
      logger.error('Error discharging patient:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar pasien aktif
   */
  static async getActivePatients(): Promise<InpatientStay[]> {
    try {
      return await prisma.inpatientStay.findMany({
        where: { status: 'aktif' },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true,
              jenisKelamin: true,
              tanggalLahir: true
            }
          },
          kamar: {
            select: {
              nama: true,
              kode: true,
              kelas: true
            }
          },
          poli: {
            select: {
              nama: true,
              kode: true
            }
          }
        },
        orderBy: { tanggalMasuk: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting active patients:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan riwayat rawat inap pasien
   */
  static async getPatientHistory(patientId: string): Promise<InpatientStay[]> {
    try {
      return await prisma.inpatientStay.findMany({
        where: { patientId },
        include: {
          kamar: {
            select: {
              nama: true,
              kode: true,
              kelas: true
            }
          },
          poli: {
            select: {
              nama: true,
              kode: true
            }
          }
        },
        orderBy: { tanggalMasuk: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting patient history:', error);
      throw error;
    }
  }
}
import { PrismaClient, Kamar, InpatientStay, Patient, Poli } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class BedManagementService {
  /**
   * Mendapatkan ketersediaan kamar
   */
  static async getAvailableBeds(filter: {
    kelas?: string;
    poliId?: string;
    searchTerm?: string;
  } = {}): Promise<Array<{
    kamar: Kamar;
    booked: number;
    available: number;
    occupied: number;
    inpatients: Array<{
      id: string;
      patient: Patient;
      inpatientStay: InpatientStay;
    }>;
  }>> {
    try {
      const whereClause: any = {
        isActive: true
      };

      if (filter.kelas) whereClause.kelas = filter.kelas;
      if (filter.poliId) whereClause.poliId = filter.poliId;

      if (filter.searchTerm) {
        whereClause.nama = {
          contains: filter.searchTerm,
          mode: 'insensitive'
        };
      }

      const kamars = await prisma.kamar.findMany({
        where: whereClause,
        include: {
          inpatientStays: {
            where: { status: 'aktif' },
            include: {
              patient: true,
              poli: true
            }
          }
        }
      });

      return kamars.map(kamar => {
        const occupied = kamar.inpatientStays.length;
        const available = kamar.kapasitas - occupied;

        return {
          kamar,
          booked: 0, // Placeholder - dalam implementasi nyata akan ada sistem booking
          available,
          occupied,
          inpatients: kamar.inpatientStays.map(stay => ({
            id: stay.id,
            patient: stay.patient,
            inpatientStay: stay
          }))
        };
      });
    } catch (error) {
      logger.error('Error getting available beds:', error);
      throw error;
    }
  }

  /**
   * Booking kamar untuk pasien
   */
  static async bookBed(data: {
    patientId: string;
    kamarId: string;
    estimatedAdmissionDate: Date;
    notes?: string;
  }): Promise<{
    id: string;
    patientId: string;
    kamarId: string;
    estimatedAdmissionDate: Date;
    status: string;
    notes: string;
  }> {
    try {
      // Dalam implementasi nyata, kita akan membuat entitas booking terpisah
      // Untuk sekarang kita hanya menandai kamar sebagai booked dengan status sementara
      const kamar = await prisma.kamar.findUnique({
        where: { id: data.kamarId }
      });

      if (!kamar) {
        throw new Error(`Kamar dengan ID ${data.kamarId} tidak ditemukan`);
      }

      if (kamar.terisi >= kamar.kapasitas) {
        throw new Error(`Kamar ${kamar.nama} sudah penuh`);
      }

      // Dalam implementasi nyata, kita akan membuat entitas booking
      // Untuk sekarang, kita hanya kembalikan data booking
      return {
        id: `BOOK-${Date.now()}`,
        patientId: data.patientId,
        kamarId: data.kamarId,
        estimatedAdmissionDate: data.estimatedAdmissionDate,
        status: 'booked',
        notes: data.notes || ''
      };
    } catch (error) {
      logger.error('Error booking bed:', error);
      throw error;
    }
  }

  /**
   * Membatalkan booking kamar
   */
  static async cancelBooking(bookingId: string): Promise<void> {
    try {
      // Dalam implementasi nyata, kita akan menghapus entitas booking
      // Untuk sekarang kita hanya melempar error karena tidak ada sistem booking yang sebenarnya
      throw new Error('Sistem booking belum diimplementasikan sepenuhnya');
    } catch (error) {
      logger.error('Error canceling booking:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan status kamar saat ini
   */
  static async getBedStatus(kamarId: string): Promise<{
    kamar: Kamar;
    occupancyRate: number;
    occupiedCount: number;
    availableCount: number;
    inpatients: Array<{
      id: string;
      patient: Patient;
      inpatientStay: InpatientStay;
      daysAdmitted: number;
    }>;
  }> {
    try {
      const kamar = await prisma.kamar.findUnique({
        where: { id: kamarId },
        include: {
          inpatientStays: {
            where: { status: 'aktif' },
            include: {
              patient: true,
              poli: true
            }
          }
        }
      });

      if (!kamar) {
        throw new Error(`Kamar dengan ID ${kamarId} tidak ditemukan`);
      }

      const occupiedCount = kamar.inpatientStays.length;
      const availableCount = kamar.kapasitas - occupiedCount;
      const occupancyRate = (occupiedCount / kamar.kapasitas) * 100;

      const inpatientsWithDays = kamar.inpatientStays.map(stay => {
        const admissionDate = new Date(stay.tanggalMasuk);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: stay.id,
          patient: stay.patient,
          inpatientStay: stay,
          daysAdmitted: diffDays
        };
      });

      return {
        kamar,
        occupancyRate,
        occupiedCount,
        availableCount,
        inpatients: inpatientsWithDays
      };
    } catch (error) {
      logger.error('Error getting bed status:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan laporan ketersediaan kamar
   */
  static async getBedAvailabilityReport(
    startDate: Date,
    endDate: Date,
    filter: { kelas?: string } = {}
  ): Promise<{
    totalKamar: number;
    totalOccupied: number;
    totalAvailable: number;
    averageOccupancyRate: number;
    kamarBreakdown: Array<{
      kamar: Kamar;
      occupiedDays: number;
      occupancyRate: number;
    }>;
  }> {
    try {
      const whereClause: any = {
        isActive: true
      };

      if (filter.kelas) whereClause.kelas = filter.kelas;

      const allKamars = await prisma.kamar.findMany({
        where: whereClause
      });

      const totalKamar = allKamars.length;
      let totalOccupied = 0;
      let totalAvailable = 0;

      const kamarBreakdown = await Promise.all(allKamars.map(async (kamar) => {
        // Hitung berapa hari kamar ini terisi dalam periode tertentu
        const occupiedStays = await prisma.inpatientStay.findMany({
          where: {
            kamarId: kamar.id,
            status: 'aktif',
            OR: [
              {
                tanggalMasuk: { lte: endDate },
                tanggalKeluar: { gte: startDate }
              },
              {
                tanggalMasuk: { gte: startDate, lte: endDate }
              },
              {
                tanggalKeluar: null,
                tanggalMasuk: { lte: endDate }
              }
            ]
          }
        });

        const occupiedDays = occupiedStays.reduce((total, stay) => {
          const stayStart = stay.tanggalMasuk > startDate ? stay.tanggalMasuk : startDate;
          const stayEnd = stay.tanggalKeluar && stay.tanggalKeluar < endDate ? stay.tanggalKeluar : endDate;
          
          const diffTime = Math.abs(new Date(stayEnd).getTime() - new Date(stayStart).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return total + diffDays;
        }, 0);

        const totalPossibleDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const occupancyRate = totalPossibleDays > 0 ? (occupiedDays / (kamar.kapasitas * totalPossibleDays)) * 100 : 0;

        totalOccupied += Math.round(kamar.kapasitas * (occupancyRate / 100));
        totalAvailable += kamar.kapasitas - Math.round(kamar.kapasitas * (occupancyRate / 100));

        return {
          kamar,
          occupiedDays,
          occupancyRate
        };
      }));

      const averageOccupancyRate = totalKamar > 0 ? (totalOccupied / (totalKamar * 10)) * 100 : 0;

      return {
        totalKamar,
        totalOccupied,
        totalAvailable,
        averageOccupancyRate,
        kamarBreakdown
      };
    } catch (error) {
      logger.error('Error getting bed availability report:', error);
      throw error;
    }
  }
}
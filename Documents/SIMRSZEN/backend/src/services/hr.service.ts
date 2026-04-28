import { PrismaClient, Pegawai, Presensi } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class HRService {
  /**
   * Membuat data pegawai baru
   */
  static async createEmployee(data: {
    nip: string;
    nama: string;
    jenisKelamin: string;
    tempatLahir?: string;
    tanggalLahir?: Date;
    alamat?: string;
    noHp?: string;
    email?: string;
    departemen?: string;
    jabatan?: string;
    status?: string;
    tanggalMasuk?: Date;
  }): Promise<Pegawai> {
    try {
      // Cek apakah NIP sudah digunakan
      const existingEmployee = await prisma.pegawai.findUnique({
        where: { nip: data.nip }
      });

      if (existingEmployee) {
        throw new Error(`NIP ${data.nip} sudah digunakan oleh pegawai lain`);
      }

      const employee = await prisma.pegawai.create({
        data: {
          nip: data.nip,
          nama: data.nama,
          jenisKelamin: data.jenisKelamin,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          noHp: data.noHp,
          email: data.email,
          departemen: data.departemen,
          jabatan: data.jabatan,
          status: data.status || 'aktif',
          tanggalMasuk: data.tanggalMasuk || new Date()
        }
      });

      return employee;
    } catch (error) {
      logger.error('Error creating employee:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan data pegawai
   */
  static async getEmployee(employeeId: string): Promise<Pegawai | null> {
    try {
      return await prisma.pegawai.findUnique({
        where: { id: employeeId }
      });
    } catch (error) {
      logger.error('Error getting employee:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar pegawai
   */
  static async getEmployees(filter: {
    status?: string;
    departemen?: string;
    searchTerm?: string;
  } = {}): Promise<Pegawai[]> {
    try {
      const whereClause: any = {};

      if (filter.status) whereClause.status = filter.status;
      if (filter.departemen) whereClause.departemen = filter.departemen;

      if (filter.searchTerm) {
        whereClause.nama = {
          contains: filter.searchTerm,
          mode: 'insensitive'
        };
      }

      return await prisma.pegawai.findMany({
        where: whereClause,
        orderBy: { nama: 'asc' }
      });
    } catch (error) {
      logger.error('Error getting employees:', error);
      throw error;
    }
  }

  /**
   * Memperbarui data pegawai
   */
  static async updateEmployee(employeeId: string, data: Partial<{
    nama: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: Date;
    alamat: string;
    noHp: string;
    email: string;
    departemen: string;
    jabatan: string;
    status: string;
    tanggalKeluar: Date;
  }>): Promise<Pegawai> {
    try {
      const employee = await prisma.pegawai.update({
        where: { id: employeeId },
        data
      });

      return employee;
    } catch (error) {
      logger.error('Error updating employee:', error);
      throw error;
    }
  }

  /**
   * Menghapus data pegawai
   */
  static async deleteEmployee(employeeId: string): Promise<void> {
    try {
      await prisma.pegawai.delete({
        where: { id: employeeId }
      });
    } catch (error) {
      logger.error('Error deleting employee:', error);
      throw error;
    }
  }

  /**
   * Mencatat presensi masuk
   */
  static async recordAttendanceIn(pegawaiId: string, tanggal?: Date): Promise<Presensi> {
    try {
      const today = tanggal || new Date();
      const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Cek apakah sudah ada presensi hari ini
      const existingAttendance = await prisma.presensi.findFirst({
        where: {
          pegawaiId,
          tanggal: {
            gte: dateOnly,
            lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (existingAttendance) {
        throw new Error('Presensi hari ini sudah dicatat');
      }

      const attendance = await prisma.presensi.create({
        data: {
          pegawaiId,
          tanggal: dateOnly,
          jamMasuk: today,
          status: 'masuk'
        }
      });

      return attendance;
    } catch (error) {
      logger.error('Error recording attendance in:', error);
      throw error;
    }
  }

  /**
   * Mencatat presensi keluar
   */
  static async recordAttendanceOut(pegawaiId: string, tanggal?: Date): Promise<Presensi> {
    try {
      const today = tanggal || new Date();
      const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Cari presensi masuk hari ini
      const attendance = await prisma.presensi.findFirst({
        where: {
          pegawaiId,
          tanggal: {
            gte: dateOnly,
            lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
          },
          jamKeluar: null
        }
      });

      if (!attendance) {
        throw new Error('Presensi masuk tidak ditemukan untuk hari ini');
      }

      const updatedAttendance = await prisma.presensi.update({
        where: { id: attendance.id },
        data: {
          jamKeluar: today
        }
      });

      return updatedAttendance;
    } catch (error) {
      logger.error('Error recording attendance out:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar presensi
   */
  static async getAttendances(filter: {
    pegawaiId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  } = {}): Promise<Presensi[]> {
    try {
      const whereClause: any = {};

      if (filter.pegawaiId) whereClause.pegawaiId = filter.pegawaiId;
      if (filter.status) whereClause.status = filter.status;

      if (filter.startDate || filter.endDate) {
        whereClause.tanggal = {};
        if (filter.startDate) whereClause.tanggal.gte = filter.startDate;
        if (filter.endDate) whereClause.tanggal.lte = filter.endDate;
      }

      return await prisma.presensi.findMany({
        where: whereClause,
        include: {
          pegawai: {
            select: {
              nama: true,
              nip: true,
              jabatan: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting attendances:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan rekap presensi bulanan
   */
  static async getMonthlyAttendanceSummary(pegawaiId: string, year: number, month: number): Promise<{
    totalHadir: number;
    totalTelat: number;
    totalIzin: number;
    totalSakit: number;
    totalAlpha: number;
  }> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const attendances = await prisma.presensi.findMany({
        where: {
          pegawaiId,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      const totalHadir = attendances.filter(a => a.status === 'masuk').length;
      const totalTelat = attendances.filter(a => a.status === 'telat').length;
      const totalIzin = attendances.filter(a => a.status === 'izin').length;
      const totalSakit = attendances.filter(a => a.status === 'sakit').length;
      const totalAlpha = attendances.filter(a => a.status === 'alpha').length;

      return {
        totalHadir,
        totalTelat,
        totalIzin,
        totalSakit,
        totalAlpha
      };
    } catch (error) {
      logger.error('Error getting monthly attendance summary:', error);
      throw error;
    }
  }
}
import { PrismaClient, FinancialTransaction, Patient, Visit } from '@prisma/client';
import { BpjsSyncService } from './bpjs-sync.service';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class FinancialService {
  /**
   * Membuat transaksi keuangan baru
   */
  static async createTransaction(data: {
    patientId: string;
    visitId: string;
    jenisTransaksi: string;
    metodePembayaran: string;
    jumlah: number;
    tanggal?: Date;
    status?: string;
    catatan?: string;
  }): Promise<FinancialTransaction> {
    try {
      const transaction = await prisma.financialTransaction.create({
        data: {
          patientId: data.patientId,
          visitId: data.visitId,
          jenisTransaksi: data.jenisTransaksi,
          metodePembayaran: data.metodePembayaran,
          jumlah: data.jumlah,
          tanggal: data.tanggal || new Date(),
          status: data.status || 'completed',
          catatan: data.catatan || ''
        },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        }
      });

      // Update status bayar di visit jika ini pembayaran
      if (data.jenisTransaksi === 'pembayaran') {
        await prisma.visit.update({
          where: { id: data.visitId },
          data: { statusBayar: true }
        });
      }

      return transaction;
    } catch (error) {
      logger.error('Error creating financial transaction:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan daftar transaksi keuangan
   */
  static async getTransactions(filter: {
    patientId?: string;
    visitId?: string;
    jenisTransaksi?: string;
    metodePembayaran?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<FinancialTransaction[]> {
    try {
      const whereClause: any = {};

      if (filter.patientId) whereClause.patientId = filter.patientId;
      if (filter.visitId) whereClause.visitId = filter.visitId;
      if (filter.jenisTransaksi) whereClause.jenisTransaksi = filter.jenisTransaksi;
      if (filter.metodePembayaran) whereClause.metodePembayaran = filter.metodePembayaran;
      if (filter.status) whereClause.status = filter.status;

      if (filter.startDate || filter.endDate) {
        whereClause.tanggal = {};
        if (filter.startDate) whereClause.tanggal.gte = filter.startDate;
        if (filter.endDate) whereClause.tanggal.lte = filter.endDate;
      }

      return await prisma.financialTransaction.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });
    } catch (error) {
      logger.error('Error getting transactions:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan ringkasan keuangan harian
   */
  static async getDailySummary(date: Date): Promise<{
    totalPendapatan: number;
    totalPembayaran: number;
    totalRefund: number;
    jumlahTransaksi: number;
  }> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          tanggal: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      const totalPendapatan = transactions
        .filter(t => t.jenisTransaksi === 'pembayaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const totalPembayaran = transactions
        .filter(t => t.jenisTransaksi === 'pembayaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const totalRefund = transactions
        .filter(t => t.jenisTransaksi === 'refund')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      return {
        totalPendapatan,
        totalPembayaran,
        totalRefund,
        jumlahTransaksi: transactions.length
      };
    } catch (error) {
      logger.error('Error getting daily summary:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan ringkasan keuangan bulanan
   */
  static async getMonthlySummary(year: number, month: number): Promise<{
    totalPendapatan: number;
    totalPembayaran: number;
    totalRefund: number;
    jumlahTransaksi: number;
  }> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      const totalPendapatan = transactions
        .filter(t => t.jenisTransaksi === 'pembayaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const totalPembayaran = transactions
        .filter(t => t.jenisTransaksi === 'pembayaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const totalRefund = transactions
        .filter(t => t.jenisTransaksi === 'refund')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      return {
        totalPendapatan,
        totalPembayaran,
        totalRefund,
        jumlahTransaksi: transactions.length
      };
    } catch (error) {
      logger.error('Error getting monthly summary:', error);
      throw error;
    }
  }

  /**
   * Membatalkan transaksi
   */
  static async cancelTransaction(transactionId: string): Promise<FinancialTransaction> {
    try {
      const transaction = await prisma.financialTransaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction) {
        throw new Error(`Transaksi dengan ID ${transactionId} tidak ditemukan`);
      }

      if (transaction.status === 'cancelled') {
        throw new Error('Transaksi sudah dibatalkan sebelumnya');
      }

      const updatedTransaction = await prisma.financialTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'cancelled'
        },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        }
      });

      return updatedTransaction;
    } catch (error) {
      logger.error('Error cancelling transaction:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan laporan keuangan
   */
  static async getFinancialReport(startDate: Date, endDate: Date): Promise<{
    transactions: FinancialTransaction[];
    totalPendapatan: number;
    totalPengeluaran: number;
    saldoAkhir: number;
  }> {
    try {
      const transactions = await prisma.financialTransaction.findMany({
        where: {
          tanggal: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          patient: {
            select: {
              nama: true,
              patientId: true
            }
          },
          visit: {
            select: {
              visitId: true,
              tanggalPeriksa: true
            }
          }
        },
        orderBy: { tanggal: 'desc' }
      });

      const totalPendapatan = transactions
        .filter(t => t.jenisTransaksi === 'pembayaran')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const totalPengeluaran = transactions
        .filter(t => t.jenisTransaksi === 'refund' || t.jenisTransaksi === 'adjustment')
        .reduce((sum, t) => sum + Number(t.jumlah), 0);

      const saldoAkhir = totalPendapatan - totalPengeluaran;

      return {
        transactions,
        totalPendapatan,
        totalPengeluaran,
        saldoAkhir
      };
    } catch (error) {
      logger.error('Error getting financial report:', error);
      throw error;
    }
  }
}
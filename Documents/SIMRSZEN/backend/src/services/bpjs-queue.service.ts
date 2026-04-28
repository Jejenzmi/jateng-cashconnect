import { PrismaClient, BpjsSyncQueue } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class BpjsQueueService {
  /**
   * Menambahkan tugas ke queue
   */
  static async addToQueue(data: {
    serviceType: string;
    endpoint: string;
    method: string;
    payload: any;
  }): Promise<BpjsSyncQueue> {
    try {
      return await prisma.bpjsSyncQueue.create({
        data: {
          serviceType: data.serviceType,
          endpoint: data.endpoint,
          method: data.method,
          payload: data.payload,
          status: 'pending',
        },
      });
    } catch (error) {
      logger.error('Error adding to queue:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan tugas yang siap diproses
   */
  static async getPendingJobs(limit: number = 10): Promise<BpjsSyncQueue[]> {
    const now = new Date();
    
    return await prisma.bpjsSyncQueue.findMany({
      where: {
        OR: [
          { status: 'pending' },
          { 
            status: 'failed',
            nextAttemptAt: { lte: now }
          }
        ],
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Memperbarui status tugas
   */
  static async updateJobStatus(id: string, status: string, error?: string): Promise<BpjsSyncQueue> {
    const updateData: any = { status };
    
    if (error) {
      updateData.error = error;
      updateData.attempts = { increment: 1 };
      
      // Atur waktu percobaan berikutnya dengan exponential backoff
      const nextAttemptDelay = Math.min(300000, Math.pow(2, await this.getCurrentAttempts(id)) * 60000); // Maksimal 5 menit
      const nextAttemptAt = new Date();
      nextAttemptAt.setTime(nextAttemptAt.getTime() + nextAttemptDelay);
      updateData.nextAttemptAt = nextAttemptAt;
    }

    try {
      return await prisma.bpjsSyncQueue.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      logger.error('Error updating job status:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan jumlah percobaan saat ini
   */
  private static async getCurrentAttempts(id: string): Promise<number> {
    const job = await prisma.bpjsSyncQueue.findUnique({
      where: { id },
      select: { attempts: true }
    });
    
    return job?.attempts || 0;
  }

  /**
   * Menghapus tugas dari queue
   */
  static async removeJob(id: string): Promise<void> {
    try {
      await prisma.bpjsSyncQueue.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Error removing job:', error);
      throw error;
    }
  }

  /**
   * Menghitung jumlah tugas dalam status tertentu
   */
  static async countJobsByStatus(status?: string): Promise<number> {
    const whereClause = status ? { status } : {};
    return await prisma.bpjsSyncQueue.count({ where: whereClause });
  }

  /**
   * Membersihkan tugas lama yang telah selesai
   */
  static async cleanupCompletedJobs(days: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    try {
      const result = await prisma.bpjsSyncQueue.deleteMany({
        where: {
          status: 'completed',
          updatedAt: {
            lt: cutoffDate,
          },
        },
      });

      return result.count;
    } catch (error) {
      logger.error('Error cleaning up completed jobs:', error);
      return 0;
    }
  }

  /**
   * Menghapus tugas gagal yang sudah mencapai batas percobaan
   */
  static async cleanupFailedJobs(maxAttempts: number = 5): Promise<number> {
    try {
      const result = await prisma.bpjsSyncQueue.deleteMany({
        where: {
          status: 'failed',
          attempts: {
            gte: maxAttempts,
          },
        },
      });

      return result.count;
    } catch (error) {
      logger.error('Error cleaning up failed jobs:', error);
      return 0;
    }
  }

  /**
   * Mendapatkan tugas berdasarkan tipe layanan
   */
  static async getJobsByServiceType(serviceType: string, limit: number = 10, offset: number = 0): Promise<BpjsSyncQueue[]> {
    return await prisma.bpjsSyncQueue.findMany({
      where: { serviceType },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }
}
import { Request, Response } from 'express';
import { BpjsQueueService } from '../services/bpjs-queue.service';
import { logger } from '../utils/logger.util';

export class BpjsQueueController {
  /**
   * Mendapatkan queue berdasarkan filter
   */
  static async getQueue(req: Request, res: Response) {
    try {
      const { serviceType, status, dateFrom, dateTo, page = '1', limit = '10' } = req.query;
      
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      const whereClause: any = {};
      if (serviceType) whereClause.serviceType = serviceType;
      if (status) whereClause.status = status;
      
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) whereClause.createdAt.lte = new Date(dateTo as string);
      }
      
      const queueItems = await BpjsQueueService.getJobsByServiceType(serviceType as string, limitNum, offset);
      const totalCount = await BpjsQueueService.countJobsByStatus(status as string);
      
      res.status(200).json({
        success: true,
        message: 'Queue items retrieved successfully',
        data: {
          items: queueItems,
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    } catch (error) {
      logger.error('Error getting queue:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving queue',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan queue berdasarkan ID
   */
  static async getQueueById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Queue ID is required',
        });
      }
      
      // Dalam implementasi nyata, kita akan menambahkan fungsi getById ke service
      // Tapi untuk sekarang, kita cari dalam daftar queue
      const allQueues = await BpjsQueueService.getJobsByServiceType('', 1000, 0);
      const queueItem = allQueues.find(item => item.id === id);
      
      if (!queueItem) {
        return res.status(404).json({
          success: false,
          message: 'Queue item not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Queue item retrieved successfully',
        data: queueItem
      });
    } catch (error) {
      logger.error('Error getting queue by ID:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving queue item',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mencoba ulang job
   */
  static async retryJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Queue ID is required',
        });
      }
      
      // Dalam implementasi nyata, kita akan menambahkan fungsi retry ke service
      // Untuk sekarang, kita hanya mengubah status menjadi pending
      const updatedJob = await BpjsQueueService.updateJobStatus(id, 'pending');
      
      res.status(200).json({
        success: true,
        message: 'Queue job retry scheduled successfully',
        data: updatedJob
      });
    } catch (error) {
      logger.error('Error retrying job:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrying queue job',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menghapus job dari queue
   */
  static async removeJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Queue ID is required',
        });
      }
      
      await BpjsQueueService.removeJob(id);
      
      res.status(200).json({
        success: true,
        message: 'Queue job removed successfully',
      });
    } catch (error) {
      logger.error('Error removing job:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error removing queue job',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Membersihkan job yang telah selesai
   */
  static async cleanupCompletedJobs(req: Request, res: Response) {
    try {
      const { days } = req.query;
      const daysNum = parseInt(days as string) || 7; // Default 7 hari
      
      const deletedCount = await BpjsQueueService.cleanupCompletedJobs(daysNum);
      
      res.status(200).json({
        success: true,
        message: `${deletedCount} completed jobs deleted successfully`,
        data: {
          deletedCount
        }
      });
    } catch (error) {
      logger.error('Error cleaning up completed jobs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error cleaning up completed jobs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Membersihkan job yang gagal
   */
  static async cleanupFailedJobs(req: Request, res: Response) {
    try {
      const { maxAttempts } = req.query;
      const maxAttemptsNum = parseInt(maxAttempts as string) || 5; // Default 5 kali
      
      const deletedCount = await BpjsQueueService.cleanupFailedJobs(maxAttemptsNum);
      
      res.status(200).json({
        success: true,
        message: `${deletedCount} failed jobs deleted successfully`,
        data: {
          deletedCount
        }
      });
    } catch (error) {
      logger.error('Error cleaning up failed jobs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error cleaning up failed jobs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}
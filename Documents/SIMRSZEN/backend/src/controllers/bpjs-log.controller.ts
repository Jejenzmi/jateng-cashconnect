import { Request, Response } from 'express';
import { BpjsLogService } from '../services/bpjs-log.service';
import { logger } from '../utils/logger.util';

export class BpjsLogController {
  /**
   * Mendapatkan log berdasarkan filter
   */
  static async getLogs(req: Request, res: Response) {
    try {
      const { 
        serviceType, 
        endpoint, 
        statusCode, 
        dateFrom, 
        dateTo, 
        page = '1', 
        limit = '10' 
      } = req.query;
      
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      const whereClause: any = {};
      if (serviceType) whereClause.serviceType = serviceType;
      if (endpoint) whereClause.endpoint = endpoint;
      if (statusCode) whereClause.statusCode = parseInt(statusCode as string);
      
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) whereClause.createdAt.lte = new Date(dateTo as string);
      }
      
      const logs = await BpjsLogService.getLogsByServiceType(serviceType as string, limitNum, offset);
      const totalCount = await BpjsLogService.countLogs(serviceType as string);
      
      res.status(200).json({
        success: true,
        message: 'Logs retrieved successfully',
        data: {
          logs,
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    } catch (error) {
      logger.error('Error getting logs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving logs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan log error
   */
  static async getErrorLogs(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10' } = req.query;
      
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      const logs = await BpjsLogService.getErrorLogs(limitNum, offset);
      const totalCount = await BpjsLogService.countLogs();
      
      res.status(200).json({
        success: true,
        message: 'Error logs retrieved successfully',
        data: {
          logs,
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    } catch (error) {
      logger.error('Error getting error logs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving error logs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Membersihkan log lama
   */
  static async cleanupOldLogs(req: Request, res: Response) {
    try {
      const { days } = req.params;
      const daysNum = parseInt(days) || 30; // Default 30 hari
      
      const deletedCount = await BpjsLogService.deleteOldLogs(daysNum);
      
      res.status(200).json({
        success: true,
        message: `${deletedCount} logs deleted successfully`,
        data: {
          deletedCount
        }
      });
    } catch (error) {
      logger.error('Error cleaning up old logs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error cleaning up old logs',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan statistik error
   */
  static async getErrorStats(req: Request, res: Response) {
    try {
      const { serviceType } = req.query;
      
      const stats = await BpjsLogService.getErrorStats(serviceType as string);
      
      res.status(200).json({
        success: true,
        message: 'Error stats retrieved successfully',
        data: {
          stats
        }
      });
    } catch (error) {
      logger.error('Error getting error stats:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving error stats',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}
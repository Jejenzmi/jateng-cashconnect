import { Request, Response } from 'express';
import { BpjsCacheService } from '../services/bpjs-cache.service';
import { logger } from '../utils/logger.util';

export class BpjsCacheController {
  /**
   * Mendapatkan semua cache
   */
  static async getCache(req: Request, res: Response) {
    try {
      const { cacheKey, dateFrom, dateTo, page = '1', limit = '10' } = req.query;
      
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      // Dalam implementasi nyata, kita akan menambahkan filter ke fungsi getCache
      // Tapi karena fungsi BpjsCacheService tidak mendukung filter, kita ambil semua
      // dan filter di sini
      const allCache = await BpjsCacheService['getAll']?.() || []; // Metode yang belum dibuat
      const filteredCache = allCache.filter(item => {
        let matches = true;
        
        if (cacheKey && !item.cacheKey.includes(cacheKey as string)) {
          matches = false;
        }
        
        if (dateFrom) {
          const fromDate = new Date(dateFrom as string);
          if (new Date(item.createdAt) < fromDate) {
            matches = false;
          }
        }
        
        if (dateTo) {
          const toDate = new Date(dateTo as string);
          if (new Date(item.createdAt) > toDate) {
            matches = false;
          }
        }
        
        return matches;
      });
      
      const paginatedCache = filteredCache.slice(offset, offset + limitNum);
      
      res.status(200).json({
        success: true,
        message: 'Cache retrieved successfully',
        data: {
          items: paginatedCache,
          total: filteredCache.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filteredCache.length / limitNum)
        }
      });
    } catch (error) {
      logger.error('Error getting cache:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving cache',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Mendapatkan cache berdasarkan key
   */
  static async getCacheByKey(req: Request, res: Response) {
    try {
      const { cacheKey } = req.params;
      
      if (!cacheKey) {
        return res.status(400).json({
          success: false,
          message: 'Cache key is required',
        });
      }
      
      const cachedData = await BpjsCacheService.get(cacheKey);
      
      if (!cachedData) {
        return res.status(404).json({
          success: false,
          message: 'Cache not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Cache retrieved successfully',
        data: cachedData
      });
    } catch (error) {
      logger.error('Error getting cache by key:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving cache',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menghapus cache berdasarkan key
   */
  static async deleteCache(req: Request, res: Response) {
    try {
      const { cacheKey } = req.params;
      
      if (!cacheKey) {
        return res.status(400).json({
          success: false,
          message: 'Cache key is required',
        });
      }
      
      const isDeleted = await BpjsCacheService.delete(cacheKey);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: 'Cache not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Cache deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting cache:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error deleting cache',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Menghapus semua cache
   */
  static async clearAllCache(req: Request, res: Response) {
    try {
      const isCleared = await BpjsCacheService.clearAll();
      
      res.status(200).json({
        success: true,
        message: 'All cache cleared successfully',
      });
    } catch (error) {
      logger.error('Error clearing all cache:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error clearing all cache',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Membersihkan cache kadaluarsa
   */
  static async cleanupExpired(req: Request, res: Response) {
    try {
      const deletedCount = await BpjsCacheService.cleanupExpired();
      
      res.status(200).json({
        success: true,
        message: 'Expired cache cleaned up successfully',
        data: {
          deletedCount
        }
      });
    } catch (error) {
      logger.error('Error cleaning up expired cache:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error cleaning up expired cache',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}
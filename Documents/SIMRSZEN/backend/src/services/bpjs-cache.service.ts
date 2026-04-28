import { PrismaClient, BpjsCache } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class BpjsCacheService {
  /**
   * Menyimpan data ke cache
   */
  static async set(cacheKey: string, data: any, ttlMinutes: number = 30): Promise<BpjsCache> {
    const expiryAt = new Date();
    expiryAt.setMinutes(expiryAt.getMinutes() + ttlMinutes);

    try {
      // Coba hapus cache lama jika ada
      await prisma.bpjsCache.delete({ where: { cacheKey } }).catch(() => {});
      
      return await prisma.bpjsCache.create({
        data: {
          cacheKey,
          data,
          expiryAt,
        },
      });
    } catch (error) {
      logger.error('Error setting cache:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan data dari cache
   */
  static async get(cacheKey: string): Promise<any | null> {
    try {
      const cachedData = await prisma.bpjsCache.findUnique({
        where: { cacheKey },
      });

      if (!cachedData) {
        return null;
      }

      // Periksa apakah cache sudah kadaluarsa
      if (new Date() > cachedData.expiryAt) {
        await this.delete(cacheKey);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      logger.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Menghapus data dari cache
   */
  static async delete(cacheKey: string): Promise<boolean> {
    try {
      await prisma.bpjsCache.delete({ where: { cacheKey } });
      return true;
    } catch (error) {
      logger.error('Error deleting cache:', error);
      return false;
    }
  }

  /**
   * Membersihkan cache yang kadaluarsa
   */
  static async cleanupExpired(): Promise<number> {
    try {
      const result = await prisma.bpjsCache.deleteMany({
        where: {
          expiryAt: {
            lt: new Date(),
          },
        },
      });
      return result.count;
    } catch (error) {
      logger.error('Error cleaning up expired cache:', error);
      return 0;
    }
  }

  /**
   * Membuat cache key unik berdasarkan parameter
   */
  static generateCacheKey(serviceType: string, endpoint: string, params: any): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const keyBase = `${serviceType}:${endpoint}:${paramString}`;
    // Buat hash dari keyBase untuk memastikan panjang maksimum
    const hash = require('crypto').createHash('md5').update(keyBase).digest('hex');
    return `${serviceType}_${endpoint}_${hash}`;
  }

  /**
   * Menghapus semua cache
   */
  static async clearAll(): Promise<boolean> {
    try {
      await prisma.bpjsCache.deleteMany({});
      return true;
    } catch (error) {
      logger.error('Error clearing all cache:', error);
      return false;
    }
  }

  /**
   * Mendapatkan semua cache entries
   */
  static async getAll(limit: number = 100, offset: number = 0): Promise<BpjsCache[]> {
    try {
      return await prisma.bpjsCache.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      logger.error('Error getting all cache entries:', error);
      return [];
    }
  }
}
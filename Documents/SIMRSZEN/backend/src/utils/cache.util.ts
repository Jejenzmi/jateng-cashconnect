import redis from 'redis';
import { logger } from './logger.util';

// Inisialisasi Redis client
let redisClient: redis.RedisClientType | null = null;

// Fungsi untuk menginisialisasi Redis client
export const initRedisClient = (): void => {
  try {
    // Gunakan URL Redis dari environment variable atau default ke localhost
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisUrl
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redisClient.connect();
  } catch (error) {
    logger.error('Error initializing Redis client:', error);
  }
};

// Fungsi untuk mendapatkan data dari cache
export const getFromCache = async (key: string): Promise<string | null> => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
    return null;
  }

  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    logger.error(`Error getting from cache for key ${key}:`, error);
    return null;
  }
};

// Fungsi untuk menyimpan data ke cache
export const setToCache = async (key: string, value: string, expirationSeconds: number = 3600): Promise<boolean> => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
    return false;
  }

  try {
    await redisClient.setEx(key, expirationSeconds, value);
    return true;
  } catch (error) {
    logger.error(`Error setting to cache for key ${key}:`, error);
    return false;
  }
};

// Fungsi untuk menghapus data dari cache
export const deleteFromCache = async (key: string): Promise<boolean> => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Error deleting from cache for key ${key}:`, error);
    return false;
  }
};

// Fungsi untuk menghapus beberapa key dari cache berdasarkan pattern
export const deletePatternFromCache = async (pattern: string): Promise<number> => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
    return 0;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      return keys.length;
    }
    return 0;
  } catch (error) {
    logger.error(`Error deleting pattern from cache for pattern ${pattern}:`, error);
    return 0;
  }
};

// Fungsi untuk mengecek apakah key ada di cache
export const existsInCache = async (key: string): Promise<boolean> => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
    return false;
  }

  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Error checking existence in cache for key ${key}:`, error);
    return false;
  }
};
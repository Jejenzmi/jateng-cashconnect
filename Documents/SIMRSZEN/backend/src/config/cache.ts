import redis from 'redis';
import { logger } from '../utils/logger';

// Initialize Redis client
let redisClient: redis.RedisClientType<any, any> | null = null;

// Check if Redis is enabled
const isRedisEnabled = process.env.REDIS_URL ? true : false;

if (isRedisEnabled) {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', { error: err });
    });

    redisClient.connect();

    logger.info('Redis client connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', { error: (error as Error).message });
    redisClient = null;
  }
} else {
  logger.warn('Redis URL not provided, caching disabled');
}

// Default TTL in seconds (1 hour)
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600');

/**
 * Get value from cache
 */
export const getCache = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;

  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    logger.error('Cache GET error:', { error: (error as Error).message, key });
    return null;
  }
};

/**
 * Set value in cache
 */
export const setCache = async (key: string, value: string, ttl: number = DEFAULT_TTL): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.setEx(key, ttl, value);
    return true;
  } catch (error) {
    logger.error('Cache SET error:', { error: (error as Error).message, key });
    return false;
  }
};

/**
 * Delete value from cache
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Cache DELETE error:', { error: (error as Error).message, key });
    return false;
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    logger.error('Cache CLEAR error:', { error: (error as Error).message });
    return false;
  }
};

/**
 * Generate cache key from endpoint and params
 */
export const generateCacheKey = (endpoint: string, params: Record<string, any>): string => {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return `${endpoint}?${paramString}`;
};

export default redisClient;
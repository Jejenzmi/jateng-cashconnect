import { createClient, RedisClientType } from 'redis';
import logger from './logger';

let redisClient: RedisClientType | null = null;

// Initialize Redis client
export const initializeRedis = async (): Promise<void> => {
  try {
    // Use environment variable for Redis URL or default to local instance
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', { error: err });
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });

    await redisClient.connect();
    logger.info('Redis client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Redis client', { error: (error as Error).message });
    redisClient = null;
  }
};

// Get value from cache
export const getFromCache = async (key: string): Promise<string | null> => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not initialized, skipping cache retrieval', { key });
      return null;
    }

    const value = await redisClient.get(key);
    if (value) {
      logger.debug('Cache hit', { key });
    } else {
      logger.debug('Cache miss', { key });
    }
    return value;
  } catch (error) {
    logger.error('Error getting value from cache', { error: (error as Error).message, key });
    return null;
  }
};

// Set value in cache
export const setToCache = async (key: string, value: string, ttlInSeconds?: number): Promise<boolean> => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not initialized, skipping cache set', { key });
      return false;
    }

    if (ttlInSeconds) {
      await redisClient.setEx(key, ttlInSeconds, value);
    } else {
      await redisClient.set(key, value);
    }

    logger.debug('Value cached successfully', { key, ttl: ttlInSeconds });
    return true;
  } catch (error) {
    logger.error('Error setting value to cache', { error: (error as Error).message, key });
    return false;
  }
};

// Delete value from cache
export const deleteFromCache = async (key: string): Promise<boolean> => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not initialized, skipping cache deletion', { key });
      return false;
    }

    const deletedCount = await redisClient.del(key);
    logger.debug('Cache deleted', { key, deletedCount });
    return deletedCount > 0;
  } catch (error) {
    logger.error('Error deleting value from cache', { error: (error as Error).message, key });
    return false;
  }
};

// Clear all cache
export const clearCache = async (): Promise<boolean> => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not initialized, skipping cache clear');
      return false;
    }

    await redisClient.flushAll();
    logger.info('Cache cleared successfully');
    return true;
  } catch (error) {
    logger.error('Error clearing cache', { error: (error as Error).message });
    return false;
  }
};

// Check if Redis is connected
export const isRedisConnected = (): boolean => {
  return redisClient !== null && redisClient.isReady;
};

export default redisClient;
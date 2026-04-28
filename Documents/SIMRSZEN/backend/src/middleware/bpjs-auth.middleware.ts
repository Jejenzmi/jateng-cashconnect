import { Request, Response, NextFunction } from 'express';
import { BpjsConfigService } from '../services/bpjs-config.service';
import { BpjsLogService } from '../services/bpjs-log.service';
import { logger } from '../utils/logger.util';

export const validateBpjsConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { configName } = req.params || req.query || req.body;

    if (!configName) {
      return res.status(400).json({
        success: false,
        message: 'Nama konfigurasi BPJS wajib disertakan',
      });
    }

    const config = await BpjsConfigService.getConfigByName(configName);

    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Konfigurasi BPJS dengan nama "${configName}" tidak ditemukan`,
      });
    }

    if (!config.isActive) {
      return res.status(400).json({
        success: false,
        message: `Konfigurasi BPJS dengan nama "${configName}" sedang dinonaktifkan`,
      });
    }

    // Tambahkan config ke objek request agar bisa digunakan di handler berikutnya
    (req as any).bpjsConfig = config;

    next();
  } catch (error) {
    logger.error('Error validating BPJS config:', error);

    // Log error
    await BpjsLogService.createLog({
      serviceType: 'middleware',
      endpoint: req.originalUrl,
      method: req.method,
      requestBody: req.body,
      errorMessage: error.message,
      statusCode: 500,
    });

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memvalidasi konfigurasi BPJS',
    });
  }
};

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key wajib disertakan',
    });
  }

  // Dalam implementasi nyata, Anda akan memverifikasi API key ini
  // Misalnya dengan mencocokkannya dengan database atau konfigurasi
  const validApiKey = process.env.BPJS_API_KEY;

  if (apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key tidak valid',
    });
  }

  next();
};

export const rateLimit = (maxRequests: number, windowMs: number) => {
  const requests: Map<string, { count: number; resetTime: number }> = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowEnd = now + windowMs;

    if (!requests.has(clientId)) {
      requests.set(clientId, { count: 1, resetTime: windowEnd });
      setTimeout(() => requests.delete(clientId), windowMs);
      return next();
    }

    const clientReq = requests.get(clientId)!;

    if (now > clientReq.resetTime) {
      // Reset hitungan setelah window habis
      clientReq.count = 1;
      clientReq.resetTime = windowEnd;
      setTimeout(() => requests.delete(clientId), windowMs);
      return next();
    }

    if (clientReq.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: `Terlalu banyak permintaan dari IP ini, coba lagi dalam ${Math.ceil((clientReq.resetTime - now) / 1000)} detik`,
      });
    }

    clientReq.count++;
    next();
  };
};
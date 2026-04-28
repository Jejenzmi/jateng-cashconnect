import fs from 'fs';
import https from 'https';
import express from 'express';
import { logger } from '../utils/logger';

// Interface untuk konfigurasi SSL
interface SSLConfig {
  enabled: boolean;
  certFile?: string;
  keyFile?: string;
  caFile?: string;
  port: number;
  forceHttps: boolean;
}

// Mendapatkan konfigurasi SSL dari environment variables
export const getSSLConfig = (): SSLConfig => {
  const sslEnabled = process.env.SSL_ENABLED === 'true';
  const certFile = process.env.SSL_CERT_FILE;
  const keyFile = process.env.SSL_KEY_FILE;
  const caFile = process.env.SSL_CA_FILE;
  const port = parseInt(process.env.SSL_PORT || '443');
  const forceHttps = process.env.FORCE_HTTPS === 'true';

  return {
    enabled: sslEnabled,
    certFile,
    keyFile,
    caFile,
    port,
    forceHttps
  };
};

// Middleware untuk memaksa redirect ke HTTPS
export const forceHttps = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV !== 'production') {
    next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
};

// Fungsi untuk membuat server HTTPS
export const createHttpsServer = (app: express.Application) => {
  const sslConfig = getSSLConfig();

  if (!sslConfig.enabled) {
    logger.warn('SSL is disabled. Using HTTP only.');
    return null;
  }

  // Validasi file SSL
  if (!sslConfig.certFile || !sslConfig.keyFile) {
    logger.error('SSL configuration error: certFile and keyFile are required');
    return null;
  }

  if (!fs.existsSync(sslConfig.certFile)) {
    logger.error(`SSL certificate file does not exist: ${sslConfig.certFile}`);
    return null;
  }

  if (!fs.existsSync(sslConfig.keyFile)) {
    logger.error(`SSL key file does not exist: ${sslConfig.keyFile}`);
    return null;
  }

  // Jika CA file disediakan, validasi juga
  if (sslConfig.caFile && !fs.existsSync(sslConfig.caFile)) {
    logger.error(`SSL CA file does not exist: ${sslConfig.caFile}`);
    return null;
  }

  try {
    // Baca file SSL
    const options: https.ServerOptions = {
      cert: fs.readFileSync(sslConfig.certFile),
      key: fs.readFileSync(sslConfig.keyFile),
    };

    if (sslConfig.caFile) {
      options.ca = fs.readFileSync(sslConfig.caFile);
    }

    logger.info('HTTPS server configured successfully');
    return https.createServer(options, app);
  } catch (error) {
    logger.error('Failed to create HTTPS server:', { error: (error as Error).message });
    return null;
  }
};

// Middleware untuk menambahkan header keamanan HTTPS
export const addSecurityHeaders = (app: express.Application) => {
  app.use((req, res, next) => {
    // HSTS header
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Header keamanan lainnya
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  });
};
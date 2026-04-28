import app from './app';
import { logger } from './utils/logger';
import http from 'http';
import { createHttpsServer, getSSLConfig, addSecurityHeaders, forceHttps } from './config/ssl';

const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

// Tambahkan header keamanan
addSecurityHeaders(app);

// Jika force HTTPS diaktifkan, tambahkan middleware
if (getSSLConfig().forceHttps) {
  app.use(forceHttps);
}

// Buat server HTTP
const httpServer = http.createServer(app);

// Coba buat server HTTPS jika diaktifkan
const httpsServer = createHttpsServer(app);

// Event listener untuk HTTP server
httpServer.on('error', (error: NodeJS.ErrnoException) => {
  logger.error('HTTP Server error:', { error: error.message, code: error.code });
  
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Event listener untuk HTTPS server
if (httpsServer) {
  httpsServer.on('error', (error: NodeJS.ErrnoException) => {
    logger.error('HTTPS Server error:', { error: error.message, code: error.code });
    
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof getSSLConfig().port === 'string' ? 
      `Pipe ${getSSLConfig().port}` : 
      `Port ${getSSLConfig().port}`;

    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}

// Mulai server
httpServer.listen(PORT, HOST, () => {
  logger.info(`SIMRS ZEN server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  
  if (getSSLConfig().enabled && httpsServer) {
    const sslPort = getSSLConfig().port;
    httpsServer.listen(sslPort, HOST, () => {
      logger.info(`HTTPS server is running on port ${sslPort}`);
      logger.info(`Secure health check: https://localhost:${sslPort}/health`);
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  
  if (httpsServer) {
    httpsServer.close(() => {
      logger.info('HTTPS server closed');
    });
  }
  
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  
  if (httpsServer) {
    httpsServer.close(() => {
      logger.info('HTTPS server closed');
    });
  }
});
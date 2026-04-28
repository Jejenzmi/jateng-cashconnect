import winston from 'winston';

// Format log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'bpjs-integration' },
  transports: [
    // Log ke file error
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log ke file aplikasi
    new winston.transports.File({ 
      filename: 'logs/app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log ke konsol jika bukan production
    ...(process.env.NODE_ENV !== 'production' 
      ? [new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })] 
      : [])
  ],
});

// Fungsi untuk logging error secara khusus
export const logError = (message: string, error: any) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

// Fungsi untuk logging aktivitas
export const logActivity = (level: string, message: string, meta?: any) => {
  logger.log(level, message, meta);
};
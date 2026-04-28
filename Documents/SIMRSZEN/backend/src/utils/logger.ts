import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { Request } from 'express';

// Define custom log levels for healthcare system
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  audit: 5 // Special level for audit logs
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
  audit: 'blue'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),

  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: format
  }),
  
  new winston.transports.File({
    filename: path.join('logs', 'all.log'),
    format: format
  }),
  
  // Remote logging transport for production
  ...(process.env.NODE_ENV === 'production' ? [
    new winston.transports.Http({
      host: process.env.LOGGING_HOST || 'logs.your-service.com',
      port: parseInt(process.env.LOGGING_PORT || '443'),
      path: process.env.LOGGING_PATH || '/logs',
      ssl: true,
      auth: {
        username: process.env.LOGGING_USERNAME,
        password: process.env.LOGGING_PASSWORD
      }
    })
  ] : [])
];

// Extend Winston logger type to include custom log levels
interface CustomLogger extends winston.Logger {
  audit: (message: any, ...meta: any[]) => CustomLogger;
}

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
}) as CustomLogger;

// Audit logging function
export const logAuditEvent = (
  userId: string,
  action: string,
  module: string,
  req: Request,
  additionalInfo?: Record<string, any>
) => {
  const auditData = {
    userId,
    action,
    module,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.url,
    method: req.method,
    additionalInfo
  };

  logger.audit(auditData);
};

// Performance monitoring function
export const logPerformance = (
  operation: string,
  duration: number,
  additionalInfo?: Record<string, any>
) => {
  const perfData = {
    operation,
    duration,
    timestamp: new Date().toISOString(),
    additionalInfo
  };

  if (duration > 1000) { // Log if operation takes more than 1 second
    logger.warn(perfData);
  } else {
    logger.info(perfData);
  }
};

// Error monitoring function
export const logError = (
  error: Error,
  context?: Record<string, any>
) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  };

  logger.error(errorData);
};

// Initialize log directory if not exists
const logDir = path.join(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
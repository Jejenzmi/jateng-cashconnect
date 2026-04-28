import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Error class untuk berbagai jenis error
export class BadRequestError extends Error implements ApiError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements ApiError {
  statusCode = 403;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error implements ApiError {
  statusCode = 422;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class InternalServerError extends Error implements ApiError {
  statusCode = 500;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class DatabaseError extends Error implements ApiError {
  statusCode = 500;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Global error handler middleware
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
  // Log error
  logger.error(`Error occurred: ${err.stack || err.message}`);

  // Tentukan status code
  const statusCode = err.statusCode || 500;
  
  // Tentukan pesan error
  let message = err.message;
  
  // Untuk produksi, sembunyikan error detail
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  // Kirim response error
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

// Middleware untuk menangani route yang tidak ditemukan
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Unhandled promise rejection handler
export const unhandledRejectionHandler = (reason: any, promise: Promise<any>): void => {
  logger.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
};

// Uncaught exception handler
export const uncaughtExceptionHandler = (error: Error): void => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
};

// Process termination handlers
export const gracefulShutdown = (server: any): void => {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
    });
  });
};
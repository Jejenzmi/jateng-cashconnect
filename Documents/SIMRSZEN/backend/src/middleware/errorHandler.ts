import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: err.stack
  });
  
  // Determine status code based on error type
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error: ' + Object.values(err.errors).map((e: any) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // Duplicate key error
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        statusCode = 409;
        message = 'Data already exists';
        break;
      case 'P2025': // Record not found
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003': // Foreign key constraint violation
        statusCode = 400;
        message = 'Invalid reference';
        break;
      default:
        statusCode = 500;
        message = 'Database error';
    }
  }

  // Sanitize error for client
  const safeError = {
    success: false,
    message: process.env.NODE_ENV === 'production' ? 
      (statusCode === 500 ? 'Something went wrong' : message) : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  res.status(statusCode).json(safeError);
  return; // Ensure all code paths return a value
};

// Catch 404 errors
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  logger.error(`404 Error: ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({ 
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
  return; // Ensure all code paths return a value
};
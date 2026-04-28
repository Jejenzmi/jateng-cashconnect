import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import validator from 'validator';
import xss from 'xss';

// Rate limiting middleware
export const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Security headers middleware
export const securityHeaders = helmet({
  crossOriginEmbedderPolicy: false, // Disable COEP as it's not needed
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://api.simrszen.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
});

// Input validation and sanitization middleware
export function validateAndSanitize(req: Request, _res: Response, next: NextFunction) {
  // Sanitize input parameters
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(validator.escape(req.params[key]));
      }
    }
  }

  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(validator.escape(String(req.query[key])));
      }
    }
  }

  // Sanitize body parameters
  if (req.body) {
    // If body is a string, sanitize it
    if (typeof req.body === 'string') {
      req.body = xss(validator.escape(req.body));
    } 
    // If body is an object, sanitize each property
    else if (typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          // Check if it looks like JSON or a simple string
          if (validator.isJSON(req.body[key])) {
            try {
              // Parse, sanitize, and stringify JSON
              const parsed = JSON.parse(req.body[key]);
              const sanitized = sanitizeObject(parsed);
              req.body[key] = JSON.stringify(sanitized);
            } catch (e) {
              // If JSON parsing fails, treat as plain string
              req.body[key] = xss(validator.escape(req.body[key]));
            }
          } else {
            // Sanitize as plain string
            req.body[key] = xss(validator.escape(req.body[key]));
          }
        } else if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          // Sanitize nested objects
          req.body[key] = sanitizeObject(req.body[key]);
        }
      }
    }
  }

  next();
};

// Helper function to sanitize an object recursively
const sanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => typeof item === 'string' ? xss(validator.escape(item)) : sanitizeObject(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = xss(validator.escape(obj[key]));
      } else {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

// Validation utilities
// Middleware to check if user is authenticated
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    next(); // User is authenticated
  } else {
    next(new Error('Authentication required'));
  }
};

// Middleware to validate specific data types
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  // Password should be at least 8 chars with at least one uppercase, one lowercase, one number and one special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Simple phone number validation
  const phoneRegex = /^[+]?[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

// Generic validation middleware factory
export const createValidator = (field: string, validatorFn: (value: string) => boolean, errorMessage: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body[field]) {
      return next(new Error(`Field ${field} is required`));
    }
    
    if (!validatorFn(req.body[field])) {
      return next(new Error(errorMessage));
    }
    
    next();
  };
};
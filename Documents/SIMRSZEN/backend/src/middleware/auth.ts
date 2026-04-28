import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { logger, logAuditEvent } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Missing authorization token');
      logAuditEvent(
        'anonymous',
        'AUTH_FAILED',
        'MISSING_TOKEN',
        req,
        { error: 'Access token required' }
      );
      
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Check if token is blacklisted
    const blacklistedToken = await db.blacklistedToken.findFirst({
      where: { token }
    });

    if (blacklistedToken) {
      logger.warn('Blacklisted token used', { token });
      logAuditEvent(
        'unknown',
        'AUTH_FAILED',
        'BLACKLISTED_TOKEN',
        req,
        { token }
      );
      
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }

    // Verify token using Promisify to handle the callback
    const verifyToken = (token: string, secret: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
    };

    try {
      const user: any = await verifyToken(token, process.env.JWT_SECRET || 'fallback_secret');

      // Find user in database
      const dbUser = await db.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true
        }
      });

      if (!dbUser || !dbUser.isActive) {
        logger.warn('Inactive or non-existent user attempted access:', { userId: user.userId });
        
        // Log unauthorized access attempt
        logAuditEvent(
          user.userId || 'unknown',
          'ACCESS_DENIED',
          'INACTIVE_USER',
          req,
          { userId: user.userId }
        );
        
        res.status(403).json({ error: 'User account is inactive or does not exist' });
        return;
      }

      req.user = dbUser;
      
      // Log successful authentication
      logAuditEvent(
        dbUser.id,
        'AUTH_SUCCESS',
        'TOKEN_VERIFIED',
        req,
        { userId: dbUser.id, username: dbUser.username }
      );

      next();
    } catch (err: any) {
      logger.error('JWT verification error:', { error: err.message, token: token.substring(0, 10) + '...' });
      
      // Log unauthorized access attempt
      logAuditEvent(
        'unknown',
        'AUTH_FAILED',
        'TOKEN_VERIFICATION',
        req,
        { error: err.message }
      );
      
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
  } catch (error) {
    logger.error('Authentication error:', { error: (error as Error).message });
    
    // Log authentication system failure
    logAuditEvent(
      'system',
      'AUTH_SYSTEM_ERROR',
      'MIDDLEWARE_FAILURE',
      req,
      { error: (error as Error).message }
    );
    
    res.status(500).json({ error: 'Internal server error during authentication' });
    return;
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(403).json({ error: 'User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
      return;
    }

    next();
    return;
  };
};
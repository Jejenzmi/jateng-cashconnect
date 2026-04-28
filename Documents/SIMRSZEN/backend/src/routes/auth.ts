import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Support both email and username login
    const { email, username, password } = req.body;
    const loginId = email || username;

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    // Find user by email first, then by username
    let foundUser = await db.user.findUnique({
      where: { email: loginId }
    }).catch(() => null);
    
    // If not found by email, try username
    if (!foundUser) {
      foundUser = await db.user.findUnique({
        where: { username: loginId }
      }).catch(() => null);
    }

    if (!foundUser || !foundUser.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with proper typing
    const accessToken = jwt.sign(
      { 
        jti: uuidv4(),
        userId: foundUser.id, 
        role: foundUser.role,
        iat: Math.floor(Date.now() / 1000),
        iss: 'simrszen_auth_service',
        aud: 'simrszen_api'
      },
      process.env.JWT_SECRET || 'simrszen_default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        jti: uuidv4(),
        userId: foundUser.id,
        iat: Math.floor(Date.now() / 1000),
        iss: 'simrszen_auth_service',
        aud: 'simrszen_refresh'
      },
      process.env.JWT_SECRET || 'simrszen_default_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Store refresh token in database for revocation tracking (best effort)
    try {
      await db.refreshToken.create({
        data: {
          token: refreshToken,
          userId: foundUser.id,
          expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
          revoked: false
        }
      });
    } catch (e) {
      // RefreshToken table may not exist yet, not critical
      console.warn('Could not store refresh token:', e);
    }

    // Update last login via raw SQL (workaround for schema mismatch)
    try {
      await db.$executeRaw`UPDATE "User" SET "lastLogin" = NOW() WHERE id = ${foundUser.id}`;
    } catch (e) {
      console.warn('Could not update lastLogin:', e);
    }

    // Return user info with token
    const { password: _, ...userWithoutPassword } = foundUser;
    const roles = foundUser.role ? [foundUser.role] : [];
    res.json({
      token: accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Refresh token route
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_SECRET || 'simrszen_default_secret'
      );
    } catch (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Check if refresh token exists and is not revoked
    const refreshTokenRecord = await db.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!refreshTokenRecord || refreshTokenRecord.revoked || !refreshTokenRecord.user.isActive) {
      return res.status(403).json({ error: 'Refresh token is revoked or user is inactive' });
    }

    // Extract and validate userId from token
    const userId = decoded.userId;
    if (!decoded.userId) {
      return res.status(403).json({ error: 'Invalid token: missing user ID' });
    }

    // Check if user still exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        isActive: true,
        role: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens with proper typing
    const newAccessToken = jwt.sign(
      { 
        jti: uuidv4(),
        userId: user.id, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        iss: 'simrszen_auth_service',
        aud: 'simrszen_api'
      },
      process.env.JWT_SECRET || 'simrszen_default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    const newRefreshToken = jwt.sign(
      { 
        jti: uuidv4(),
        userId: user.id,
        iat: Math.floor(Date.now() / 1000),
        iss: 'simrszen_auth_service',
        aud: 'simrszen_refresh'
      },
      process.env.JWT_SECRET || 'simrszen_default_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Update refresh token in database
    await db.refreshToken.update({
      where: { token: refreshToken },
      data: {
        revoked: true,
        revokedAt: new Date()
      }
    });

    // Store new refresh token
    await db.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000)),
        revoked: false
      }
    });

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
  return; // Ensure all code paths return a value
});

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Check if token is in blacklist
    const tokenInBlacklist = await db.blacklistedToken.findUnique({
      where: { token }
    });

    if (tokenInBlacklist) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'simrszen_default_secret'
      );
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true
          }
        },
        modules: {
          select: {
            name: true,
            displayName: true,
            isActive: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'simrszen_default_secret'
      );
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    const { fullName, email } = req.body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        email: email || undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;
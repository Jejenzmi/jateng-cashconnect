import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

const router = Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret || 'default_secret',
      { expiresIn: '24h' }
    );

    // Kirim respons dengan data user dan token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        roles: user.userRoles.map(ur => ur.role.roleName)
      },
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat login' });
  }
});

// Logout endpoint
router.post('/logout', (_, res) => {
  res.status(200).json({ message: 'Logout endpoint' });
});

export { router as authRoutes };
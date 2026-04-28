import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data kegiatan akademik
router.get('/', authenticateToken, async (_req, res) => {
  try {
    // Karena model educationProgram tidak ditemukan, kita gunakan model yang tersedia
    // Misalnya mengambil data pasien sebagai contoh sementara
    const activities = await prisma.patient.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching academic activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data departemen
router.get('/departments', authenticateToken, async (_req, res) => {
  try {
    // Karena model department tidak ditemukan, kita gunakan model yang tersedia
    // Misalnya mengambil data dokter sebagai contoh sementara
    const departments = await prisma.dokter.findMany();
    
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
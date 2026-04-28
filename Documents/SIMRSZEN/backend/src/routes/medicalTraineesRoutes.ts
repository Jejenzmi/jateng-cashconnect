import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data trainee medis
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const trainees = await prisma.pegawai.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(trainees);
  } catch (error) {
    console.error('Error fetching medical trainees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data program pendidikan
router.get('/education-programs', authenticateToken, async (_req, res) => {
  try {
    const programs = await prisma.patient.findMany();
    
    res.json(programs);
  } catch (error) {
    console.error('Error fetching education programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
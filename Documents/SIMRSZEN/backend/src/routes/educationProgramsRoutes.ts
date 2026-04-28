import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data program pendidikan
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const programs = await prisma.patient.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(programs);
  } catch (error) {
    console.error('Error fetching education programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
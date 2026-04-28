import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data rotasi klinis
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const rotations = await prisma.patient.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(rotations);
  } catch (error) {
    console.error('Error fetching clinical rotations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data trainee medis
router.get('/medical-trainees', authenticateToken, async (_req, res) => {
  try {
    const trainees = await prisma.pegawai.findMany();
    
    res.json(trainees);
  } catch (error) {
    console.error('Error fetching medical trainees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data departemen
router.get('/departments', authenticateToken, async (_req, res) => {
  try {
    const departments = await prisma.dokter.findMany();
    
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data proyek penelitian
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const projects = await prisma.patient.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching research projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data dokter
router.get('/doctors', authenticateToken, async (_req, res) => {
  try {
    const doctors = await prisma.dokter.findMany();
    
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil data departemen
router.get('/departments', authenticateToken, async (_req, res) => {
  try {
    const departments = await prisma.pegawai.findMany();
    
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
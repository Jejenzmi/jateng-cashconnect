import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil statistik dashboard
router.get('/', authenticateToken, async (_req, res) => {
  try {
    // Ambil beberapa data statistik sederhana
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.dokter.count();
    const visitCount = await prisma.visit.count();
    
    const stats = {
      totalPatients: patientCount,
      totalDoctors: doctorCount,
      totalVisits: visitCount,
      timestamp: new Date()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil aktivitas terbaru
router.get('/recent-activities', authenticateToken, async (_req, res) => {
  try {
    const recentVisits = await prisma.visit.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        patient: {
          select: {
            nama: true
          }
        },
        dokter: {
          select: {
            nama: true
          }
        }
      }
    });
    
    res.json(recentVisits);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
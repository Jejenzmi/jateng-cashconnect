import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data rekam medis
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      include: {
        patient: {
          select: {
            nama: true,
            patientId: true
          }
        },
        dokter: {
          select: {
            nama: true
          }
        },
        visit: {
          select: {
            visitId: true,
            tanggalPeriksa: true
          }
        }
      },
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengambil statistik rekam medis
router.get('/stats', authenticateToken, async (_req, res) => {
  try {
    const totalRecords = await prisma.medicalRecord.count();
    
    // Hitung rekam medis hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = await prisma.medicalRecord.count({
      where: {
        createdAt: {
          gte: today,
        }
      }
    });
    
    // Hitung dokter aktif (dokter yang memiliki rekam medis dalam 30 hari terakhir)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeDoctors = await prisma.medicalRecord.groupBy({
      by: ['dokterId'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        }
      }
    });
    
    // Nilai compliance ICD-10 sementara (harus diimplementasikan sesuai kebijakan rumah sakit)
    const icdCompliance = 95; // nilai contoh
    
    res.json({
      totalRecords,
      todayRecords,
      activeDoctors: activeDoctors.length,
      icdCompliance
    });
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
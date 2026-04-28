import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil data billing
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        generalLedgers: {
          include: {
            account: true
          }
        }
      },
      take: 100,
      orderBy: {
        transactionDate: 'desc'
      }
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
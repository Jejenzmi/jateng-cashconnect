import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Health check endpoint
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'OK'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Ready check endpoint
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if critical services are available
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'READY',
      message: 'Application is ready to serve traffic'
    });
  } catch (error) {
    res.status(503).json({
      status: 'NOT_READY',
      message: 'Application is not ready to serve traffic'
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
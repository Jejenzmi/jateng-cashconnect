import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint untuk mengambil akses menu berdasarkan userId
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    // Menggunakan relasi antara User -> UserRole -> Role -> RolePermission -> ModulePermission
    const userRolePermissions = await prisma.userRole.findMany({
      where: {
        userId: String(userId)
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                modulePermission: true
              }
            }
          }
        }
      }
    });
    
    res.json(userRolePermissions);
  } catch (error) {
    console.error('Error fetching menu access:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
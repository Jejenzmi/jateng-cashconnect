import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Ekstensi untuk menambahkan properti user ke objek Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint umum untuk berbagai keperluan
router.get('/generic-api', async (req, res) => {
  const table = req.query.table as string;
  
  // Jika ini adalah permintaan untuk hospital_profile, kita izinkan tanpa otentikasi
  if (table === 'hospital_profile') {
    try {
      // Coba dulu cari di FaskesProfile (model utama untuk profil faskes)
      const faskesResult = await prisma.faskesProfile.findMany();
      if (faskesResult.length > 0) {
        // Jika ada data di FaskesProfile, kembalikan sebagai hospital_profile
        res.json(faskesResult);
      } else {
        // Jika tidak ada di FaskesProfile, coba cari di HospitalProfile
        const hospitalResult = await prisma.hospitalProfile.findMany();
        res.json(hospitalResult);
      }
    } catch (error) {
      console.error('Error accessing hospital_profile:', error);
      res.status(500).json({ error: 'Failed to access hospital profile data' });
    }
  } else {
    // Untuk endpoint lainnya, periksa otentikasi
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    try {
      // Verifikasi token
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; email: string; iat?: number; exp?: number };
      req.user = decoded;

      // Jika token valid, lanjutkan ke handler
      // Kita harus menangani setiap model secara eksplisit
      let result: any;
      switch(table) {
        case 'faskes_profile':
        case 'faskesProfile':
        case 'hospital_profile':  // tambahkan case ini untuk kompatibilitas
          // Gabungkan data dari kedua model jika ada
          const faskesResult = await prisma.faskesProfile.findMany();
          if (faskesResult.length > 0) {
            res.json(faskesResult);
            return;
          }
          result = await prisma.hospitalProfile.findMany();
          break;
        case 'modules':
          result = await prisma.module.findMany();
          break;
        // Tambahkan case lain sesuai kebutuhan
        default:
          return res.status(400).json({ error: `Model ${table} tidak ditemukan` });
      }
      res.json(result);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }
});

// Menangani POST request untuk generic-api
router.post('/generic-api', async (req, res) => {
  const { table, data } = req.body;
  
  // Hanya izinkan operasi pada tabel hospital_profile tanpa otentikasi
  if (table === 'hospital_profile') {
    try {
      // Periksa apakah FaskesProfile sudah ada (harus hanya satu)
      const existingFaskesProfile = await prisma.faskesProfile.count();
      
      if (existingFaskesProfile > 0) {
        return res.status(409).json({ 
          error: 'FaskesProfile sudah ada. Gunakan PUT untuk memperbarui.' 
        });
      }
      
      // Insert data ke tabel FaskesProfile karena model hospital_profile tidak ada
      const result = await prisma.faskesProfile.create({
        data: {
          name: data.hospital_name,
          type: data.hospital_type,
          address: data.address,
          city: data.city,
          province: data.province,
          phone: data.phone,
          email: data.email,
          licenseNumber: data.organization_id || '',
          operationalSince: data.operational_since ? new Date(data.operational_since) : new Date(),
          capacity: data.bed_count_total || 0,
          director: data.director_name || '',
          bpjsConfig: {} // Use empty object instead of null
        }
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error inserting hospital_profile:', error);
      res.status(500).json({ error: 'Failed to insert hospital profile data' });
    }
  } else {
    // Untuk tabel lain, tetap memerlukan otentikasi
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    try {
      // Verify token secara manual
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
      jwt.verify(token, JWT_SECRET);
      
      // Jika token valid, lanjutkan dengan operasi
      let result: any;
      
      if (table && data) {
        // Gunakan Prisma untuk menginsert data ke tabel yang dimaksud
        switch(table) {
          case 'modules':
            result = await prisma.module.create({ data });
            break;
          case 'faskesProfile':
          case 'faskes_profile':
            result = await prisma.faskesProfile.create({ data });
            break;
          case 'hospital_profile':
            result = await prisma.hospitalProfile.create({ data });
            break;
          default:
            // Jika tabel tidak dikenali, kembalikan pesan kesalahan
            return res.status(400).json({ 
              error: `Table ${table} not recognized` 
            });
        }
      }
      
      res.json(result);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }
});

// Menangani PUT request untuk generic-api
router.put('/generic-api', async (req, res) => {
  const { table, id, data } = req.body;
  
  // Hanya izinkan operasi pada tabel hospital_profile tanpa otentikasi
  if (table === 'hospital_profile' && id) {
    try {
      // Cek apakah record dengan ID tersebut ada
      const existingRecord = await prisma.faskesProfile.findUnique({
        where: { id }
      });
      
      if (!existingRecord) {
        return res.status(404).json({ 
          error: 'Hospital profile not found' 
        });
      }
      
      // Update data di tabel faskesProfile
      const result = await prisma.faskesProfile.update({
        where: { id },
        data: {
          name: data.hospital_name,
          type: data.hospital_type,
          address: data.address,
          city: data.city,
          province: data.province,
          phone: data.phone,
          email: data.email,
          licenseNumber: data.organization_id || '',
          operationalSince: data.operational_since ? new Date(data.operational_since) : new Date(),
          capacity: data.bed_count_total || 0,
          director: data.director_name || '',
          bpjsConfig: data.bpjs_config || {}, // Use empty object if null
          updatedAt: new Date()
        }
      });

      res.json(result);
    } catch (error) {
      console.error('Error updating hospital_profile:', error);
      res.status(500).json({ error: 'Failed to update hospital profile data' });
    }
  } else {
    // Untuk tabel lain, tetap memerlukan otentikasi
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    try {
      // Verify token secara manual
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
      jwt.verify(token, JWT_SECRET);
      
      // Jika token valid, lanjutkan dengan operasi
      let result: any;
      
      if (table && id && data) {
        // Gunakan Prisma untuk mengupdate data di tabel yang dimaksud
        switch(table) {
          case 'modules':
            result = await prisma.module.update({
              where: { id },
              data
            });
            break;
          case 'faskesProfile':
          case 'faskes_profile':
            result = await prisma.faskesProfile.update({
              where: { id },
              data
            });
            break;
          default:
            // Jika tabel tidak dikenali, kembalikan pesan kesalahan
            return res.status(400).json({ 
              error: `Table ${table} not recognized` 
            });
        }
      }
      
      res.json(result);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }
});

// Endpoint untuk pasien
router.get('/patients', authenticateToken, async (_req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk dokter
router.get('/doctors', authenticateToken, async (_req, res) => {
  try {
    const doctors = await prisma.dokter.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        nama: 'asc'
      }
    });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk rawat jalan
router.get('/outpatient-visits', authenticateToken, async (_req, res) => {
  try {
    const visits = await prisma.visit.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(visits);
  } catch (error) {
    console.error('Error fetching outpatient visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk inventaris
router.get('/inventory', authenticateToken, async (_req, res) => {
  try {
    const inventory = await prisma.item.findMany({
      orderBy: {
        stok: 'asc'
      }
    });
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk billing
router.get('/billings', authenticateToken, async (_req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        generalLedgers: {
          include: {
            account: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Menangani query SQL unsafe (untuk keperluan internal, hanya boleh diakses oleh admin)
router.post('/unsafe-query', authenticateToken, async (req, res) => {
  // Verifikasi bahwa pengguna adalah admin
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  const { PrismaClient } = require('@prisma/client');
  const client = new PrismaClient();
  
  try {
    // Verify token
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Cek apakah pengguna memiliki role admin melalui relasi UserRole dan Role
    const userWithRoles = await client.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
    
    // Periksa apakah salah satu role pengguna adalah admin
    const isAdmin = userWithRoles?.userRoles.some(
      userRole => userRole.role.roleName.toLowerCase() === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admin users can execute unsafe queries'
      });
    }
    
    // Eksekusi query SQL yang diberikan
    const { query } = req.body;
    
    // Validasi dasar terhadap query untuk mencegah perintah berbahaya
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Invalid query provided'
      });
    }
    
    // Hanya izinkan perintah SELECT untuk mencegah modifikasi data
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      return res.status(400).json({
        error: 'Only SELECT queries are allowed'
      });
    }
    
    // Eksekusi query
    const result = await client.$queryRawUnsafe(query);
    
    res.json(result);
  } catch (error) {
    console.error('Error executing unsafe query:', error);
    res.status(500).json({ error: 'Failed to execute unsafe query' });
  } finally {
    await client.$disconnect();
  }
});

// Endpoint untuk dashboard stats
router.get('/dashboard', authenticateToken, async (_req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const client = new PrismaClient();
  
  try {
    // Ambil data statistik untuk dashboard
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);
    
    // Count all patients
    const totalPatients = await client.patient.count();
    
    // Count visits for today
    const totalAppointments = await client.visit.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow
        }
      }
    });
    
    // Hitung total pendapatan hari ini berdasarkan totalBiaya di tabel visit
    const totalRevenue = await client.visit.aggregate({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow
        }
      },
      _sum: {
        totalBiaya: true
      }
    });
    
    // Hitung tugas yang tertunda (visits scheduled for today but not marked as complete)
    const pendingTasks = await client.visit.count({
      where: {
        createdAt: {
          lte: new Date()
        },
        statusKunjungan: {
          not: 'completed'  // assuming 'completed' means finished
        }
      }
    });
    
    // Ambil 5 kunjungan terbaru
    const recentAppointments = await client.visit.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow
        }
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    // Ambil data pendapatan 7 hari terakhir
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const revenueData = await client.visit.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _sum: {
        totalBiaya: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    res.json({
      stats: {
        total_patients: totalPatients,
        total_appointments: totalAppointments,
        total_revenue: totalRevenue._sum.totalBiaya || 0,
        pending_tasks: pendingTasks
      },
      appointments: recentAppointments,
      revenueData: revenueData.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        revenue: item._sum.totalBiaya || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard data',
      details: error.message 
    });
  } finally {
    await client.$disconnect();
  }
});

export default router;
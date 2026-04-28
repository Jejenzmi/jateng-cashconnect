import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all modules
router.get('/', authenticateToken, async (req, res) => {
  try {
    const modules = await db.module.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get available modules based on faskes type
router.get('/available', authenticateToken, async (req, res) => {
  try {
    // Get the hospital profile to determine faskes type
    const profile = await db.hospitalProfile.findFirst({
      where: { isActive: true },
      select: { faskesType: true }
    });

    if (!profile) {
      return res.status(400).json({ error: 'Hospital profile not configured' });
    }

    // Define modules based on faskes type
    let availableModules: Array<{
      name: string;
      displayName: string;
      description: string;
      forFaskesTypes: string[];
      isActive: boolean;
    }>;

    switch (profile.faskesType) {
      case 'RUMAH_SAKIT':
        availableModules = [
          { name: 'dashboard', displayName: 'Dashboard', description: 'Dashboard utama SIMRS', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'patients', displayName: 'Pasien', description: 'Manajemen data pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'appointments', displayName: 'Janji Temu', description: 'Manajemen janji temu pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'medical-records', displayName: 'Rekam Medis', description: 'Rekam medis pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'pharmacy', displayName: 'Farmasi', description: 'Manajemen apotek dan obat', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'laboratory', displayName: 'Laboratorium', description: 'Pemeriksaan laboratorium', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'radiology', displayName: 'Radiologi', description: 'Pemeriksaan radiologi', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'inpatient', displayName: 'Rawat Inap', description: 'Manajemen rawat inap', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'outpatient', displayName: 'Rawat Jalan', description: 'Manajemen rawat jalan', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'emergency', displayName: 'IGD', description: 'Manajemen instalasi gawat darurat', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'icu', displayName: 'ICU', description: 'Manajemen unit perawatan intensif', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'billing', displayName: 'Penagihan', description: 'Manajemen biaya dan pembayaran', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'inventory', displayName: 'Inventaris', description: 'Manajemen inventaris rumah sakit', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'human-resources', displayName: 'SDM', description: 'Manajemen sumber daya manusia', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'vclaim', displayName: 'VClaim BPJS', description: 'Integrasi VClaim BPJS', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'mcu', displayName: 'MCU', description: 'Medical Check Up', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK'], isActive: true },
          { name: 'nutrition', displayName: 'Gizi Klinis', description: 'Manajemen gizi klinis', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'rehabilitation', displayName: 'Rehab Medik', description: 'Manajemen rehabilitasi medik', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK'], isActive: true },
          { name: 'spiritual-care', displayName: 'Pelayanan Rohani', description: 'Manajemen pelayanan rohani', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'clinical-psychology', displayName: 'Psikologi Klinis', description: 'Manajemen psikologi klinis', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK'], isActive: true },
          { name: 'blood-bank', displayName: 'Bank Darah', description: 'Manajemen bank darah', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'forensic', displayName: 'Forensik', description: 'Manajemen forensik medis', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'dialysis', displayName: 'Dialisis', description: 'Manajemen hemodialisis', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'cssd', displayName: 'CSSD', description: 'Central Sterile Supply Department', forFaskesTypes: ['RUMAH_SAKIT'], isActive: true },
          { name: 'accounting', displayName: 'Akuntansi', description: 'Manajemen akuntansi', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'purchasing', displayName: 'Purchasing', description: 'Manajemen pembelian', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
        ];
        break;
      case 'KLINIK':
      case 'PUSKESMAS':
        availableModules = [
          { name: 'dashboard', displayName: 'Dashboard', description: 'Dashboard utama SIMRS', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'patients', displayName: 'Pasien', description: 'Manajemen data pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'appointments', displayName: 'Janji Temu', description: 'Manajemen janji temu pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'medical-records', displayName: 'Rekam Medis', description: 'Rekam medis pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'pharmacy', displayName: 'Farmasi', description: 'Manajemen apotek dan obat', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'laboratory', displayName: 'Laboratorium', description: 'Pemeriksaan laboratorium', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'radiology', displayName: 'Radiologi', description: 'Pemeriksaan radiologi', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'outpatient', displayName: 'Rawat Jalan', description: 'Manajemen rawat jalan', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'billing', displayName: 'Penagihan', description: 'Manajemen biaya dan pembayaran', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'inventory', displayName: 'Inventaris', description: 'Manajemen inventaris', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'pcare', displayName: 'PCare BPJS', description: 'Integrasi PCare BPJS', forFaskesTypes: ['KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'immunization', displayName: 'Imunisasi', description: 'Manajemen program imunisasi', forFaskesTypes: ['KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'kia', displayName: 'Kartu Ibu Anak', description: 'Manajemen kartu ibu dan anak', forFaskesTypes: ['KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'nutrition', displayName: 'Gizi Klinis', description: 'Manajemen gizi klinis', forFaskesTypes: ['KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'rehabilitation', displayName: 'Rehab Medik', description: 'Manajemen rehabilitasi medik', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK'], isActive: true },
          { name: 'clinical-psychology', displayName: 'Psikologi Klinis', description: 'Manajemen psikologi klinis', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK'], isActive: true },
          { name: 'accounting', displayName: 'Akuntansi', description: 'Manajemen akuntansi', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
        ];
        break;
      default:
        availableModules = [
          { name: 'dashboard', displayName: 'Dashboard', description: 'Dashboard utama SIMRS', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'patients', displayName: 'Pasien', description: 'Manajemen data pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'appointments', displayName: 'Janji Temu', description: 'Manajemen janji temu pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'medical-records', displayName: 'Rekam Medis', description: 'Rekam medis pasien', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'pharmacy', displayName: 'Farmasi', description: 'Manajemen apotek dan obat', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
          { name: 'billing', displayName: 'Penagihan', description: 'Manajemen biaya dan pembayaran', forFaskesTypes: ['RUMAH_SAKIT', 'KLINIK', 'PUSKESMAS'], isActive: true },
        ];
        break;
    }

    res.json(availableModules);
  } catch (error) {
    console.error('Error fetching available modules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Toggle module activation
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { moduleName, activate } = req.body;

    if (!moduleName) {
      return res.status(400).json({ error: 'Module name is required' });
    }

    // Check if user has admin role to modify modules
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'simrszen_default_secret'
    ) as { userId: string; iat: number; exp: number };

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admin can modify modules' });
    }

    // Find or create the module record
    let module = await db.module.findUnique({
      where: { name: moduleName }
    });

    if (!module) {
      // Create the module if it doesn't exist
      module = await db.module.create({
        data: {
          name: moduleName,
          displayName: moduleName.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          isActive: !!activate,
          sortOrder: 999
        }
      });
    } else {
      // Update the module activation status
      module = await db.module.update({
        where: { id: module.id },
        data: { isActive: !!activate }
      });
    }

    res.json({
      message: `Module ${moduleName} ${activate ? 'activated' : 'deactivated'} successfully`,
      module
    });
  } catch (error) {
    console.error('Error toggling module:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupDefaultModules() {
  try {
    // Cek apakah modul sudah ada
    const moduleCount = await prisma.module.count();
    
    if (moduleCount > 0) {
      console.log('Modul-modul sudah ada, melewati inisialisasi.');
      return;
    }

    // Daftar modul standar SIMRS ZEN
    const defaultModules = [
      {
        moduleCode: 'PATIENT_MGMT',
        moduleName: 'Manajemen Pasien',
        description: 'Modul untuk mengelola data pasien',
        isActive: true
      },
      {
        moduleCode: 'MEDICAL_RECORD',
        moduleName: 'Rekam Medis',
        description: 'Modul untuk mengelola rekam medis pasien',
        isActive: true
      },
      {
        moduleCode: 'APPOINTMENTS',
        moduleName: 'Pendaftaran & Janji Temu',
        description: 'Modul untuk pendaftaran dan pengaturan janji temu',
        isActive: true
      },
      {
        moduleCode: 'PHARMACY',
        moduleName: 'Farmasi',
        description: 'Modul untuk manajemen farmasi dan obat',
        isActive: true
      },
      {
        moduleCode: 'LABORATORY',
        moduleName: 'Laboratorium',
        description: 'Modul untuk manajemen pemeriksaan laboratorium',
        isActive: true
      },
      {
        moduleCode: 'RADIOLOGY',
        moduleName: 'Radiologi',
        description: 'Modul untuk manajemen pemeriksaan radiologi',
        isActive: true
      },
      {
        moduleCode: 'BILLING',
        moduleName: 'Penagihan & Keuangan',
        description: 'Modul untuk penagihan dan keuangan',
        isActive: true
      },
      {
        moduleCode: 'INVENTORY',
        moduleName: 'Inventaris',
        description: 'Modul untuk manajemen inventaris',
        isActive: true
      },
      {
        moduleCode: 'HR',
        moduleName: 'SDM',
        description: 'Modul untuk manajemen sumber daya manusia',
        isActive: true
      },
      {
        moduleCode: 'REPORTS',
        moduleName: 'Laporan',
        description: 'Modul untuk laporan-laporan rumah sakit',
        isActive: true
      }
    ];

    // Membuat modul-modul standar
    for (const module of defaultModules) {
      await prisma.module.create({
        data: module
      });
    }

    console.log(`${defaultModules.length} modul standar berhasil dibuat.`);
  } catch (error) {
    console.error('Gagal menginisialisasi modul standar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDefaultModules();
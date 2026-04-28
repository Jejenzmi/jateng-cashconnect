import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupFaskesModuleConfig() {
  try {
    // Ambil semua modul yang ada
    const modules = await prisma.module.findMany();
    
    // Ambil semua tipe faskes yang ada (atau buat default jika belum ada)
    let faskesTypes = await prisma.faskesType.findMany();
    
    if (faskesTypes.length === 0) {
      // Buat tipe faskes default
      await prisma.faskesType.create({
        data: {
          name: 'Rumah Sakit Umum',
          description: 'Rumah Sakit dengan pelayanan umum',
          level: 'Tingkat II',
          category: 'Swasta',
          isActive: true
        }
      });
      
      await prisma.faskesType.create({
        data: {
          name: 'Rumah Sakit Khusus',
          description: 'Rumah Sakit dengan pelayanan khusus',
          level: 'Tingkat III',
          category: 'Swasta',
          isActive: true
        }
      });
      
      faskesTypes = await prisma.faskesType.findMany();
    }
    
    // Untuk setiap kombinasi tipe faskes dan modul, buat konfigurasi default
    for (const faskesType of faskesTypes) {
      for (const module of modules) {
        // Cek apakah konfigurasi sudah ada
        const existingConfig = await prisma.faskesModuleConfig.findFirst({
          where: {
            faskesTypeId: faskesType.id,
            moduleId: module.id
          }
        });
        
        if (!existingConfig) {
          await prisma.faskesModuleConfig.create({
            data: {
              faskesTypeId: faskesType.id,
              moduleId: module.id,
              isEnabled: true
            }
          });
          
          console.log(`Konfigurasi dibuat: ${module.moduleName} untuk ${faskesType.name}`);
        }
      }
    }

    console.log('Konfigurasi modul faskes berhasil disiapkan.');
  } catch (error) {
    console.error('Gagal menginisialisasi konfigurasi modul faskes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupFaskesModuleConfig();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSetupStatus() {
  try {
    // Cek apakah tabel hospital_profile sudah memiliki data
    const hospitalProfiles = await prisma.faskesProfile.count();
    
    console.log('Jumlah data di tabel FaskesProfile:', hospitalProfiles);
    
    if (hospitalProfiles > 0) {
      console.log('Status: Setup sudah selesai');
      const profile = await prisma.faskesProfile.findFirst();
      console.log('Data profil faskes:', JSON.stringify(profile, null, 2));
    } else {
      console.log('Status: Setup belum selesai');
    }
  } catch (error) {
    console.error('Error saat mengecek status setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSetupStatus();
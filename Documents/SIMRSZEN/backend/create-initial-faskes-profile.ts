import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createInitialFaskesProfile() {
  try {
    // Cek apakah sudah ada profil faskes
    const existingProfile = await prisma.faskesProfile.findFirst();
    
    if (existingProfile) {
      console.log('Profil faskes sudah ada!');
      console.log('ID:', existingProfile.id);
      console.log('Nama:', existingProfile.name);
      return;
    }
    
    // Membuat profil faskes awal
    const initialProfile = await prisma.faskesProfile.create({
      data: {
        name: 'SIMRS ZEN - Rumah Sakit Pengujian',
        type: 'Rumah Sakit Umum',
        address: 'Jl. Raya Kesehatan No. 1, Kota Medis, Indonesia',
        city: 'Kota Medis',
        province: 'Jawa Barat',
        phone: '+622112345678',
        email: 'info@simrszen.local',
        licenseNumber: 'LS-001/SIMRS/2025',
        operationalSince: new Date('2020-01-01'),
        capacity: 100,
        director: 'Dr. Administrator Utama, Sp.A',
        bpjsConfig: {
          consId: '1234567890',
          secret: '0987654321',
          userKey: 'user_key_bpjs',
          ppkCode: '0001',
          ppkRujukanCode: '0001',
          userName: 'admin_bpjs'
        }
      }
    });
    
    console.log('Profil faskes awal berhasil dibuat!');
    console.log('ID:', initialProfile.id);
    console.log('Nama:', initialProfile.name);
    console.log('Email:', initialProfile.email);
  } catch (error) {
    console.error('Gagal membuat profil faskes awal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialFaskesProfile();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@simrszen.local' }
    });

    if (existingAdmin) {
      console.log('Akun admin sudah ada!');
      console.log('- ID: ' + existingAdmin.id);
      console.log('- Email: ' + existingAdmin.email);
      console.log('- NIP: ' + (existingAdmin.nip || 'N/A'));
      return;
    }

    // Buat data pegawai terlebih dahulu
    const adminPegawai = await prisma.pegawai.create({
      data: {
        nip: 'ADM001',
        nama: 'Administrator',
        jenisKelamin: 'Laki-laki',
        tempatLahir: 'Jakarta',
        tanggalLahir: new Date(),
        alamat: 'Alamat Administrator',
        noHp: '081234567890',
        email: 'admin@simrszen.local',
        status: 'Aktif'
      }
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@simrszen.local',
        password: hashedPassword,
        fullName: 'Administrator',
        isActive: true,
        nip: 'ADM001'
      }
    });

    console.log('Akun admin berhasil dibuat:');
    console.log('- ID: ' + adminUser.id);
    console.log('- Email: ' + adminUser.email);
    console.log('- Password: admin123');
    console.log('- NIP: ' + adminUser.nip);
    console.log('- Pegawai ID: ' + adminPegawai.id);
  } catch (error) {
    console.error('Gagal membuat akun admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
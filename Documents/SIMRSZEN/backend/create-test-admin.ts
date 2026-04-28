import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestAdminUser() {
  try {
    // Cek apakah user dengan email ini sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test.admin@simrszen.local' }
    });

    if (existingUser) {
      console.log('Akun dengan email test.admin@simrszen.local sudah ada!');
      console.log('Menghapus akun yang sudah ada...');
      await prisma.user.delete({
        where: { email: 'test.admin@simrszen.local' }
      });
    }

    // Buat data pegawai terlebih dahulu
    const testAdminPegawai = await prisma.pegawai.create({
      data: {
        nip: 'TEST001',
        nama: 'Test Administrator',
        jenisKelamin: 'Laki-laki',
        tempatLahir: 'Jakarta',
        tanggalLahir: new Date(),
        alamat: 'Alamat Test Administrator',
        noHp: '081234567891',
        email: 'test.admin@simrszen.local',
        status: 'Aktif'
      }
    });

    const hashedPassword = await bcrypt.hash('testadmin123', 10);
    
    const testAdminUser = await prisma.user.create({
      data: {
        email: 'test.admin@simrszen.local',
        password: hashedPassword,
        fullName: 'Test Administrator',
        isActive: true,
        nip: 'TEST001'
      }
    });

    console.log('Akun admin uji berhasil dibuat:');
    console.log('- ID: ' + testAdminUser.id);
    console.log('- Email: ' + testAdminUser.email);
    console.log('- Password: testadmin123');
    console.log('- NIP: ' + testAdminUser.nip);
    console.log('- Pegawai ID: ' + testAdminPegawai.id);
    console.log('');
    console.log('Silakan gunakan kredensial berikut untuk login:');
    console.log('Email: test.admin@simrszen.local');
    console.log('Password: testadmin123');
  } catch (error) {
    console.error('Gagal membuat akun admin uji:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdminUser();
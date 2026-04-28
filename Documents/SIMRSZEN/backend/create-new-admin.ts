import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createNewAdminUser() {
  try {
    // Cek apakah user dengan email ini sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin.new@simrszen.local' }
    });

    if (existingUser) {
      console.log('Akun dengan email admin.new@simrszen.local sudah ada!');
      console.log('Menghapus akun yang sudah ada...');
      await prisma.user.delete({
        where: { email: 'admin.new@simrszen.local' }
      });
    }

    // Buat data pegawai terlebih dahulu
    const testAdminPegawai = await prisma.pegawai.create({
      data: {
        nip: 'ADM002',
        nama: 'New Administrator',
        jenisKelamin: 'Laki-laki',
        tempatLahir: 'Jakarta',
        tanggalLahir: new Date(),
        alamat: 'Alamat New Administrator',
        noHp: '081234567892',
        email: 'admin.new@simrszen.local',
        status: 'Aktif'
      }
    });

    const hashedPassword = await bcrypt.hash('admin12345', 10);
    
    const testAdminUser = await prisma.user.create({
      data: {
        email: 'admin.new@simrszen.local',
        password: hashedPassword,
        fullName: 'New Administrator',
        isActive: true,
        nip: 'ADM002'
      }
    });

    console.log('Akun admin baru berhasil dibuat:');
    console.log('- ID: ' + testAdminUser.id);
    console.log('- Email: ' + testAdminUser.email);
    console.log('- Password: admin12345');
    console.log('- NIP: ' + testAdminUser.nip);
    console.log('- Pegawai ID: ' + testAdminPegawai.id);
    console.log('');
    console.log('Silakan gunakan kredensial berikut untuk login:');
    console.log('Email: admin.new@simrszen.local');
    console.log('Password: admin12345');
  } catch (error) {
    console.error('Gagal membuat akun admin baru:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createNewAdminUser();
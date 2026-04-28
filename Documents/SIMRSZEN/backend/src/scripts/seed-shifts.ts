import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedShifts() {
  try {
    // Cek apakah data shift sudah ada
    const existingShifts = await prisma.shift.count();
    
    if (existingShifts > 0) {
      console.log('Shifts already exist, skipping seeding');
      return;
    }

    // Shift standar
    await prisma.shift.createMany({
      data: [
        {
          name: 'Pagi',
          description: 'Shift pagi untuk staf administrasi dan perawat',
          startTime: new Date('2026-01-01T08:00:00'),
          endTime: new Date('2026-01-01T16:00:00'),
          breakStartTime: new Date('2026-01-01T12:00:00'),
          breakEndTime: new Date('2026-01-01T13:00:00'),
          maxConsecutiveDays: 5,
          minRestHoursAfterShift: 10,
          weekendPattern: 'off',
          holidayWorking: false,
        },
        {
          name: 'Siang',
          description: 'Shift sore untuk staf administrasi dan perawat',
          startTime: new Date('2026-01-01T16:00:00'),
          endTime: new Date('2026-01-01T24:00:00'),
          breakStartTime: new Date('2026-01-01T20:00:00'),
          breakEndTime: new Date('2026-01-01T21:00:00'),
          maxConsecutiveDays: 5,
          minRestHoursAfterShift: 10,
          weekendPattern: 'off',
          holidayWorking: false,
        },
        {
          name: 'Malam',
          description: 'Shift malam untuk staf perawat dan dokter jaga',
          startTime: new Date('2026-01-01T24:00:00'),
          endTime: new Date('2026-01-01T08:00:00'),
          breakStartTime: new Date('2026-01-01T04:00:00'),
          breakEndTime: new Date('2026-01-01T05:00:00'),
          maxConsecutiveDays: 3,
          minRestHoursAfterShift: 12,
          weekendPattern: 'half',
          holidayWorking: true,
        },
      ],
    });

    // Shift-shift tidak umum di rumah sakit
    await prisma.shift.createMany({
      data: [
        {
          name: 'On Call 24 Jam',
          description: 'Shift on-call selama 24 jam penuh untuk dokter spesialis',
          startTime: new Date('2026-01-01T08:00:00'),
          endTime: new Date('2026-01-01T08:00:00'), // 24 jam kemudian
          isOvertimeAllowed: true,
          maxConsecutiveDays: 2,
          minRestHoursAfterShift: 24,
          weekendPattern: 'full',
          holidayWorking: true,
        },
        {
          name: 'Jaga Malam Panjang',
          description: 'Shift malam yang berlangsung lebih lama dari biasanya',
          startTime: new Date('2026-01-01T20:00:00'),
          endTime: new Date('2026-01-01T08:00:00'), // 12 jam
          breakStartTime: new Date('2026-01-01T02:00:00'),
          breakEndTime: new Date('2026-01-01T03:00:00'),
          maxConsecutiveDays: 2,
          minRestHoursAfterShift: 16,
          weekendPattern: 'full',
          holidayWorking: true,
        },
        {
          name: 'Shift Pendek ICU',
          description: 'Shift pendek 6 jam untuk area ICU',
          startTime: new Date('2026-01-01T06:00:00'),
          endTime: new Date('2026-01-01T12:00:00'),
          maxConsecutiveDays: 7, // Bisa setiap hari karena pendek
          minRestHoursAfterShift: 8,
          weekendPattern: 'off',
          holidayWorking: false,
        },
        {
          name: 'Shift 3-Jam',
          description: 'Shift khusus 3 jam untuk tugas spesifik',
          startTime: new Date('2026-01-01T15:00:00'),
          endTime: new Date('2026-01-01T18:00:00'),
          maxConsecutiveDays: 10, // Lebih banyak karena pendek
          minRestHoursAfterShift: 6,
          weekendPattern: 'off',
          holidayWorking: false,
        },
        {
          name: 'Flexi Shift',
          description: 'Shift dengan jam fleksibel sesuai kebutuhan',
          startTime: new Date('2026-01-01T10:00:00'),
          endTime: new Date('2026-01-01T18:00:00'),
          breakStartTime: new Date('2026-01-01T14:00:00'),
          breakEndTime: new Date('2026-01-01T14:30:00'),
          maxConsecutiveDays: 6,
          minRestHoursAfterShift: 12,
          weekendPattern: 'off',
          holidayWorking: false,
        },
        {
          name: 'Shift Operator Radio',
          description: 'Shift operator radio 12 jam',
          startTime: new Date('2026-01-01T07:00:00'),
          endTime: new Date('2026-01-01T19:00:00'),
          breakStartTime: new Date('2026-01-01T12:00:00'),
          breakEndTime: new Date('2026-01-01T12:30:00'),
          maxConsecutiveDays: 4, // 4 hari kerja dalam seminggu
          minRestHoursAfterShift: 24,
          weekendPattern: 'off',
          holidayWorking: false,
        }
      ],
    });

    console.log('Shifts seeded successfully!');
  } catch (error) {
    console.error('Error seeding shifts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedShifts();
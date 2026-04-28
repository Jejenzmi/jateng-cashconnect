import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const depts = await prisma.department.count();
  const docs = await prisma.doctor.count();
  console.log(`Departments: ${depts}, Doctors: ${docs}`);
  
  if (depts === 0) {
    await prisma.department.create({ data: { name: 'Poli Umum', code: 'UMM', description: 'Poliklinik Umum' } });
    console.log('Created department');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

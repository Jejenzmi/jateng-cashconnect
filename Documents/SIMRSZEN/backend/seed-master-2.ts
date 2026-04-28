import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai proses seeder master data TAMBAHAN SIMRS ZEN...');

  // 1. ICD-10 (Diagnosa)
  console.log('Seeding ICD-10...');
  const icd10 = [
    { code: 'A09', name: 'Diarrhoea and gastroenteritis of presumed infectious origin', description: 'Diare' },
    { code: 'J00', name: 'Acute nasopharyngitis [common cold]', description: 'Flu / Pilek biasa' },
    { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified', description: 'ISPA' },
    { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications', description: 'Diabetes Tipe 2' },
    { code: 'I10', name: 'Essential (primary) hypertension', description: 'Hipertensi' },
    { code: 'K29.7', name: 'Gastritis, unspecified', description: 'Maag / Gastritis' },
    { code: 'R50.9', name: 'Fever, unspecified', description: 'Demam' },
    { code: 'A01.0', name: 'Typhoid fever', description: 'Tipes' },
  ];

  for (const item of icd10) {
    await prisma.icd10.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
  }

  // 2. ICD-9 CM (Prosedur)
  console.log('Seeding ICD-9 CM...');
  const icd9 = [
    { code: '89.02', name: 'Interview and evaluation, described as comprehensive', description: 'Konsultasi Dokter Umum' },
    { code: '89.52', name: 'Electrocardiogram', description: 'EKG / Rekam Jantung' },
    { code: '90.59', name: 'Microscopic examination of blood', description: 'Cek Darah Lengkap' },
    { code: '93.57', name: 'Application of other wound dressing', description: 'Perawatan Luka' },
    { code: '39.95', name: 'Hemodialysis', description: 'Cuci Darah' },
  ];

  for (const item of icd9) {
    await prisma.icd9.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
  }

  // 3. SERVICE TARIFFS (Tarif Layanan)
  console.log('Seeding Service Tariffs...');
  const tariffs = [
    { code: 'TRF-REG-01', name: 'Pendaftaran Pasien Baru', category: 'Pendaftaran', price: 25000 },
    { code: 'TRF-REG-02', name: 'Pendaftaran Pasien Lama', category: 'Pendaftaran', price: 15000 },
    { code: 'TRF-KONS-01', name: 'Konsultasi Dokter Umum', category: 'Konsultasi', price: 50000 },
    { code: 'TRF-KONS-02', name: 'Konsultasi Dokter Spesialis', category: 'Konsultasi', price: 150000 },
    { code: 'TRF-KONS-03', name: 'Konsultasi IGD', category: 'Konsultasi', price: 75000 },
    { code: 'TRF-TIND-01', name: 'Pemasangan Infus', category: 'Tindakan Keperawatan', price: 35000 },
    { code: 'TRF-TIND-02', name: 'Jahit Luka (1-5 Jahitan)', category: 'Tindakan Medis', price: 120000 },
    { code: 'TRF-TIND-03', name: 'Nebulizer', category: 'Tindakan Keperawatan', price: 65000 },
  ];

  for (const item of tariffs) {
    await prisma.serviceTariff.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
  }

  // 4. INSURANCE PROVIDERS (Asuransi)
  console.log('Seeding Insurance Providers...');
  const insurances = [
    { code: 'INS-UMUM', name: 'Umum / Pribadi', type: 'UMUM' },
    { code: 'INS-BPJS', name: 'BPJS Kesehatan', type: 'BPJS' },
    { code: 'INS-TK', name: 'BPJS Ketenagakerjaan', type: 'BPJS' },
    { code: 'INS-JASA', name: 'Jasa Raharja', type: 'SWASTA' },
    { code: 'INS-MANDIRI', name: 'Mandiri Inhealth', type: 'SWASTA' },
  ];

  for (const item of insurances) {
    await prisma.insuranceProvider.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
  }

  // 5. SUPPLIERS (Pemasok)
  console.log('Seeding Suppliers...');
  const suppliers = [
    { name: 'PT. Kimia Farma Trading', contactPerson: 'Bpk. Andi', phone: '021-1234567' },
    { name: 'PT. Enseval Putera', contactPerson: 'Ibu Ratna', phone: '021-7654321' },
    { name: 'PT. Mensa Binasukses', contactPerson: 'Bpk. Budi', phone: '021-5556667' },
  ];

  for (const item of suppliers) {
    const exists = await prisma.supplier.findFirst({ where: { name: item.name } });
    if (!exists) {
      await prisma.supplier.create({ data: item });
    }
  }

  // 6. INVENTORY ITEMS (Alkes / BHP)
  console.log('Seeding Inventory Items / Alkes...');
  const supplier1 = await prisma.supplier.findFirst();
  if (supplier1) {
    const inventory = [
      { name: 'Spuit 3cc', category: 'BHP', unit: 'Pcs', stock: 500, minStock: 50, price: 2500, supplierId: supplier1.id },
      { name: 'Spuit 5cc', category: 'BHP', unit: 'Pcs', stock: 400, minStock: 50, price: 3500, supplierId: supplier1.id },
      { name: 'Infus Set Dewasa', category: 'BHP', unit: 'Pcs', stock: 200, minStock: 20, price: 15000, supplierId: supplier1.id },
      { name: 'Cairan NaCl 0.9% 500ml', category: 'Cairan Infus', unit: 'Botol', stock: 150, minStock: 30, price: 12000, supplierId: supplier1.id },
      { name: 'Kasa Steril 16x16', category: 'BHP', unit: 'Kotak', stock: 100, minStock: 10, price: 25000, supplierId: supplier1.id },
      { name: 'Sarung Tangan Non-Steril', category: 'BHP', unit: 'Box', stock: 50, minStock: 5, price: 45000, supplierId: supplier1.id },
    ];

    for (const item of inventory) {
      const exists = await prisma.inventoryItem.findFirst({ where: { name: item.name } });
      if (!exists) {
        await prisma.inventoryItem.create({ data: item });
      }
    }
  }

  // 7. DEMOGRAPHICS (Provinsi & Kabupaten)
  console.log('Seeding Demographics (Provinsi & Kab/Kota)...');
  const provinces = [
    { id: '31', name: 'DKI JAKARTA' },
    { id: '32', name: 'JAWA BARAT' },
    { id: '33', name: 'JAWA TENGAH' },
    { id: '34', name: 'DI YOGYAKARTA' },
    { id: '35', name: 'JAWA TIMUR' },
    { id: '36', name: 'BANTEN' },
  ];

  for (const prov of provinces) {
    const exists = await prisma.province.findUnique({ where: { id: prov.id } });
    if (!exists) {
      await prisma.province.create({ data: prov });
    }
  }

  const regencies = [
    { id: '3273', provinceId: '32', name: 'KOTA BANDUNG' },
    { id: '3276', provinceId: '32', name: 'KOTA DEPOK' },
    { id: '3171', provinceId: '31', name: 'KOTA JAKARTA SELATAN' },
    { id: '3172', provinceId: '31', name: 'KOTA JAKARTA TIMUR' },
    { id: '3374', provinceId: '33', name: 'KOTA SEMARANG' },
    { id: '3578', provinceId: '35', name: 'KOTA SURABAYA' },
  ];

  for (const reg of regencies) {
    const exists = await prisma.regency.findUnique({ where: { id: reg.id } });
    if (!exists) {
      await prisma.regency.create({ data: reg });
    }
  }

  console.log('====================================');
  console.log('✅ SEEDING DATA TAMBAHAN SELESAI ✅');
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

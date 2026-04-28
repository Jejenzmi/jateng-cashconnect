import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai proses seeder master data SIMRS ZEN...');

  // 1. MODULES
  console.log('Seeding Modules...');
  const modules = [
    { name: 'dashboard', displayName: 'Dashboard', sortOrder: 1 },
    { name: 'pendaftaran', displayName: 'Pendaftaran', sortOrder: 2 },
    { name: 'rawat_jalan', displayName: 'Rawat Jalan', sortOrder: 3 },
    { name: 'igd', displayName: 'IGD', sortOrder: 4 },
    { name: 'rawat_inap', displayName: 'Rawat Inap', sortOrder: 5 },
    { name: 'farmasi', displayName: 'Farmasi', sortOrder: 6 },
    { name: 'laboratorium', displayName: 'Laboratorium', sortOrder: 7 },
    { name: 'radiologi', displayName: 'Radiologi', sortOrder: 8 },
    { name: 'kasir', displayName: 'Kasir & Billing', sortOrder: 9 },
    { name: 'rekam_medis', displayName: 'Rekam Medis', sortOrder: 10 },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { name: mod.name },
      update: {},
      create: mod,
    });
  }

  // 2. ROLES
  console.log('Seeding Roles...');
  const roles = [
    { name: 'ADMIN', permissions: ['all'] },
    { name: 'DOKTER', permissions: ['read_patient', 'write_emr', 'create_prescription', 'create_lab_order'] },
    { name: 'PERAWAT', permissions: ['read_patient', 'write_emr_vital'] },
    { name: 'FARMASI', permissions: ['read_prescription', 'dispense_medicine', 'manage_inventory'] },
    { name: 'RESEPSIONIS', permissions: ['create_patient', 'create_visit', 'manage_schedule'] },
    { name: 'KASIR', permissions: ['read_bill', 'process_payment'] },
    { name: 'LABORATORIUM', permissions: ['read_lab_order', 'write_lab_result'] },
    { name: 'RADIOLOGI', permissions: ['read_rad_order', 'write_rad_result'] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 3. DEPARTMENTS / POLI
  console.log('Seeding Departments...');
  const depts = [
    { name: 'Poli Umum', description: 'Pelayanan Medik Dasar Umum' },
    { name: 'Poli Gigi & Mulut', description: 'Pelayanan Kesehatan Gigi' },
    { name: 'Poli Anak (Pediatri)', description: 'Pelayanan Kesehatan Anak' },
    { name: 'Poli Kandungan (Obgyn)', description: 'Pelayanan Kesehatan Ibu dan Kandungan' },
    { name: 'Poli Penyakit Dalam', description: 'Pelayanan Spesialis Penyakit Dalam' },
    { name: 'Poli Bedah', description: 'Pelayanan Konsultasi Bedah' },
    { name: 'Poli Mata', description: 'Pelayanan Kesehatan Mata' },
    { name: 'Poli THT', description: 'Pelayanan Telinga Hidung Tenggorokan' },
    { name: 'Poli Saraf', description: 'Pelayanan Neurologi' },
    { name: 'Poli Jantung', description: 'Pelayanan Kardiologi' },
  ];

  const createdDepts = [];
  for (const d of depts) {
    const dept = await prisma.department.findFirst({ where: { name: d.name } });
    if (!dept) {
      createdDepts.push(await prisma.department.create({ data: d }));
    } else {
      createdDepts.push(dept);
    }
  }

  // 4. DOCTORS
  console.log('Seeding Doctors...');
  const doctors = [
    { nip: 'DOC001', fullName: 'dr. Budi Santoso', specialization: 'Umum' },
    { nip: 'DOC002', fullName: 'drg. Siti Aminah', specialization: 'Gigi' },
    { nip: 'DOC003', fullName: 'dr. Wahyu Pratama, Sp.A', specialization: 'Anak' },
    { nip: 'DOC004', fullName: 'dr. Lina Marlina, Sp.OG', specialization: 'Obgyn' },
    { nip: 'DOC005', fullName: 'dr. Hendra Gunawan, Sp.PD', specialization: 'Penyakit Dalam' },
    { nip: 'DOC006', fullName: 'dr. Anton Wijaya, Sp.B', specialization: 'Bedah' },
    { nip: 'DOC007', fullName: 'dr. Ratna Sari, Sp.M', specialization: 'Mata' },
    { nip: 'DOC008', fullName: 'dr. Dika Andrian, Sp.S', specialization: 'Saraf' },
  ];

  for (const d of doctors) {
    await prisma.doctor.upsert({
      where: { nip: d.nip },
      update: {},
      create: d,
    });
  }

  // 5. ROOMS & BEDS
  console.log('Seeding Rooms & Beds...');
  const rooms = [
    { name: 'Melati 1', type: 'KELAS_3', floor: 1, capacity: 6 },
    { name: 'Mawar 1', type: 'KELAS_2', floor: 1, capacity: 4 },
    { name: 'Anggrek 1', type: 'KELAS_1', floor: 2, capacity: 2 },
    { name: 'VIP Suite', type: 'VIP', floor: 3, capacity: 1 },
    { name: 'Ruang ICU', type: 'ICU', floor: 2, capacity: 4 },
    { name: 'Ruang NICU', type: 'NICU', floor: 2, capacity: 2 },
  ];

  for (const r of rooms) {
    let room = await prisma.room.findFirst({ where: { name: r.name } });
    if (!room) {
      room = await prisma.room.create({
        data: {
          name: r.name,
          type: r.type,
          floor: r.floor,
          capacity: r.capacity,
          available: r.capacity,
        }
      });
      
      // Auto-create beds for this room
      const bedsToCreate = Array.from({ length: r.capacity }).map((_, i) => ({
        name: `${r.name} - Bed ${i + 1}`,
        roomId: room!.id,
        type: r.type,
        status: 'available'
      }));
      
      await prisma.bed.createMany({ data: bedsToCreate });
    }
  }

  // 6. MEDICINES
  console.log('Seeding Medicines...');
  const medicines = [
    { name: 'Paracetamol 500mg', genericName: 'Paracetamol', dosageForm: 'Tablet', strength: '500mg', unit: 'Strip', price: 5000, stock: 1500 },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', dosageForm: 'Kapsul', strength: '500mg', unit: 'Strip', price: 12000, stock: 800 },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', dosageForm: 'Kapsul', strength: '20mg', unit: 'Strip', price: 15000, stock: 500 },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', dosageForm: 'Tablet', strength: '400mg', unit: 'Strip', price: 8000, stock: 1000 },
    { name: 'Cefadroxil 500mg', genericName: 'Cefadroxil', dosageForm: 'Kapsul', strength: '500mg', unit: 'Strip', price: 25000, stock: 600 },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine', dosageForm: 'Tablet', strength: '10mg', unit: 'Strip', price: 6000, stock: 1200 },
    { name: 'Salbutamol 2mg', genericName: 'Salbutamol', dosageForm: 'Tablet', strength: '2mg', unit: 'Strip', price: 4000, stock: 800 },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', dosageForm: 'Tablet', strength: '5mg', unit: 'Strip', price: 10000, stock: 2000 },
    { name: 'Metformin 500mg', genericName: 'Metformin', dosageForm: 'Tablet', strength: '500mg', unit: 'Strip', price: 5000, stock: 2500 },
    { name: 'Vitamin C 500mg', genericName: 'Ascorbic Acid', dosageForm: 'Tablet', strength: '500mg', unit: 'Botol', price: 35000, stock: 300 },
  ];

  for (const m of medicines) {
    const med = await prisma.medicine.findFirst({ where: { name: m.name } });
    if (!med) {
      await prisma.medicine.create({ data: m });
    }
  }

  // 7. LAB TESTS
  console.log('Seeding Laboratory Tests...');
  const labTests = [
    { code: 'HEMATO-01', name: 'Darah Rutin (Complete Blood Count)', group: 'Hematology', price: 85000, sampleType: 'Darah Vena' },
    { code: 'KIMIA-01', name: 'Gula Darah Puasa (GDP)', group: 'Chemistry', price: 40000, sampleType: 'Darah Vena', preparation: 'Puasa 8-10 Jam' },
    { code: 'KIMIA-02', name: 'Gula Darah Sewaktu (GDS)', group: 'Chemistry', price: 40000, sampleType: 'Darah Kapiler' },
    { code: 'KIMIA-03', name: 'Kolesterol Total', group: 'Chemistry', price: 55000, sampleType: 'Darah Vena', preparation: 'Puasa 10-12 Jam' },
    { code: 'KIMIA-04', name: 'Asam Urat', group: 'Chemistry', price: 45000, sampleType: 'Darah Vena' },
    { code: 'KIMIA-05', name: 'SGOT / AST', group: 'Chemistry', price: 50000, sampleType: 'Darah Vena' },
    { code: 'KIMIA-06', name: 'SGPT / ALT', group: 'Chemistry', price: 50000, sampleType: 'Darah Vena' },
    { code: 'URINE-01', name: 'Urine Lengkap', group: 'Microbiology', price: 65000, sampleType: 'Urine' },
    { code: 'IMUNO-01', name: 'Widal Test (Tipes)', group: 'Immunology', price: 120000, sampleType: 'Darah Vena' },
    { code: 'IMUNO-02', name: 'HBsAg (Hepatitis B)', group: 'Immunology', price: 150000, sampleType: 'Darah Vena' },
  ];

  for (const test of labTests) {
    await prisma.laboratoryTest.upsert({
      where: { code: test.code },
      update: {},
      create: test,
    });
  }

  // 8. RADIOLOGY EXAMS
  console.log('Seeding Radiology Exams...');
  const radExams = [
    { code: 'XRAY-01', name: 'Rontgen Thorax (Dada)', category: 'X-Ray', price: 150000 },
    { code: 'XRAY-02', name: 'Rontgen Tulang Belakang (Cervical)', category: 'X-Ray', price: 200000 },
    { code: 'USG-01', name: 'USG Abdomen (Perut) Lengkap', category: 'USG', price: 350000, preparation: 'Puasa 6 jam sebelum pemeriksaan' },
    { code: 'USG-02', name: 'USG Kehamilan (Kandungan)', category: 'USG', price: 250000 },
    { code: 'CT-01', name: 'CT Scan Kepala', category: 'CT Scan', price: 850000 },
    { code: 'CT-02', name: 'CT Scan Thorax', category: 'CT Scan', price: 1200000 },
    { code: 'MRI-01', name: 'MRI Tulang Belakang', category: 'MRI', price: 2500000 },
  ];

  for (const exam of radExams) {
    await prisma.radiologyExam.upsert({
      where: { code: exam.code },
      update: {},
      create: exam,
    });
  }

  // 9. PATIENT DUMMY DATA
  console.log('Seeding Dummy Patients...');
  const dummyPatients = [
    { nik: '3201010101900001', name: 'Ahmad Abdullah', gender: 'Laki-laki', dateOfBirth: new Date('1990-01-01'), address: 'Jl. Merdeka No. 1, Jakarta', phone: '081234567890', bloodType: 'O' },
    { nik: '3201010202950002', name: 'Siti Rahmawati', gender: 'Perempuan', dateOfBirth: new Date('1995-02-02'), address: 'Jl. Sudirman No. 2, Bandung', phone: '081987654321', bloodType: 'A' },
    { nik: '3201010303880003', name: 'Budi Hartono', gender: 'Laki-laki', dateOfBirth: new Date('1988-03-03'), address: 'Jl. Gatot Subroto No. 3, Surabaya', phone: '081122334455', bloodType: 'B' },
    { nik: '3201010404920004', name: 'Diana Putri', gender: 'Perempuan', dateOfBirth: new Date('1992-04-04'), address: 'Jl. Thamrin No. 4, Medan', phone: '081556677889', bloodType: 'AB' },
    { nik: '3201010505200005', name: 'Kevin Saputra (Anak)', gender: 'Laki-laki', dateOfBirth: new Date('2020-05-05'), address: 'Jl. Ahmad Yani No. 5, Semarang', phone: '081998877665', bloodType: 'O' },
  ];

  for (const p of dummyPatients) {
    let pat = await prisma.patient.findFirst({ where: { nik: p.nik } });
    if (!pat) {
      await prisma.patient.create({ data: p });
    }
  }

  console.log('====================================');
  console.log('✅ SEEDING DATA MASTER SELESAI ✅');
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

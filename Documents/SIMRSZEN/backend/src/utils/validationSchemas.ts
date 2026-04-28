import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.string().min(1).max(50),
});

export const userUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.string().min(1).max(50).optional(),
  isActive: z.boolean().optional(),
});

// Patient validation schemas
export const patientSchema = z.object({
  fullName: z.string().min(1).max(100),
  nik: z.string().max(16).optional(),
  birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Must be a valid date string"
  }),
  gender: z.enum(['L', 'P']),
  phone: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
  bpjsNumber: z.string().max(20).optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().optional(),
  medicalRecordNo: z.string().max(50).optional(),
});

export const patientUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  nik: z.string().max(16).optional(),
  birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Must be a valid date string"
  }).optional(),
  gender: z.enum(['L', 'P']).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
  bpjsNumber: z.string().max(20).optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().optional(),
});

// Registration validation schemas
export const registrationSchema = z.object({
  patientId: z.string().uuid(),
  serviceType: z.string().min(1).max(100),
  department: z.string().min(1).max(100),
  doctor: z.string().min(1).max(100),
  status: z.enum(['daftar', 'periksa', 'selesai', 'batal']),
});

// Medical record validation schemas
export const medicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid().optional(),
  registrationId: z.string().uuid().optional(),
  chiefComplaint: z.string().min(1),
  historyOfPresentIllness: z.string().optional(),
  physicalExam: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

// Medicine validation schemas
export const medicineSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  genericName: z.string().max(100).optional(),
  dosageForm: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  unit: z.string().max(20).optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  minStock: z.number().int().nonnegative(),
});

// Prescription validation schemas
export const prescriptionSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid().optional(),
  registrationId: z.string().uuid().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

// Billing validation schemas
export const billingSchema = z.object({
  patientId: z.string().uuid(),
  registrationId: z.string().uuid().optional(),
  totalAmount: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'partially_paid', 'cancelled']),
  paymentMethod: z.enum(['tunai', 'kartu', 'transfer', 'bpjs']).optional(),
  notes: z.string().optional(),
});
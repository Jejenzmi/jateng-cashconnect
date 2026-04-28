import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { logger } from '../utils/logger';  // Changed from default to named import
import { ZodError } from 'zod';

// Schema for patient data
const patientSchema = z.object({
  nik: z.string().length(16, { message: 'NIK harus 16 digit' }),
  name: z.string().min(1, { message: 'Nama wajib diisi' }),
  dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Format tanggal lahir tidak valid' }),
  gender: z.enum(['L', 'P'], { message: 'Jenis kelamin harus L atau P' }),
  bloodType: z.string().optional(),
  bpjsNumber: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// Schema for patient update
const patientUpdateSchema = patientSchema.partial();

// Define types based on schema
type PatientData = z.infer<typeof patientSchema>;
type PatientUpdateData = z.infer<typeof patientUpdateSchema>;

export class PatientService {
  // Get all patients
  static async getAll() {
    const patients = await prisma.patient.findMany({
      where: { 
        isDeleted: false  // This is correct for PatientWhereInput
      },
      select: {
        id: true,
        nik: true,
        medicalRecordNumber: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        bpjsNumber: true,
        phone: true,
        address: true,
        occupation: true,
        maritalStatus: true,
        religion: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      data: patients,
      total: patients.length,
      page: 1,
      limit: 10
    };
  }

  // Get patient by ID
  static async getById(id: string) {
    return prisma.patient.findUnique({
      where: { 
        id  // Don't include isDeleted condition in PatientWhereUniqueInput
      },
      select: {
        id: true,
        nik: true,
        medicalRecordNumber: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        bpjsNumber: true,
        phone: true,
        address: true,
        occupation: true,
        maritalStatus: true,
        religion: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  // Create patient
  static async create(data: PatientData) {
    // Check if NIK already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { nik: data.nik }
    });
    
    if (existingPatient) {
      throw new Error('NIK already exists');
    }
    
    return prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
      },
      select: {
        id: true,
        nik: true,
        medicalRecordNumber: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        bpjsNumber: true,
        phone: true,
        address: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  // Update patient
  static async update(id: string, data: Partial<PatientUpdateData>) {
    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { 
        id  // Don't include isDeleted condition in PatientWhereUniqueInput
      }
    });
    
    if (!existingPatient || existingPatient.isDeleted) {
      throw new Error('Patient not found');
    }
    
    // Check if NIK is being changed and if the new NIK already exists
    if (data.nik && data.nik !== existingPatient.nik) {
      const duplicateNik = await prisma.patient.findUnique({
        where: { nik: data.nik }
      });
      
      if (duplicateNik) {
        throw new Error('NIK already exists');
      }
    }
    
    return prisma.patient.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      select: {
        id: true,
        nik: true,
        medicalRecordNumber: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        bpjsNumber: true,
        phone: true,
        address: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  // Delete patient (soft delete)
  static async delete(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { 
        id  // Don't include isDeleted condition in PatientWhereUniqueInput
      }
    });
    
    if (!patient || patient.isDeleted) {
      throw new Error('Patient not found');
    }
    
    // Soft delete
    return prisma.patient.update({
      where: { id },
      data: {
        isDeleted: true,  // This is correct for PatientUpdateInput
        deletedAt: new Date(),
      },
      select: {
        id: true,
        isDeleted: true,  // Return the updated status
      }
    });
  }
}

// Get all patients
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await PatientService.getAll();
    
    logger.info('Successfully retrieved patients', { count: patients.data.length });
    
    res.json({
      success: true,
      ...patients,
      message: 'Berhasil mengambil data pasien'
    });
  } catch (error) {
    logger.error('Error retrieving patients', { error: (error as Error).message, stack: (error as Error).stack });
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pasien',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

// Get patient by ID
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const patient = await PatientService.getById(id);
    
    if (!patient || patient.isDeleted) {
      logger.warn('Patient not found', { id });
      return res.status(404).json({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    }
    
    logger.info('Successfully retrieved patient', { id });
    
    res.json({
      success: true,
      data: patient,
      message: 'Berhasil mengambil data pasien'
    });
  } catch (error) {
    logger.error('Error retrieving patient', { 
      error: (error as Error).message, 
      stack: (error as Error).stack, 
      patientId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pasien',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
  // Explicitly return to avoid TS7030
  return;
};

// Create patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = patientSchema.parse(req.body);
    
    const newPatient = await PatientService.create(validatedData);
    
    logger.info('Successfully created patient', { 
      patientId: newPatient.id, 
      nik: newPatient.nik,
      name: newPatient.name 
    });
    
    res.status(201).json({
      success: true,
      data: newPatient,
      message: 'Berhasil menambahkan data pasien'
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error in patient creation', { 
        error: error.message, 
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    if (error instanceof Error && error.message === 'NIK already exists') {
      logger.warn('Attempt to create patient with existing NIK', { nik: req.body.nik });
      
      return res.status(409).json({
        success: false,
        message: 'NIK sudah terdaftar dalam sistem'
      });
    }
    
    logger.error('Error creating patient', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      nik: req.body.nik
    });
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan data pasien',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
  // Explicitly return to avoid TS7030
  return;
};

// Update patient
export const updatePatient = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = patientUpdateSchema.partial().parse(req.body);
    const { id } = req.params;
    
    const updatedPatient = await PatientService.update(id, validatedData);
    
    logger.info('Successfully updated patient', { 
      id,
      nik: updatedPatient.nik,
      name: updatedPatient.name 
    });
    
    res.json({
      success: true,
      data: updatedPatient,
      message: 'Berhasil memperbarui data pasien'
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error in patient update', { 
        error: error.message, 
        patientId: req.params.id,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    if (error instanceof Error && error.message === 'Patient not found') {
      logger.warn('Attempt to update non-existent patient', { patientId: req.params.id });
      
      return res.status(404).json({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    }
    
    if (error instanceof Error && error.message === 'NIK already exists') {
      logger.warn('Attempt to update patient with existing NIK', { 
        patientId: req.params.id,
        nik: req.body.nik
      });
      
      return res.status(409).json({
        success: false,
        message: 'NIK baru sudah terdaftar dalam sistem'
      });
    }
    
    logger.error('Error updating patient', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      patientId: req.params.id
    });
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data pasien',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
  // Explicitly return to avoid TS7030
  return;
};

// Soft delete patient
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await PatientService.delete(id);
    
    logger.info('Successfully deleted patient', { id });
    
    res.json({
      success: true,
      message: 'Berhasil menghapus data pasien'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Patient not found') {
      logger.warn('Attempt to delete non-existent patient', { patientId: req.params.id });
      
      return res.status(404).json({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    }
    
    if (error instanceof Error && error.message === 'Cannot delete patient with existing registrations') {
      logger.warn('Attempt to delete patient with existing registrations', { patientId: req.params.id });
      
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    logger.error('Error deleting patient', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      patientId: req.params.id
    });
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data pasien',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
  // Explicitly return to avoid TS7030
  return;
};




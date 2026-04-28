import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk doctor
const doctorSchema = z.object({
  nip: z.string().min(1, { message: 'NIP wajib diisi' }),
  fullName: z.string().min(1, { message: 'Nama lengkap wajib diisi' }),
  specialization: z.string().min(1, { message: 'Spesialisasi wajib diisi' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),
  address: z.string().optional(),
  licenseNumber: z.string().optional(),
  employmentDate: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Format tanggal tidak valid' }).optional(),
});

export const getAllDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { 
        isDeleted: false 
      },
      select: {
        id: true,
        nip: true,
        fullName: true,
        specialization: true,
        phone: true,
        email: true,
        address: true,
        licenseNumber: true,
        employmentDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data dokter',
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data dokter',
      error: (error as Error).message
    });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { 
        id
      },
      select: {
        id: true,
        nip: true,
        fullName: true,
        specialization: true,
        phone: true,
        email: true,
        address: true,
        licenseNumber: true,
        employmentDate: true,
        isDeleted: true,  // Adding this field to check if the doctor is deleted
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!doctor || doctor.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data dokter',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data dokter',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = doctorSchema.parse(req.body);
    
    // Periksa apakah NIP sudah ada
    const existingDoctor = await prisma.doctor.findUnique({
      where: { nip: validatedData.nip }
    });
    
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'NIP sudah terdaftar dalam sistem'
      });
    }
    
    const doctor = await prisma.doctor.create({
      data: {
        ...validatedData,
        employmentDate: validatedData.employmentDate ? new Date(validatedData.employmentDate) : null,
      },
      select: {
        id: true,
        nip: true,
        fullName: true,
        specialization: true,
        phone: true,
        email: true,
        address: true,
        licenseNumber: true,
        employmentDate: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data dokter',
      data: doctor
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan data dokter',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = doctorSchema.parse(req.body);
    
    // Periksa apakah dokter ada
    const existingDoctor = await prisma.doctor.findUnique({
      where: { 
        id
      }
    });
    
    if (!existingDoctor || existingDoctor.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    }
    
    // Periksa apakah NIP diganti dan NIP baru sudah ada
    if (existingDoctor.nip !== validatedData.nip) {
      const duplicateNip = await prisma.doctor.findUnique({
        where: { nip: validatedData.nip }
      });
      
      if (duplicateNip) {
        return res.status(409).json({
          success: false,
          message: 'NIP baru sudah terdaftar dalam sistem'
        });
      }
    }
    
    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        ...validatedData,
        employmentDate: validatedData.employmentDate ? new Date(validatedData.employmentDate) : null,
      },
      select: {
        id: true,
        nip: true,
        fullName: true,
        specialization: true,
        phone: true,
        email: true,
        address: true,
        licenseNumber: true,
        employmentDate: true,
        isDeleted: true,  // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data dokter',
      data: doctor
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data dokter',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { 
        id
      }
    });
    
    if (!doctor || doctor.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    }
    
    // Soft delete
    await prisma.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data dokter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data dokter',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};


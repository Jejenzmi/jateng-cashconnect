import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk laboratory test
const labTestSchema = z.object({
  name: z.string().min(1, { message: 'Nama tes laboratorium wajib diisi' }),
  code: z.string().min(1, { message: 'Kode tes laboratorium wajib diisi' }),
  group: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive({ message: 'Harga harus lebih dari 0' }),
  normalValues: z.string().optional(),
  sampleType: z.string().optional(),
  preparation: z.string().optional(),
  processingTime: z.number().int().nonnegative({ message: 'Waktu pemrosesan harus angka positif atau nol' }).optional(),
  isActive: z.boolean().optional(),
});

export const getAllLaboratoryTests = async (_req: Request, res: Response) => {
  try {
    const labTests = await prisma.laboratoryTest.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        group: true,
        description: true,
        price: true,
        normalValues: true,
        sampleType: true,
        preparation: true,
        processingTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data tes laboratorium',
      data: labTests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tes laboratorium',
      error: (error as Error).message
    });
  }
};

export const getLaboratoryTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const labTest = await prisma.laboratoryTest.findUnique({
      where: { 
        id
      },
      select: {
        id: true,
        name: true,
        code: true,
        group: true,
        description: true,
        price: true,
        normalValues: true,
        sampleType: true,
        preparation: true,
        processingTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data tes laboratorium',
      data: labTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tes laboratorium',
      error: (error as Error).message
    });
  }
};

export const createLaboratoryTest = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = labTestSchema.parse(req.body);
    
    const labTest = await prisma.laboratoryTest.create({
      data: {
        ...validatedData,
        processingTime: validatedData.processingTime || 0,
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        group: true,
        description: true,
        price: true,
        normalValues: true,
        sampleType: true,
        preparation: true,
        processingTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data tes laboratorium',
      data: labTest
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
      message: 'Terjadi kesalahan saat menambahkan data tes laboratorium',
      error: (error as Error).message
    });
  }
};

export const updateLaboratoryTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = labTestSchema.parse(req.body);
    
    // Periksa apakah tes laboratorium ada
    const existingLabTest = await prisma.laboratoryTest.findUnique({
      where: { 
        id
      }
    });
    
    if (!existingLabTest) {
      return res.status(404).json({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    }
    
    const labTest = await prisma.laboratoryTest.update({
      where: { id },
      data: {
        ...validatedData,
        processingTime: validatedData.processingTime || 0,
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        group: true,
        description: true,
        price: true,
        normalValues: true,
        sampleType: true,
        preparation: true,
        processingTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data tes laboratorium',
      data: labTest
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
      message: 'Terjadi kesalahan saat memperbarui data tes laboratorium',
      error: (error as Error).message
    });
  }
};

export const deleteLaboratoryTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const labTest = await prisma.laboratoryTest.findUnique({
      where: { 
        id
      }
    });
    
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    }
    
    // Karena model tidak memiliki field isDeleted, kita hapus secara permanen
    await prisma.laboratoryTest.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data tes laboratorium'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data tes laboratorium',
      error: (error as Error).message
    });
  }
};


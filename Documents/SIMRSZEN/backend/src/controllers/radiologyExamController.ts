import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk radiology exam
const radiologyExamSchema = z.object({
  name: z.string().min(1, { message: 'Nama pemeriksaan radiologi wajib diisi' }),
  code: z.string().min(1, { message: 'Kode pemeriksaan radiologi wajib diisi' }),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive({ message: 'Harga harus lebih dari 0' }),
  preparation: z.string().optional(),
  contraindications: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const getAllRadiologyExams = async (_req: Request, res: Response) => {
  try {
    const exams = await prisma.radiologyExam.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
        description: true,
        price: true,
        preparation: true,
        contraindications: true,
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
      message: 'Berhasil mengambil data pemeriksaan radiologi',
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pemeriksaan radiologi',
      error: (error as Error).message
    });
  }
};

export const getRadiologyExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const exam = await prisma.radiologyExam.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
        description: true,
        price: true,
        preparation: true,
        contraindications: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data pemeriksaan radiologi',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pemeriksaan radiologi',
      error: (error as Error).message
    });
  }
};

export const createRadiologyExam = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = radiologyExamSchema.parse(req.body);
    
    const exam = await prisma.radiologyExam.create({
      data: {
        ...validatedData,
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
        description: true,
        price: true,
        preparation: true,
        contraindications: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data pemeriksaan radiologi',
      data: exam
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
      message: 'Terjadi kesalahan saat menambahkan data pemeriksaan radiologi',
      error: (error as Error).message
    });
  }
};

export const updateRadiologyExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = radiologyExamSchema.parse(req.body);
    
    // Periksa apakah pemeriksaan radiologi ada
    const existingExam = await prisma.radiologyExam.findUnique({
      where: { id }
    });
    
    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    }
    
    const exam = await prisma.radiologyExam.update({
      where: { id },
      data: {
        ...validatedData,
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
        description: true,
        price: true,
        preparation: true,
        contraindications: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data pemeriksaan radiologi',
      data: exam
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
      message: 'Terjadi kesalahan saat memperbarui data pemeriksaan radiologi',
      error: (error as Error).message
    });
  }
};

export const deleteRadiologyExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const exam = await prisma.radiologyExam.findUnique({
      where: { id }
    });
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    }
    
    await prisma.radiologyExam.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data pemeriksaan radiologi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data pemeriksaan radiologi',
      error: (error as Error).message
    });
  }
};
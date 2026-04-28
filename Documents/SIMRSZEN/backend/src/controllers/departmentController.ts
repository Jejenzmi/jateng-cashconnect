import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk department
const departmentSchema = z.object({
  name: z.string().min(1, { message: 'Nama departemen wajib diisi' }),
  description: z.string().optional(),
  headId: z.string().optional(), // ID kepala departemen (pegawai)
});

export const getAllDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        head: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data departemen',
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data departemen',
      error: (error as Error).message
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        head: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data departemen',
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data departemen',
      error: (error as Error).message
    });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = departmentSchema.parse(req.body);
    
    // Jika headId disediakan, cek apakah user ada
    if (validatedData.headId) {
      const userExists = await prisma.user.findUnique({
        where: { id: validatedData.headId }
      });
      
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }
    }
    
    const department = await prisma.department.create({
      data: {
        ...validatedData,
      },
      include: {
        head: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data departemen',
      data: department
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
      message: 'Terjadi kesalahan saat menambahkan data departemen',
      error: (error as Error).message
    });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = departmentSchema.parse(req.body);
    
    // Periksa apakah departemen ada
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    });
    
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    }
    
    // Jika headId disediakan, cek apakah user ada
    if (validatedData.headId) {
      const userExists = await prisma.user.findUnique({
        where: { id: validatedData.headId }
      });
      
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }
    }
    
    const department = await prisma.department.update({
      where: { id },
      data: {
        ...validatedData,
      },
      include: {
        head: {
          select: {
            id: true,
            fullName: true,
            role: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data departemen',
      data: department
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
      message: 'Terjadi kesalahan saat memperbarui data departemen',
      error: (error as Error).message
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const department = await prisma.department.findUnique({
      where: { id }
    });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    }
    
    await prisma.department.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data departemen'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data departemen',
      error: (error as Error).message
    });
  }
};
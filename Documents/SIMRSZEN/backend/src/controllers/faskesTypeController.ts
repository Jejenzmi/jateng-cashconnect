import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua tipe faskes
export const getAllFaskesTypes = async (req: Request, res: Response) => {
  try {
    const faskesTypes = await prisma.faskesType.findMany({
      where: {
        isActive: true
      },
      include: {
        faskesModuleConfigs: {
          include: {
            module: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: faskesTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar tipe faskes',
      error: (error as Error).message
    });
  }
};

// Mendapatkan tipe faskes berdasarkan ID
export const getFaskesTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const faskesType = await prisma.faskesType.findUnique({
      where: { id },
      include: {
        faskesModuleConfigs: {
          include: {
            module: true
          }
        }
      }
    });
    
    if (!faskesType) {
      return res.status(404).json({
        success: false,
        message: 'Tipe faskes tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: faskesType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil tipe faskes',
      error: (error as Error).message
    });
  }
};

// Membuat tipe faskes baru
export const createFaskesType = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { name, description, level, category } = req.body;

    // Cek apakah nama tipe faskes sudah ada
    const existingFaskesType = await prisma.faskesType.findUnique({
      where: { name }
    });

    if (existingFaskesType) {
      return res.status(409).json({
        success: false,
        message: 'Nama tipe faskes sudah digunakan'
      });
    }

    const newFaskesType = await prisma.faskesType.create({
      data: {
        name,
        description: description || '',
        level,
        category
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tipe faskes berhasil dibuat',
      data: newFaskesType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat tipe faskes',
      error: (error as Error).message
    });
  }
};

// Memperbarui tipe faskes
export const updateFaskesType = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, description, level, category, isActive } = req.body;

    const updatedFaskesType = await prisma.faskesType.update({
      where: { id },
      data: {
        name,
        description,
        level,
        category,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Tipe faskes berhasil diperbarui',
      data: updatedFaskesType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui tipe faskes',
      error: (error as Error).message
    });
  }
};

// Menghapus tipe faskes
export const deleteFaskesType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah tipe faskes memiliki relasi aktif sebelum dihapus
    const faskesModuleConfigs = await prisma.faskesModuleConfig.count({
      where: { faskesTypeId: id }
    });

    if (faskesModuleConfigs > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tipe faskes tidak dapat dihapus karena masih memiliki konfigurasi modul terkait'
      });
    }

    await prisma.faskesType.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Tipe faskes berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus tipe faskes',
      error: (error as Error).message
    });
  }
};
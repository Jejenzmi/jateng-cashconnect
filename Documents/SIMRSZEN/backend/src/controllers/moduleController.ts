import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua modul
export const getAllModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      where: {
        isActive: true
      },
      include: {
        modulePermissions: true,
        faskesModuleConfigs: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar modul',
      error: (error as Error).message
    });
  }
};

// Mendapatkan modul berdasarkan ID
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        modulePermissions: true,
        faskesModuleConfigs: true
      }
    });
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Modul tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil modul',
      error: (error as Error).message
    });
  }
};

// Membuat modul baru
export const createModule = async (req: Request, res: Response) => {
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

    const { moduleCode, moduleName, description } = req.body;

    // Cek apakah kode modul sudah ada
    const existingModule = await prisma.module.findUnique({
      where: { moduleCode }
    });

    if (existingModule) {
      return res.status(409).json({
        success: false,
        message: 'Kode modul sudah digunakan'
      });
    }

    const newModule = await prisma.module.create({
      data: {
        moduleCode,
        moduleName,
        description: description || ''
      }
    });

    res.status(201).json({
      success: true,
      message: 'Modul berhasil dibuat',
      data: newModule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat modul',
      error: (error as Error).message
    });
  }
};

// Memperbarui modul
export const updateModule = async (req: Request, res: Response) => {
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
    const { moduleName, description, isActive } = req.body;

    const updatedModule = await prisma.module.update({
      where: { id },
      data: {
        moduleName,
        description,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Modul berhasil diperbarui',
      data: updatedModule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui modul',
      error: (error as Error).message
    });
  }
};

// Menghapus modul
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah modul memiliki relasi aktif sebelum dihapus
    const modulePermissions = await prisma.modulePermission.count({
      where: { moduleId: id }
    });

    if (modulePermissions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Modul tidak dapat dihapus karena masih memiliki izin terkait'
      });
    }

    await prisma.module.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Modul berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus modul',
      error: (error as Error).message
    });
  }
};
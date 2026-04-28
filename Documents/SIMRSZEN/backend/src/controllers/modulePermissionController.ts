import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua izin modul
export const getAllModulePermissions = async (req: Request, res: Response) => {
  try {
    const modulePermissions = await prisma.modulePermission.findMany({
      include: {
        module: true,
        rolePermissions: {
          include: {
            role: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: modulePermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar izin modul',
      error: (error as Error).message
    });
  }
};

// Mendapatkan izin modul berdasarkan ID
export const getModulePermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const modulePermission = await prisma.modulePermission.findUnique({
      where: { id },
      include: {
        module: true,
        rolePermissions: {
          include: {
            role: true
          }
        }
      }
    });
    
    if (!modulePermission) {
      return res.status(404).json({
        success: false,
        message: 'Izin modul tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: modulePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil izin modul',
      error: (error as Error).message
    });
  }
};

// Membuat izin modul baru
export const createModulePermission = async (req: Request, res: Response) => {
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

    const { moduleId, permissionCode, permissionName, description } = req.body;

    // Cek apakah izin modul sudah ada
    const existingPermission = await prisma.modulePermission.findUnique({
      where: { permissionCode }
    });

    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: 'Kode izin sudah digunakan'
      });
    }

    // Cek apakah modul tersedia
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Modul tidak ditemukan'
      });
    }

    const newModulePermission = await prisma.modulePermission.create({
      data: {
        moduleId,
        permissionCode,
        permissionName,
        description: description || ''
      }
    });

    res.status(201).json({
      success: true,
      message: 'Izin modul berhasil dibuat',
      data: newModulePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat izin modul',
      error: (error as Error).message
    });
  }
};

// Memperbarui izin modul
export const updateModulePermission = async (req: Request, res: Response) => {
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
    const { permissionName, description } = req.body;

    const updatedModulePermission = await prisma.modulePermission.update({
      where: { id },
      data: {
        permissionName,
        description
      }
    });

    res.status(200).json({
      success: true,
      message: 'Izin modul berhasil diperbarui',
      data: updatedModulePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui izin modul',
      error: (error as Error).message
    });
  }
};

// Menghapus izin modul
export const deleteModulePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah izin modul memiliki relasi aktif sebelum dihapus
    const rolePermissions = await prisma.rolePermission.count({
      where: { modulePermissionId: id }
    });

    if (rolePermissions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Izin modul tidak dapat dihapus karena masih memiliki peran terkait'
      });
    }

    await prisma.modulePermission.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Izin modul berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus izin modul',
      error: (error as Error).message
    });
  }
};
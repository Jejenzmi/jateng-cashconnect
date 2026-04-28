import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua izin peran
export const getAllRolePermissions = async (req: Request, res: Response) => {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      include: {
        role: true,
        modulePermission: {
          include: {
            module: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: rolePermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar izin peran',
      error: (error as Error).message
    });
  }
};

// Mendapatkan izin peran berdasarkan ID
export const getRolePermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const rolePermission = await prisma.rolePermission.findUnique({
      where: { id },
      include: {
        role: true,
        modulePermission: {
          include: {
            module: true
          }
        }
      }
    });
    
    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: 'Izin peran tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rolePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil izin peran',
      error: (error as Error).message
    });
  }
};

// Membuat izin peran baru
export const createRolePermission = async (req: Request, res: Response) => {
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

    const { roleId, modulePermissionId, canView, canCreate, canUpdate, canDelete } = req.body;

    // Cek apakah peran dan izin modul tersedia
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Peran tidak ditemukan'
      });
    }

    const modulePermission = await prisma.modulePermission.findUnique({
      where: { id: modulePermissionId }
    });

    if (!modulePermission) {
      return res.status(404).json({
        success: false,
        message: 'Izin modul tidak ditemukan'
      });
    }

    // Cek apakah kombinasi peran dan izin modul sudah ada
    const existingRolePermission = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        modulePermissionId
      }
    });

    if (existingRolePermission) {
      return res.status(409).json({
        success: false,
        message: 'Izin peran ini sudah ditetapkan'
      });
    }

    const newRolePermission = await prisma.rolePermission.create({
      data: {
        roleId,
        modulePermissionId,
        canView: canView || false,
        canCreate: canCreate || false,
        canUpdate: canUpdate || false,
        canDelete: canDelete || false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Izin peran berhasil dibuat',
      data: newRolePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat izin peran',
      error: (error as Error).message
    });
  }
};

// Memperbarui izin peran
export const updateRolePermission = async (req: Request, res: Response) => {
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
    const { canView, canCreate, canUpdate, canDelete } = req.body;

    const updatedRolePermission = await prisma.rolePermission.update({
      where: { id },
      data: {
        canView,
        canCreate,
        canUpdate,
        canDelete
      }
    });

    res.status(200).json({
      success: true,
      message: 'Izin peran berhasil diperbarui',
      data: updatedRolePermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui izin peran',
      error: (error as Error).message
    });
  }
};

// Menghapus izin peran
export const deleteRolePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.rolePermission.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Izin peran berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus izin peran',
      error: (error as Error).message
    });
  }
};
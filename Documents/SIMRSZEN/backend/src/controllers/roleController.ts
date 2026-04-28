import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua peran
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      where: {
        isActive: true
      },
      include: {
        rolePermissions: {
          include: {
            modulePermission: {
              include: {
                module: true
              }
            }
          }
        },
        userRoles: {
          include: {
            user: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar peran',
      error: (error as Error).message
    });
  }
};

// Mendapatkan peran berdasarkan ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            modulePermission: {
              include: {
                module: true
              }
            }
          }
        },
        userRoles: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Peran tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil peran',
      error: (error as Error).message
    });
  }
};

// Membuat peran baru
export const createRole = async (req: Request, res: Response) => {
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

    const { roleName, description } = req.body;

    // Cek apakah nama peran sudah ada
    const existingRole = await prisma.role.findUnique({
      where: { roleName }
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: 'Nama peran sudah digunakan'
      });
    }

    const newRole = await prisma.role.create({
      data: {
        roleName,
        description: description || ''
      }
    });

    res.status(201).json({
      success: true,
      message: 'Peran berhasil dibuat',
      data: newRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat peran',
      error: (error as Error).message
    });
  }
};

// Memperbarui peran
export const updateRole = async (req: Request, res: Response) => {
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
    const { roleName, description, isActive } = req.body;

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        roleName,
        description,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Peran berhasil diperbarui',
      data: updatedRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui peran',
      error: (error as Error).message
    });
  }
};

// Menghapus peran
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah peran memiliki relasi aktif sebelum dihapus
    const rolePermissions = await prisma.rolePermission.count({
      where: { roleId: id }
    });

    if (rolePermissions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Peran tidak dapat dihapus karena masih memiliki izin terkait'
      });
    }

    const userRoles = await prisma.userRole.count({
      where: { roleId: id }
    });

    if (userRoles > 0) {
      return res.status(400).json({
        success: false,
        message: 'Peran tidak dapat dihapus karena masih terhubung ke pengguna'
      });
    }

    await prisma.role.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Peran berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus peran',
      error: (error as Error).message
    });
  }
};

// Menetapkan peran ke pengguna
export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;

    // Validasi input
    if (!userId || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'userId dan roleId wajib diisi'
      });
    }

    // Cek apakah pengguna dan peran tersedia
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Peran tidak ditemukan'
      });
    }

    // Cek apakah pengguna sudah memiliki peran ini
    const existingUserRole = await prisma.userRole.findFirst({
      where: {
        userId,
        roleId
      }
    });

    if (existingUserRole) {
      return res.status(409).json({
        success: false,
        message: 'Pengguna sudah memiliki peran ini'
      });
    }

    const userRole = await prisma.userRole.create({
      data: {
        userId,
        roleId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Peran berhasil ditetapkan ke pengguna',
      data: userRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menetapkan peran ke pengguna',
      error: (error as Error).message
    });
  }
};

// Menghapus peran dari pengguna
export const removeRoleFromUser = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;

    // Validasi input
    if (!userId || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'userId dan roleId wajib diisi'
      });
    }

    // Hapus hubungan antara pengguna dan peran
    await prisma.userRole.deleteMany({
      where: {
        userId,
        roleId
      }
    });

    res.status(200).json({
      success: true,
      message: 'Peran berhasil dihapus dari pengguna'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus peran dari pengguna',
      error: (error as Error).message
    });
  }
};
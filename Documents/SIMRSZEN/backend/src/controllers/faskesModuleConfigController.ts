import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Mendapatkan semua konfigurasi modul berdasarkan tipe faskes
export const getFaskesModuleConfigs = async (req: Request, res: Response) => {
  try {
    const faskesModuleConfigs = await prisma.faskesModuleConfig.findMany({
      include: {
        faskesType: true,
        module: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: faskesModuleConfigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar konfigurasi modul faskes',
      error: (error as Error).message
    });
  }
};

// Mendapatkan konfigurasi modul berdasarkan ID
export const getFaskesModuleConfigById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const faskesModuleConfig = await prisma.faskesModuleConfig.findUnique({
      where: { id },
      include: {
        faskesType: true,
        module: true
      }
    });
    
    if (!faskesModuleConfig) {
      return res.status(404).json({
        success: false,
        message: 'Konfigurasi modul faskes tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: faskesModuleConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil konfigurasi modul faskes',
      error: (error as Error).message
    });
  }
};

// Membuat konfigurasi modul baru
export const createFaskesModuleConfig = async (req: Request, res: Response) => {
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

    const { faskesTypeId, moduleId, isEnabled, bpjsConfig } = req.body;

    // Cek apakah tipe faskes dan modul tersedia
    const faskesType = await prisma.faskesType.findUnique({
      where: { id: faskesTypeId }
    });

    if (!faskesType) {
      return res.status(404).json({
        success: false,
        message: 'Tipe faskes tidak ditemukan'
      });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Modul tidak ditemukan'
      });
    }

    // Cek apakah kombinasi tipe faskes dan modul sudah ada
    const existingConfig = await prisma.faskesModuleConfig.findFirst({
      where: {
        faskesTypeId,
        moduleId
      }
    });

    if (existingConfig) {
      return res.status(409).json({
        success: false,
        message: 'Konfigurasi modul untuk tipe faskes ini sudah ditetapkan'
      });
    }

    const newFaskesModuleConfig = await prisma.faskesModuleConfig.create({
      data: {
        faskesTypeId,
        moduleId,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        bpjsConfig: bpjsConfig || {}
      }
    });

    res.status(201).json({
      success: true,
      message: 'Konfigurasi modul faskes berhasil dibuat',
      data: newFaskesModuleConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat konfigurasi modul faskes',
      error: (error as Error).message
    });
  }
};

// Memperbarui konfigurasi modul
export const updateFaskesModuleConfig = async (req: Request, res: Response) => {
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
    const { isEnabled, bpjsConfig } = req.body;

    const updatedFaskesModuleConfig = await prisma.faskesModuleConfig.update({
      where: { id },
      data: {
        isEnabled,
        bpjsConfig: bpjsConfig || {}
      }
    });

    res.status(200).json({
      success: true,
      message: 'Konfigurasi modul faskes berhasil diperbarui',
      data: updatedFaskesModuleConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui konfigurasi modul faskes',
      error: (error as Error).message
    });
  }
};

// Menghapus konfigurasi modul
export const deleteFaskesModuleConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.faskesModuleConfig.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Konfigurasi modul faskes berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus konfigurasi modul faskes',
      error: (error as Error).message
    });
  }
};
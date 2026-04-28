import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk medicine
const medicineSchema = z.object({
  name: z.string().min(1, { message: 'Nama obat wajib diisi' }),
  unit: z.string().min(1, { message: 'Satuan obat wajib diisi' }),
  price: z.coerce.number().nonnegative({ message: 'Harga harus angka positif' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stok harus angka positif atau nol' }),
});

export const getAllMedicines = async (_req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany({
      where: { 
        isDeleted: false 
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data obat',
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data obat',
      error: (error as Error).message
    });
  }
};

export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const medicine = await prisma.medicine.findUnique({
      where: { 
        id
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        stock: true,
        isDeleted: true, // Adding this field to check if the medicine is deleted
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!medicine || medicine.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data obat',
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data obat',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const createMedicine = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = medicineSchema.parse(req.body);
    
    // Periksa apakah obat sudah ada
    const existingMedicine = await prisma.medicine.findFirst({
      where: { 
        name: validatedData.name,
        isDeleted: false
      }
    });
    
    if (existingMedicine) {
      return res.status(409).json({
        success: false,
        message: 'Obat dengan nama tersebut sudah terdaftar dalam sistem'
      });
    }
    
    const medicine = await prisma.medicine.create({
      data: {
        ...validatedData,
        price: Number(validatedData.price), // Konversi ke number
        stock: Number(validatedData.stock), // Konversi ke number
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        stock: true,
        isDeleted: true, // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data obat',
      data: medicine
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
      message: 'Terjadi kesalahan saat menambahkan data obat',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = medicineSchema.partial().parse(req.body);
    
    // Periksa apakah obat ada
    const existingMedicine = await prisma.medicine.findUnique({
      where: { 
        id
      }
    });
    
    if (!existingMedicine || existingMedicine.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    }
    
    // Periksa apakah nama diganti dan nama baru sudah ada
    if (validatedData.name && existingMedicine.name !== validatedData.name) {
      const duplicateName = await prisma.medicine.findFirst({
        where: { 
          name: validatedData.name,
          isDeleted: false
        }
      });
      
      if (duplicateName) {
        return res.status(409).json({
          success: false,
          message: 'Obat dengan nama baru sudah terdaftar dalam sistem'
        });
      }
    }
    
    const medicine = await prisma.medicine.update({
      where: { id },
      data: {
        ...validatedData,
        price: validatedData.price !== undefined ? Number(validatedData.price) : undefined, // Konversi ke number jika diberikan
        stock: validatedData.stock !== undefined ? Number(validatedData.stock) : undefined, // Konversi ke number jika diberikan
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        stock: true,
        isDeleted: true, // Adding this field to the selection
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data obat',
      data: medicine
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
      message: 'Terjadi kesalahan saat memperbarui data obat',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const medicine = await prisma.medicine.findUnique({
      where: { 
        id
      }
    });
    
    if (!medicine || medicine.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    }
    
    // Soft delete
    await prisma.medicine.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data obat'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data obat',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};


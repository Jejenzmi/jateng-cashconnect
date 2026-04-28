import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk inventory item
const inventoryItemSchema = z.object({
  name: z.string().min(1, { message: 'Nama item wajib diisi' }),
  code: z.string().min(1, { message: 'Kode item wajib diisi' }),
  category: z.string().min(1, { message: 'Kategori item wajib diisi' }),
  unit: z.string().min(1, { message: 'Satuan item wajib diisi' }),
  price: z.number().min(0, { message: 'Harga tidak boleh negatif' }),
  stock: z.number().min(0, { message: 'Stok tidak boleh negatif' }),
  minStock: z.number().min(0, { message: 'Stok minimum tidak boleh negatif' }),
  supplierId: z.string().min(1, { message: 'ID supplier wajib diisi' }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const getAllInventoryItems = async (_req: Request, res: Response) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data item inventaris',
      data: inventoryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item inventaris',
      error: (error as Error).message
    });
  }
};

export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
            email: true,
            address: true,
          }
        }
      }
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data item inventaris',
      data: inventoryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item inventaris',
      error: (error as Error).message
    });
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = inventoryItemSchema.parse(req.body);
    
    // Cek apakah supplier ada
    const supplierExists = await prisma.supplier.findUnique({
      where: { id: validatedData.supplierId }
    });
    
    if (!supplierExists) {
      return res.status(404).json({
        success: false,
        message: 'Supplier tidak ditemukan'
      });
    }
    
    // Cek apakah kode sudah digunakan
    const existingCode = await prisma.inventoryItem.findUnique({
      where: { code: validatedData.code }
    });
    
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Kode item sudah digunakan'
      });
    }
    
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        ...validatedData,
        isActive: validatedData.isActive ?? true,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan item inventaris',
      data: inventoryItem
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
      message: 'Terjadi kesalahan saat menambahkan item inventaris',
      error: (error as Error).message
    });
  }
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = inventoryItemSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data item inventaris ada
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id }
    });
    
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    }
    
    // Jika kode diubah, cek apakah sudah digunakan
    if (validatedData.code && validatedData.code !== existingItem.code) {
      const existingCode = await prisma.inventoryItem.findUnique({
        where: { code: validatedData.code }
      });
      
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Kode item sudah digunakan'
        });
      }
    }
    
    // Cek apakah supplier ada
    if (validatedData.supplierId) {
      const supplierExists = await prisma.supplier.findUnique({
        where: { id: validatedData.supplierId }
      });
      
      if (!supplierExists) {
        return res.status(404).json({
          success: false,
          message: 'Supplier tidak ditemukan'
        });
      }
    }
    
    const inventoryItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...validatedData,
        isActive: validatedData.isActive ?? existingItem.isActive,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui item inventaris',
      data: inventoryItem
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
      message: 'Terjadi kesalahan saat memperbarui item inventaris',
      error: (error as Error).message
    });
  }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id }
    });
    
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    }
    
    await prisma.inventoryItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus item inventaris'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus item inventaris',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk pembaruan stok
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, type } = req.body;
    
    if (!quantity || !type) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah dan jenis mutasi stok wajib diisi'
      });
    }
    
    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({
        success: false,
        message: 'Jenis mutasi hanya bisa "in" atau "out"'
      });
    }
    
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id }
    });
    
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    }
    
    let newStock = inventoryItem.stock;
    if (type === 'in') {
      newStock += quantity;
    } else {
      newStock -= quantity;
      // Pastikan stok tidak negatif
      if (newStock < 0) {
        newStock = 0;
      }
    }
    
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        stock: newStock
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: type === 'in' ? 'Stok berhasil ditambahkan' : 'Stok berhasil dikurangi',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui stok item inventaris',
      error: (error as Error).message
    });
  }
};
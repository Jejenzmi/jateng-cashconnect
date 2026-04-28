import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk bill item
const billItemSchema = z.object({
  billId: z.string().min(1, { message: 'ID tagihan wajib diisi' }),
  itemName: z.string().min(1, { message: 'Nama item wajib diisi' }),
  quantity: z.number().min(1, { message: 'Jumlah harus lebih besar dari 0' }),
  unitPrice: z.number().min(0, { message: 'Harga satuan tidak boleh negatif' }),
  totalPrice: z.number().min(0, { message: 'Total harga tidak boleh negatif' }),
  notes: z.string().optional(),
});

export const getAllBillItems = async (_req: Request, res: Response) => {
  try {
    const billItems = await prisma.billItem.findMany({
      include: {
        bill: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data item tagihan',
      data: billItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item tagihan',
      error: (error as Error).message
    });
  }
};

export const getBillItemByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const billItem = await prisma.billItem.findUnique({
      where: { id },
      include: {
        bill: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
                nik: true,
                phone: true,
                address: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            }
          }
        }
      }
    });

    if (!billItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data item tagihan',
      data: billItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item tagihan',
      error: (error as Error).message
    });
  }
};

export const createBillItem = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = billItemSchema.parse(req.body);
    
    // Cek apakah tagihan ada
    const billExists = await prisma.bill.findUnique({
      where: { id: validatedData.billId }
    });
    
    if (!billExists) {
      return res.status(404).json({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    }
    
    // Hitung total harga jika tidak disediakan
    const calculatedTotalPrice = validatedData.totalPrice || 
                                (validatedData.quantity * validatedData.unitPrice);
    
    // Validasi bahwa total harga = quantity * unitPrice
    if (calculatedTotalPrice !== validatedData.quantity * validatedData.unitPrice) {
      return res.status(400).json({
        success: false,
        message: 'Total harga harus sama dengan jumlah dikali harga satuan'
      });
    }
    
    const billItem = await prisma.billItem.create({
      data: {
        ...validatedData,
        totalPrice: calculatedTotalPrice,
        notes: validatedData.notes || '',
      },
      include: {
        bill: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            }
          }
        }
      }
    });

    // Update total amount pada bill
    const allBillItems = await prisma.billItem.findMany({
      where: { billId: validatedData.billId }
    });
    
    const totalAmount = allBillItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    await prisma.bill.update({
      where: { id: validatedData.billId },
      data: {
        totalAmount: totalAmount,
        finalAmount: totalAmount - (billExists.discountAmount || 0)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan item tagihan',
      data: billItem
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
      message: 'Terjadi kesalahan saat menambahkan item tagihan',
      error: (error as Error).message
    });
  }
};

export const updateBillItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = billItemSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data item tagihan ada
    const existingItem = await prisma.billItem.findUnique({
      where: { id }
    });
    
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    }
    
    // Validasi bill jika di-update
    if (validatedData.billId) {
      const billExists = await prisma.bill.findUnique({
        where: { id: validatedData.billId }
      });
      
      if (!billExists) {
        return res.status(404).json({
          success: false,
          message: 'Tagihan tidak ditemukan'
        });
      }
    }
    
    // Hitung total harga jika quantity atau unitPrice diubah
    const updatedQuantity = validatedData.quantity !== undefined ? 
                           validatedData.quantity : existingItem.quantity;
    const updatedUnitPrice = validatedData.unitPrice !== undefined ? 
                            validatedData.unitPrice : existingItem.unitPrice;
    
    const calculatedTotalPrice = validatedData.totalPrice || 
                                (updatedQuantity * updatedUnitPrice);
    
    // Validasi bahwa total harga = quantity * unitPrice
    if (calculatedTotalPrice !== updatedQuantity * updatedUnitPrice) {
      return res.status(400).json({
        success: false,
        message: 'Total harga harus sama dengan jumlah dikali harga satuan'
      });
    }
    
    const billItem = await prisma.billItem.update({
      where: { id },
      data: {
        ...validatedData,
        totalPrice: calculatedTotalPrice,
        notes: validatedData.notes || existingItem.notes,
      },
      include: {
        bill: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            }
          }
        }
      }
    });

    // Update total amount pada bill
    const allBillItems = await prisma.billItem.findMany({
      where: { billId: billItem.billId }
    });
    
    const totalAmount = allBillItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    await prisma.bill.update({
      where: { id: billItem.billId },
      data: {
        totalAmount: totalAmount,
        finalAmount: totalAmount - (billItem.bill.discountAmount || 0)
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui item tagihan',
      data: billItem
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
      message: 'Terjadi kesalahan saat memperbarui item tagihan',
      error: (error as Error).message
    });
  }
};

export const deleteBillItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const billItem = await prisma.billItem.findUnique({
      where: { id }
    });
    
    if (!billItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    }
    
    await prisma.billItem.delete({
      where: { id }
    });

    // Update total amount pada bill
    const allBillItems = await prisma.billItem.findMany({
      where: { billId: billItem.billId }
    });
    
    const totalAmount = allBillItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    await prisma.bill.update({
      where: { id: billItem.billId },
      data: {
        totalAmount: totalAmount,
        finalAmount: totalAmount - (billItem.bill.discountAmount || 0)
      }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus item tagihan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus item tagihan',
      error: (error as Error).message
    });
  }
};
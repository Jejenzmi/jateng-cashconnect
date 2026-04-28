import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk billing
const billSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  visitId: z.string().optional(),
  items: z.array(
    z.object({
      itemName: z.string().min(1, { message: 'Nama item wajib diisi' }),
      quantity: z.number().int().positive({ message: 'Jumlah harus angka positif' }),
      unitPrice: z.number().positive({ message: 'Harga satuan harus lebih dari 0' }),
      totalPrice: z.number().positive({ message: 'Total harga harus lebih dari 0' }),
      notes: z.string().optional(),
    })
  ),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const getAllBills = async (_req: Request, res: Response) => {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
          }
        },
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data tagihan',
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tagihan',
      error: (error as Error).message
    });
  }
};

export const getBillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            medicalRecordNumber: true,
          }
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
          }
        },
        items: true
      }
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data tagihan',
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tagihan',
      error: (error as Error).message
    });
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = billSchema.parse(req.body);
    
    // Cek apakah pasien ada
    const patientExists = await prisma.patient.findUnique({
      where: { id: validatedData.patientId }
    });
    
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }
    
    // Jika visitId disediakan, cek apakah kunjungan ada
    if (validatedData.visitId) {
      const visitExists = await prisma.visit.findUnique({
        where: { id: validatedData.visitId }
      });
      
      if (!visitExists) {
        return res.status(404).json({
          success: false,
          message: 'Kunjungan tidak ditemukan'
        });
      }
    }
    
    // Hitung total amount dan final amount
    const totalAmount = validatedData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = validatedData.discountAmount || 
                           (validatedData.discountPercent ? totalAmount * (validatedData.discountPercent / 100) : 0);
    const finalAmount = totalAmount - discountAmount;
    
    const bill = await prisma.$transaction(async (tx) => {
      // Buat tagihan utama
      const newBill = await tx.bill.create({
        data: {
          patientId: validatedData.patientId,
          visitId: validatedData.visitId,
          totalAmount,
          discountPercent: validatedData.discountPercent || 0,
          discountAmount,
          finalAmount,
          notes: validatedData.notes,
          paymentStatus: 'unpaid',
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          items: true
        }
      });
      
      // Buat item-item tagihan
      for (const item of validatedData.items) {
        await tx.billItem.create({
          data: {
            billId: newBill.id,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            notes: item.notes,
          }
        });
      }
      
      // Ambil ulang data bill dengan item-itemnya
      return await tx.bill.findUnique({
        where: { id: newBill.id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          items: true
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data tagihan',
      data: bill
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
      message: 'Terjadi kesalahan saat menambahkan data tagihan',
      error: (error as Error).message
    });
  }
};

export const updateBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = billSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah tagihan ada
    const existingBill = await prisma.bill.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!existingBill) {
      return res.status(404).json({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    }
    
    // Jika visitId disediakan, cek apakah kunjungan ada
    if (validatedData.visitId) {
      const visitExists = await prisma.visit.findUnique({
        where: { id: validatedData.visitId }
      });
      
      if (!visitExists) {
        return res.status(404).json({
          success: false,
          message: 'Kunjungan tidak ditemukan'
        });
      }
    }
    
    // Hitung total amount dan final amount
    const totalAmount = validatedData.items ? 
      validatedData.items.reduce((sum, item) => sum + item.totalPrice, 0) : 
      existingBill.totalAmount.toNumber();
    const discountAmount = validatedData.discountAmount || 
                           (validatedData.discountPercent ? totalAmount * (validatedData.discountPercent / 100) : existingBill.discountAmount.toNumber());
    const finalAmount = totalAmount - discountAmount;
    
    const updatedBill = await prisma.$transaction(async (tx) => {
      // Update tagihan utama
      const updatedMainBill = await tx.bill.update({
        where: { id },
        data: {
          visitId: validatedData.visitId || existingBill.visitId,
          totalAmount,
          discountPercent: validatedData.discountPercent || 0,
          discountAmount,
          finalAmount,
          notes: validatedData.notes,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          items: true
        }
      });
      
      // Jika items disediakan, hapus items lama dan buat yang baru
      if (validatedData.items) {
        // Hapus item lama
        await tx.billItem.deleteMany({
          where: { billId: id }
        });
        
        // Buat item baru
        for (const item of validatedData.items) {
          await tx.billItem.create({
            data: {
              billId: id,
              itemName: item.itemName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              notes: item.notes,
            }
          });
        }
      }
      
      // Ambil ulang data bill dengan item-itemnya
      return await tx.bill.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          items: true
        }
      });
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data tagihan',
      data: updatedBill
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
      message: 'Terjadi kesalahan saat memperbarui data tagihan',
      error: (error as Error).message
    });
  }
};

export const deleteBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bill = await prisma.bill.findUnique({
      where: { id }
    });
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    }
    
    // Hapus item-tagihan terlebih dahulu karena constraint foreign key
    await prisma.billItem.deleteMany({
      where: { billId: id }
    });
    
    await prisma.bill.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data tagihan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data tagihan',
      error: (error as Error).message
    });
  }
};

// Endpoint untuk memperbarui status pembayaran
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = req.body;
    
    const validStatuses = ['unpaid', 'partially_paid', 'paid'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status pembayaran tidak valid'
      });
    }
    
    const validMethods = ['cash', 'card', 'transfer', 'insurance', 'bpjs'];
    if (paymentMethod && !validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Metode pembayaran tidak valid'
      });
    }
    
    const bill = await prisma.bill.findUnique({
      where: { id }
    });
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    }
    
    const updatedBill = await prisma.bill.update({
      where: { id },
      data: {
        paymentStatus,
        paymentMethod: paymentMethod || bill.paymentMethod,
        paidAt: paymentStatus === 'paid' ? new Date() : bill.paidAt,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
          }
        },
        items: true
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui status pembayaran',
      data: updatedBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status pembayaran',
      error: (error as Error).message
    });
  }
};
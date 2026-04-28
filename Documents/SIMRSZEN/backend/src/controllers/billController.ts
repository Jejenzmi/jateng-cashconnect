import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk bill
const billSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  visitId: z.string().min(1, { message: 'ID kunjungan wajib diisi' }),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  paymentStatus: z.enum(['pending', 'partial', 'paid', 'cancelled']).default('pending'),
  paymentMethod: z.string().optional(),
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
            medicalRecordNumber: true,
          }
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
          }
        },
        items: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            notes: true,
          }
        }
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

export const getBillByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bill = await prisma.bill.findUnique({
      where: { id },
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
        },
        items: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            notes: true,
          }
        }
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
    
    // Cek apakah kunjungan ada
    const visitExists = await prisma.visit.findUnique({
      where: { id: validatedData.visitId }
    });
    
    if (!visitExists) {
      return res.status(404).json({
        success: false,
        message: 'Kunjungan tidak ditemukan'
      });
    }
    
    // Hitung total diskon
    const discountAmount = validatedData.discountAmount || 0;
    const discountPercent = validatedData.discountPercent || 0;
    
    // Buat tagihan
    const bill = await prisma.bill.create({
      data: {
        ...validatedData,
        totalAmount: 0, // Akan dihitung ulang ketika item ditambahkan
        discountAmount: discountAmount,
        discountPercent: discountPercent,
        finalAmount: 0, // Akan dihitung ulang ketika item ditambahkan
        paymentStatus: validatedData.paymentStatus || 'pending',
        paymentMethod: validatedData.paymentMethod || null,
        notes: validatedData.notes || '',
      },
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
        },
        items: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            notes: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan tagihan',
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
      message: 'Terjadi kesalahan saat menambahkan tagihan',
      error: (error as Error).message
    });
  }
};

export const updateBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = billSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data tagihan ada
    const existingBill = await prisma.bill.findUnique({
      where: { id }
    });
    
    if (!existingBill) {
      return res.status(404).json({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    }
    
    // Validasi pasien jika di-update
    if (validatedData.patientId) {
      const patientExists = await prisma.patient.findUnique({
        where: { id: validatedData.patientId }
      });
      
      if (!patientExists) {
        return res.status(404).json({
          success: false,
          message: 'Pasien tidak ditemukan'
        });
      }
    }
    
    // Validasi kunjungan jika di-update
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
    
    const bill = await prisma.bill.update({
      where: { id },
      data: {
        ...validatedData,
        discountAmount: validatedData.discountAmount || existingBill.discountAmount,
        discountPercent: validatedData.discountPercent || existingBill.discountPercent,
        paymentStatus: validatedData.paymentStatus || existingBill.paymentStatus,
        paymentMethod: validatedData.paymentMethod || existingBill.paymentMethod,
        notes: validatedData.notes || existingBill.notes,
      },
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
        },
        items: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            notes: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui tagihan',
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
      message: 'Terjadi kesalahan saat memperbarui tagihan',
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
    
    // Hapus item-item tagihan terlebih dahulu
    await prisma.billItem.deleteMany({
      where: { billId: id }
    });
    
    await prisma.bill.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus tagihan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus tagihan',
      error: (error as Error).message
    });
  }
};
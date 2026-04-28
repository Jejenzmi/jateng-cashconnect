import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk prescription item
const prescriptionItemSchema = z.object({
  prescriptionId: z.string().min(1, { message: 'ID resep wajib diisi' }),
  medicineId: z.string().min(1, { message: 'ID obat wajib diisi' }),
  quantity: z.number().min(1, { message: 'Jumlah harus lebih besar dari 0' }),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export const getAllPrescriptionItems = async (_req: Request, res: Response) => {
  try {
    const prescriptionItems = await prisma.prescriptionItem.findMany({
      include: {
        prescription: {
          include: {
            visit: {
              include: {
                patient: {
                  select: {
                    id: true,
                    name: true,
                    medicalRecordNumber: true,
                  }
                }
              }
            }
          }
        },
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data item resep obat',
      data: prescriptionItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item resep obat',
      error: (error as Error).message
    });
  }
};

export const getPrescriptionItemByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const prescriptionItem = await prisma.prescriptionItem.findUnique({
      where: { id },
      include: {
        prescription: {
          include: {
            visit: {
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
                doctor: {
                  select: {
                    id: true,
                    fullName: true,
                    specialization: true,
                  }
                }
              }
            }
          }
        },
        medicine: {
          select: {
            id: true,
            name: true,
            genericName: true,
            dosageForm: true,
            strength: true,
            manufacturer: true,
            price: true,
            stock: true,
            unit: true,
          }
        }
      }
    });

    if (!prescriptionItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data item resep obat',
      data: prescriptionItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data item resep obat',
      error: (error as Error).message
    });
  }
};

export const createPrescriptionItem = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = prescriptionItemSchema.parse(req.body);
    
    // Cek apakah resep obat ada
    const prescriptionExists = await prisma.prescription.findUnique({
      where: { id: validatedData.prescriptionId }
    });
    
    if (!prescriptionExists) {
      return res.status(404).json({
        success: false,
        message: 'Resep obat tidak ditemukan'
      });
    }
    
    // Cek apakah obat ada
    const medicineExists = await prisma.medicine.findUnique({
      where: { id: validatedData.medicineId }
    });
    
    if (!medicineExists) {
      return res.status(404).json({
        success: false,
        message: 'Obat tidak ditemukan'
      });
    }
    
    // Cek stok obat
    if (medicineExists.stock < validatedData.quantity) {
      return res.status(400).json({
        success: false,
        message: `Stok obat tidak mencukupi. Tersedia: ${medicineExists.stock}, Diminta: ${validatedData.quantity}`
      });
    }
    
    // Kurangi stok obat
    await prisma.medicine.update({
      where: { id: validatedData.medicineId },
      data: {
        stock: {
          decrement: validatedData.quantity
        }
      }
    });
    
    const prescriptionItem = await prisma.prescriptionItem.create({
      data: {
        ...validatedData,
        dosage: validatedData.dosage || '',
        frequency: validatedData.frequency || '',
        duration: validatedData.duration || 0,
      },
      include: {
        prescription: {
          include: {
            visit: {
              include: {
                patient: {
                  select: {
                    id: true,
                    name: true,
                    medicalRecordNumber: true,
                  }
                }
              }
            }
          }
        },
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan item resep obat',
      data: prescriptionItem
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
      message: 'Terjadi kesalahan saat menambahkan item resep obat',
      error: (error as Error).message
    });
  }
};

export const updatePrescriptionItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = prescriptionItemSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data item resep obat ada
    const existingItem = await prisma.prescriptionItem.findUnique({
      where: { id }
    });
    
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    }
    
    // Validasi resep dan obat jika di-update
    if (validatedData.prescriptionId) {
      const prescriptionExists = await prisma.prescription.findUnique({
        where: { id: validatedData.prescriptionId }
      });
      
      if (!prescriptionExists) {
        return res.status(404).json({
          success: false,
          message: 'Resep obat tidak ditemukan'
        });
      }
    }
    
    if (validatedData.medicineId) {
      const medicineExists = await prisma.medicine.findUnique({
        where: { id: validatedData.medicineId }
      });
      
      if (!medicineExists) {
        return res.status(404).json({
          success: false,
          message: 'Obat tidak ditemukan'
        });
      }
    }
    
    // Hitung perubahan jumlah untuk penyesuaian stok
    let quantityDifference = 0;
    if (validatedData.quantity !== undefined) {
      quantityDifference = validatedData.quantity - existingItem.quantity;
      
      // Cek stok jika jumlah bertambah
      if (quantityDifference > 0) {
        const currentMedicine = await prisma.medicine.findUnique({
          where: { id: existingItem.medicineId }
        });
        
        if (currentMedicine && currentMedicine.stock < quantityDifference) {
          return res.status(400).json({
            success: false,
            message: `Stok obat tidak mencukupi. Tersedia: ${currentMedicine.stock}, Diminta tambahan: ${quantityDifference}`
          });
        }
      }
      
      // Sesuaikan stok obat
      await prisma.medicine.update({
        where: { id: existingItem.medicineId },
        data: {
          stock: {
            increment: -quantityDifference // Tambahkan nilai negatif jika jumlah berkurang
          }
        }
      });
    }
    
    const prescriptionItem = await prisma.prescriptionItem.update({
      where: { id },
      data: {
        ...validatedData,
        dosage: validatedData.dosage || existingItem.dosage,
        frequency: validatedData.frequency || existingItem.frequency,
        duration: validatedData.duration || existingItem.duration,
      },
      include: {
        prescription: {
          include: {
            visit: {
              include: {
                patient: {
                  select: {
                    id: true,
                    name: true,
                    medicalRecordNumber: true,
                  }
                }
              }
            }
          }
        },
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui item resep obat',
      data: prescriptionItem
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
      message: 'Terjadi kesalahan saat memperbarui item resep obat',
      error: (error as Error).message
    });
  }
};

export const deletePrescriptionItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const prescriptionItem = await prisma.prescriptionItem.findUnique({
      where: { id }
    });
    
    if (!prescriptionItem) {
      return res.status(404).json({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    }
    
    // Kembalikan stok obat
    await prisma.medicine.update({
      where: { id: prescriptionItem.medicineId },
      data: {
        stock: {
          increment: prescriptionItem.quantity
        }
      }
    });
    
    await prisma.prescriptionItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus item resep obat'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus item resep obat',
      error: (error as Error).message
    });
  }
};
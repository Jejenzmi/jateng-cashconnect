import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk laboratory result
const laboratoryResultSchema = z.object({
  orderId: z.string().min(1, { message: 'ID pesanan wajib diisi' }),
  result: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'verified'], { message: 'Status tidak valid' }),
});

export const getAllLaboratoryResults = async (_req: Request, res: Response) => {
  try {
    const laboratoryResults = await prisma.laboratoryResult.findMany({
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            },
            test: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            },
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data hasil laboratorium',
      data: laboratoryResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hasil laboratorium',
      error: (error as Error).message
    });
  }
};

export const getLaboratoryResultByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const laboratoryResult = await prisma.laboratoryResult.findUnique({
      where: { id },
      include: {
        order: {
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
                phone: true,
                email: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            },
            test: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
                normalValues: true,
                sampleType: true,
                preparation: true,
              }
            },
          }
        }
      }
    });

    if (!laboratoryResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data hasil laboratorium',
      data: laboratoryResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hasil laboratorium',
      error: (error as Error).message
    });
  }
};

export const createLaboratoryResult = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = laboratoryResultSchema.parse(req.body);
    
    // Cek apakah pesanan laboratorium ada
    const orderExists = await prisma.laboratoryOrder.findUnique({
      where: { id: validatedData.orderId }
    });
    
    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan laboratorium tidak ditemukan'
      });
    }
    
    // Cek apakah sudah ada hasil untuk pesanan ini
    const existingResult = await prisma.laboratoryResult.findFirst({
      where: { orderId: validatedData.orderId }
    });
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Hasil untuk pesanan ini sudah ada'
      });
    }
    
    const laboratoryResult = await prisma.laboratoryResult.create({
      data: {
        ...validatedData,
        status: validatedData.status || 'pending',
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            },
            test: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            },
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan hasil laboratorium',
      data: laboratoryResult
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
      message: 'Terjadi kesalahan saat menambahkan hasil laboratorium',
      error: (error as Error).message
    });
  }
};

export const updateLaboratoryResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = laboratoryResultSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data hasil laboratorium ada
    const existingResult = await prisma.laboratoryResult.findUnique({
      where: { id }
    });
    
    if (!existingResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    }
    
    // Validasi pesanan jika di-update
    if (validatedData.orderId) {
      const orderExists = await prisma.laboratoryOrder.findUnique({
        where: { id: validatedData.orderId }
      });
      
      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: 'Pesanan laboratorium tidak ditemukan'
        });
      }
    }
    
    const laboratoryResult = await prisma.laboratoryResult.update({
      where: { id },
      data: {
        ...validatedData,
        status: validatedData.status || existingResult.status,
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            },
            test: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            },
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui hasil laboratorium',
      data: laboratoryResult
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
      message: 'Terjadi kesalahan saat memperbarui hasil laboratorium',
      error: (error as Error).message
    });
  }
};

export const deleteLaboratoryResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const laboratoryResult = await prisma.laboratoryResult.findUnique({
      where: { id }
    });
    
    if (!laboratoryResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    }
    
    await prisma.laboratoryResult.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus hasil laboratorium'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus hasil laboratorium',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk verifikasi hasil
export const verifyLaboratoryResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const laboratoryResult = await prisma.laboratoryResult.findUnique({
      where: { id }
    });
    
    if (!laboratoryResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    }
    
    // Hanya bisa memverifikasi hasil yang sudah selesai
    if (laboratoryResult.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Hanya hasil dengan status completed yang bisa diverifikasi'
      });
    }
    
    const updatedResult = await prisma.laboratoryResult.update({
      where: { id },
      data: {
        status: 'verified',
        resultDate: new Date()
      },
      include: {
        order: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                medicalRecordNumber: true,
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              }
            },
            visit: {
              select: {
                id: true,
                visitNumber: true,
              }
            },
            test: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            },
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Hasil laboratorium berhasil diverifikasi',
      data: updatedResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memverifikasi hasil laboratorium',
      error: (error as Error).message
    });
  }
};
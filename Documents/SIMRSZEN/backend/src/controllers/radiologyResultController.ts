import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk radiology result
const radiologyResultSchema = z.object({
  orderId: z.string().min(1, { message: 'ID pesanan wajib diisi' }),
  result: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'verified'], { message: 'Status tidak valid' }),
});

export const getAllRadiologyResults = async (_req: Request, res: Response) => {
  try {
    const radiologyResults = await prisma.radiologyResult.findMany({
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
            exam: {
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
      message: 'Berhasil mengambil data hasil radiologi',
      data: radiologyResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hasil radiologi',
      error: (error as Error).message
    });
  }
};

export const getRadiologyResultByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const radiologyResult = await prisma.radiologyResult.findUnique({
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
            exam: {
              select: {
                id: true,
                name: true,
                code: true,
                category: true,
                description: true,
                preparation: true,
                contraindications: true,
              }
            },
          }
        }
      }
    });

    if (!radiologyResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data hasil radiologi',
      data: radiologyResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hasil radiologi',
      error: (error as Error).message
    });
  }
};

export const createRadiologyResult = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = radiologyResultSchema.parse(req.body);
    
    // Cek apakah pesanan radiologi ada
    const orderExists = await prisma.radiologyOrder.findUnique({
      where: { id: validatedData.orderId }
    });
    
    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan radiologi tidak ditemukan'
      });
    }
    
    // Cek apakah sudah ada hasil untuk pesanan ini
    const existingResult = await prisma.radiologyResult.findFirst({
      where: { orderId: validatedData.orderId }
    });
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Hasil untuk pesanan ini sudah ada'
      });
    }
    
    const radiologyResult = await prisma.radiologyResult.create({
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
            exam: {
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
      message: 'Berhasil menambahkan hasil radiologi',
      data: radiologyResult
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
      message: 'Terjadi kesalahan saat menambahkan hasil radiologi',
      error: (error as Error).message
    });
  }
};

export const updateRadiologyResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = radiologyResultSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data hasil radiologi ada
    const existingResult = await prisma.radiologyResult.findUnique({
      where: { id }
    });
    
    if (!existingResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    }
    
    // Validasi pesanan jika di-update
    if (validatedData.orderId) {
      const orderExists = await prisma.radiologyOrder.findUnique({
        where: { id: validatedData.orderId }
      });
      
      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: 'Pesanan radiologi tidak ditemukan'
        });
      }
    }
    
    const radiologyResult = await prisma.radiologyResult.update({
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
            exam: {
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
      message: 'Berhasil memperbarui hasil radiologi',
      data: radiologyResult
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
      message: 'Terjadi kesalahan saat memperbarui hasil radiologi',
      error: (error as Error).message
    });
  }
};

export const deleteRadiologyResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const radiologyResult = await prisma.radiologyResult.findUnique({
      where: { id }
    });
    
    if (!radiologyResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    }
    
    await prisma.radiologyResult.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus hasil radiologi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus hasil radiologi',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk verifikasi hasil
export const verifyRadiologyResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const radiologyResult = await prisma.radiologyResult.findUnique({
      where: { id }
    });
    
    if (!radiologyResult) {
      return res.status(404).json({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    }
    
    // Hanya bisa memverifikasi hasil yang sudah selesai
    if (radiologyResult.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Hanya hasil dengan status completed yang bisa diverifikasi'
      });
    }
    
    const updatedResult = await prisma.radiologyResult.update({
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
            exam: {
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
      message: 'Hasil radiologi berhasil diverifikasi',
      data: updatedResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memverifikasi hasil radiologi',
      error: (error as Error).message
    });
  }
};
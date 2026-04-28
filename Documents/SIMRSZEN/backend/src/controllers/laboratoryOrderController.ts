import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk laboratory order
const laboratoryOrderSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  visitId: z.string().min(1, { message: 'ID kunjungan wajib diisi' }),
  testId: z.string().min(1, { message: 'ID tes laboratorium wajib diisi' }),
  notes: z.string().optional(),
  priority: z.enum(['routine', 'urgent', 'stat'], { message: 'Prioritas tidak valid' }),
});

export const getAllLaboratoryOrders = async (_req: Request, res: Response) => {
  try {
    const laboratoryOrders = await prisma.laboratoryOrder.findMany({
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
        result: {
          select: {
            id: true,
            status: true,
            resultDate: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data pesanan laboratorium',
      data: laboratoryOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan laboratorium',
      error: (error as Error).message
    });
  }
};

export const getLaboratoryOrderByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const laboratoryOrder = await prisma.laboratoryOrder.findUnique({
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
        result: {
          select: {
            id: true,
            result: true,
            notes: true,
            status: true,
            resultDate: true,
          }
        }
      }
    });

    if (!laboratoryOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data pesanan laboratorium',
      data: laboratoryOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan laboratorium',
      error: (error as Error).message
    });
  }
};

export const createLaboratoryOrder = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = laboratoryOrderSchema.parse(req.body);
    
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
    
    // Cek apakah dokter ada
    const doctorExists = await prisma.doctor.findUnique({
      where: { id: validatedData.doctorId }
    });
    
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan'
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
    
    // Cek apakah tes laboratorium ada
    const testExists = await prisma.laboratoryTest.findUnique({
      where: { id: validatedData.testId }
    });
    
    if (!testExists) {
      return res.status(404).json({
        success: false,
        message: 'Tes laboratorium tidak ditemukan'
      });
    }
    
    const laboratoryOrder = await prisma.laboratoryOrder.create({
      data: {
        ...validatedData,
        priority: validatedData.priority || 'routine',
      },
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
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan pesanan laboratorium',
      data: laboratoryOrder
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
      message: 'Terjadi kesalahan saat menambahkan pesanan laboratorium',
      error: (error as Error).message
    });
  }
};

export const updateLaboratoryOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = laboratoryOrderSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data pesanan laboratorium ada
    const existingOrder = await prisma.laboratoryOrder.findUnique({
      where: { id }
    });
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    }
    
    // Validasi referensi hanya jika field di-update
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
    
    if (validatedData.doctorId) {
      const doctorExists = await prisma.doctor.findUnique({
        where: { id: validatedData.doctorId }
      });
      
      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Dokter tidak ditemukan'
        });
      }
    }
    
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
    
    if (validatedData.testId) {
      const testExists = await prisma.laboratoryTest.findUnique({
        where: { id: validatedData.testId }
      });
      
      if (!testExists) {
        return res.status(404).json({
          success: false,
          message: 'Tes laboratorium tidak ditemukan'
        });
      }
    }
    
    const laboratoryOrder = await prisma.laboratoryOrder.update({
      where: { id },
      data: {
        ...validatedData,
        priority: validatedData.priority || existingOrder.priority,
      },
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
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui pesanan laboratorium',
      data: laboratoryOrder
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
      message: 'Terjadi kesalahan saat memperbarui pesanan laboratorium',
      error: (error as Error).message
    });
  }
};

export const deleteLaboratoryOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const laboratoryOrder = await prisma.laboratoryOrder.findUnique({
      where: { id }
    });
    
    if (!laboratoryOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    }
    
    // Cek apakah sudah ada hasil
    const existingResult = await prisma.laboratoryResult.findFirst({
      where: { orderId: id }
    });
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus pesanan yang sudah memiliki hasil'
      });
    }
    
    await prisma.laboratoryOrder.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus pesanan laboratorium'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pesanan laboratorium',
      error: (error as Error).message
    });
  }
};
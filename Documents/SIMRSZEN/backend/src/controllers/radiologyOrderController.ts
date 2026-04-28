import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk radiology order
const radiologyOrderSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  visitId: z.string().min(1, { message: 'ID kunjungan wajib diisi' }),
  examId: z.string().min(1, { message: 'ID pemeriksaan radiologi wajib diisi' }),
  notes: z.string().optional(),
  priority: z.enum(['routine', 'urgent', 'stat'], { message: 'Prioritas tidak valid' }),
});

export const getAllRadiologyOrders = async (_req: Request, res: Response) => {
  try {
    const radiologyOrders = await prisma.radiologyOrder.findMany({
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
      message: 'Berhasil mengambil data pesanan radiologi',
      data: radiologyOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan radiologi',
      error: (error as Error).message
    });
  }
};

export const getRadiologyOrderByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const radiologyOrder = await prisma.radiologyOrder.findUnique({
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

    if (!radiologyOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data pesanan radiologi',
      data: radiologyOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pesanan radiologi',
      error: (error as Error).message
    });
  }
};

export const createRadiologyOrder = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = radiologyOrderSchema.parse(req.body);
    
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
    
    // Cek apakah pemeriksaan radiologi ada
    const examExists = await prisma.radiologyExam.findUnique({
      where: { id: validatedData.examId }
    });
    
    if (!examExists) {
      return res.status(404).json({
        success: false,
        message: 'Pemeriksaan radiologi tidak ditemukan'
      });
    }
    
    const radiologyOrder = await prisma.radiologyOrder.create({
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
        exam: {
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
      message: 'Berhasil menambahkan pesanan radiologi',
      data: radiologyOrder
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
      message: 'Terjadi kesalahan saat menambahkan pesanan radiologi',
      error: (error as Error).message
    });
  }
};

export const updateRadiologyOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = radiologyOrderSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data pesanan radiologi ada
    const existingOrder = await prisma.radiologyOrder.findUnique({
      where: { id }
    });
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
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
    
    if (validatedData.examId) {
      const examExists = await prisma.radiologyExam.findUnique({
        where: { id: validatedData.examId }
      });
      
      if (!examExists) {
        return res.status(404).json({
          success: false,
          message: 'Pemeriksaan radiologi tidak ditemukan'
        });
      }
    }
    
    const radiologyOrder = await prisma.radiologyOrder.update({
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
        exam: {
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
      message: 'Berhasil memperbarui pesanan radiologi',
      data: radiologyOrder
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
      message: 'Terjadi kesalahan saat memperbarui pesanan radiologi',
      error: (error as Error).message
    });
  }
};

export const deleteRadiologyOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const radiologyOrder = await prisma.radiologyOrder.findUnique({
      where: { id }
    });
    
    if (!radiologyOrder) {
      return res.status(404).json({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
      });
    }
    
    // Cek apakah sudah ada hasil
    const existingResult = await prisma.radiologyResult.findFirst({
      where: { orderId: id }
    });
    
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus pesanan yang sudah memiliki hasil'
      });
    }
    
    await prisma.radiologyOrder.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus pesanan radiologi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pesanan radiologi',
      error: (error as Error).message
    });
  }
};
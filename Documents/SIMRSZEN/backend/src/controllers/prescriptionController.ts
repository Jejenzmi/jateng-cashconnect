import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk prescription
const prescriptionSchema = z.object({
  visitId: z.string().min(1, { message: 'ID kunjungan wajib diisi' }),
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  status: z.enum(['pending', 'dispensed', 'completed'], { message: 'Status resep tidak valid' }).optional(),
  notes: z.string().optional(),
});

export const getAllPrescriptions = async (_req: Request, res: Response) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        visit: {
          select: {
            id: true,
            visitNumber: true,
            status: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            nip: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                unit: true,
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
      message: 'Berhasil mengambil data resep',
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data resep',
      error: (error as Error).message
    });
  }
};

export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        visit: {
          select: {
            id: true,
            visitNumber: true,
            status: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            nip: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Data resep tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data resep',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data resep',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const createPrescription = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = prescriptionSchema.parse(req.body);
    
    // Periksa apakah kunjungan dan dokter ada
    const [visit, doctor] = await Promise.all([
      prisma.visit.findUnique({ where: { id: validatedData.visitId } }),
      prisma.user.findUnique({ where: { id: validatedData.doctorId } })
    ]);
    
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Kunjungan tidak ditemukan'
      });
    }
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    }
    
    const prescription = await prisma.prescription.create({
      data: {
        ...validatedData,
        status: validatedData.status || 'pending',
        items: {
          create: []
        }
      },
      include: {
        visit: {
          select: {
            id: true,
            visitNumber: true,
            status: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            nip: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan resep',
      data: prescription
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
      message: 'Terjadi kesalahan saat menambahkan resep',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = prescriptionSchema.partial().parse(req.body);
    
    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        ...validatedData,
      },
      include: {
        visit: {
          select: {
            id: true,
            visitNumber: true,
            status: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            nip: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui resep',
      data: prescription
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
      message: 'Terjadi kesalahan saat memperbarui resep',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.prescription.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus resep'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus resep',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const updatePrescriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'dispensed', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status resep tidak valid'
      });
    }
    
    const prescription = await prisma.prescription.update({
      where: { id },
      data: { status },
      include: {
        visit: {
          select: {
            id: true,
            visitNumber: true,
            status: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            nip: true,
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                unit: true,
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui status resep',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status resep',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk visit
const visitSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  roomId: z.string().min(1, { message: 'ID ruangan wajib diisi' }),
  complaint: z.string().min(1, { message: 'Keluhan wajib diisi' }), // Changed from chiefComplaint to complaint
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['registered', 'in_progress', 'completed', 'cancelled'], { message: 'Status tidak valid' }).optional(),
});

export const getAllVisits = async (_req: Request, res: Response) => {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Changed from visitDate to createdAt since it doesn't exist
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data kunjungan pasien',
      data: visits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kunjungan pasien',
      error: (error as Error).message
    });
  }
};

export const getVisitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            medicalRecordNumber: true,
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: true
              }
            }
          }
        },
        labOrders: true,
      }
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Data kunjungan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data kunjungan',
      data: visit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kunjungan',
      error: (error as Error).message
    });
  }
  return;
};

export const createVisit = async (req: Request, res: Response) => {
  try {
    const validatedData = visitSchema.parse(req.body);
    
    // Cek apakah pasien, dokter, dan ruangan tersedia
    const [patient, doctor, room] = await Promise.all([
      prisma.patient.findUnique({ where: { id: validatedData.patientId } }),
      prisma.user.findUnique({ where: { id: validatedData.doctorId } }),
      prisma.room.findUnique({ where: { id: validatedData.roomId } })
    ]);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    }
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    }
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Ruangan tidak ditemukan'
      });
    }
    
    // Generate nomor kunjungan unik
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const latestVisit = await prisma.visit.findFirst({
      where: {
        visitNumber: {
          startsWith: `VIS-${dateStr}-`
        }
      },
      orderBy: {
        visitNumber: 'desc'
      }
    });
    
    let nextNumber = 1;
    if (latestVisit && latestVisit.visitNumber) {
      const lastNumber = parseInt(latestVisit.visitNumber.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }
    
    const visitNumber = `VIS-${dateStr}-${nextNumber.toString().padStart(4, '0')}`;
    
    const visit = await prisma.visit.create({
      data: {
        patientId: validatedData.patientId,
        doctorId: validatedData.doctorId,
        roomId: validatedData.roomId,
        complaint: validatedData.complaint,
        diagnosis: validatedData.diagnosis,
        notes: validatedData.notes,
        visitNumber,
        status: validatedData.status || 'registered',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data kunjungan',
      data: visit
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
      message: 'Terjadi kesalahan saat menambahkan data kunjungan',
      error: (error as Error).message
    });
  }
  return;
};

export const updateVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = visitSchema.partial().parse(req.body);
    
    const visit = await prisma.visit.update({
      where: { id },
      data: {
        ...validatedData,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data kunjungan',
      data: visit
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
      message: 'Terjadi kesalahan saat memperbarui data kunjungan',
      error: (error as Error).message
    });
  }
  return;
};

export const deleteVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.visit.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data kunjungan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data kunjungan',
      error: (error as Error).message
    });
  }
  return;
};

// Endpoint khusus untuk mengubah status kunjungan
export const updateVisitStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['registered', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const visit = await prisma.visit.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui status kunjungan',
      data: visit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status kunjungan',
      error: (error as Error).message
    });
  }
  return;
};
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk appointment
const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  scheduleId: z.string().min(1, { message: 'ID jadwal wajib diisi' }),
  appointmentDate: z.string().datetime({ message: 'Tanggal janji temu harus format datetime' }),
  reason: z.string().min(1, { message: 'Alasan konsultasi wajib diisi' }),
  priority: z.enum(['normal', 'urgent'], { message: 'Prioritas harus normal atau urgent' }).optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'noshow'], { message: 'Status tidak valid' }).optional(),
  cancellationReason: z.string().optional(),
});

export const getAllAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        },
        schedule: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        }
      },
      orderBy: {
        appointmentDate: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data janji temu pasien',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data janji temu pasien',
      error: (error as Error).message
    });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
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
        schedule: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data janji temu pasien',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data janji temu pasien',
      error: (error as Error).message
    });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = appointmentSchema.parse(req.body);
    
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
    
    // Cek apakah jadwal ada
    const scheduleExists = await prisma.schedule.findUnique({
      where: { id: validatedData.scheduleId }
    });
    
    if (!scheduleExists) {
      return res.status(404).json({
        success: false,
        message: 'Jadwal tidak ditemukan'
      });
    }
    
    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        priority: validatedData.priority || 'normal',
        status: validatedData.status || 'scheduled',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        },
        schedule: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan janji temu pasien',
      data: appointment
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
      message: 'Terjadi kesalahan saat menambahkan janji temu pasien',
      error: (error as Error).message
    });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = appointmentSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah janji temu ada
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    });
    
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    }
    
    // Update data appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...validatedData,
        priority: validatedData.priority || 'normal',
        status: validatedData.status || 'scheduled',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        },
        schedule: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui janji temu pasien',
      data: appointment
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
      message: 'Terjadi kesalahan saat memperbarui janji temu pasien',
      error: (error as Error).message
    });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    }
    
    await prisma.appointment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus janji temu pasien'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus janji temu pasien',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk mengubah status janji temu
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'noshow'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(status === 'cancelled' && cancellationReason ? { cancellationReason } : {}),
        ...(status === 'confirmed' && { confirmedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() })
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        },
        schedule: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui status janji temu pasien',
      data: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status janji temu pasien',
      error: (error as Error).message
    });
  }
};
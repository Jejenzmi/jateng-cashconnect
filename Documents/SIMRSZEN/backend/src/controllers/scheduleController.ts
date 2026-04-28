import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk schedule
const scheduleSchema = z.object({
  doctorId: z.string().min(1, { message: 'ID dokter wajib diisi' }),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format waktu mulai tidak valid (HH:MM)' }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format waktu selesai tidak valid (HH:MM)' }),
});

export const getAllSchedules = async (_req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      },
      orderBy: {
        dayOfWeek: 'asc',
        startTime: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data jadwal',
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data jadwal',
      error: (error as Error).message
    });
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Data jadwal tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data jadwal',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data jadwal',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const createSchedule = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = scheduleSchema.parse(req.body);
    
    // Periksa apakah dokter ada
    const doctor = await prisma.doctor.findUnique({
      where: { id: validatedData.doctorId }
    });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    }
    
    const schedule = await prisma.schedule.create({
      data: {
        ...validatedData,
      },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan jadwal',
      data: schedule
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
      message: 'Terjadi kesalahan saat menambahkan jadwal',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = scheduleSchema.partial().parse(req.body);
    
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...validatedData,
      },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui jadwal',
      data: schedule
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
      message: 'Terjadi kesalahan saat memperbarui jadwal',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.schedule.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus jadwal'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus jadwal',
      error: (error as Error).message
    });
  }
  return; // Explicitly return to satisfy TS7030
};
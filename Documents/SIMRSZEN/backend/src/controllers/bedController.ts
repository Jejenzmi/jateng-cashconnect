import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk bed
const bedSchema = z.object({
  name: z.string().min(1, { message: 'Nama tempat tidur wajib diisi' }),
  roomNumber: z.string().min(1, { message: 'Nomor kamar wajib diisi' }),
  roomId: z.string().min(1, { message: 'ID kamar wajib diisi' }),
  status: z.enum(['available', 'occupied', 'maintenance'], { message: 'Status tidak valid' }),
  description: z.string().optional(),
});

export const getAllBeds = async (_req: Request, res: Response) => {
  try {
    const beds = await prisma.bed.findMany({
      include: {
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
      orderBy: {
        roomNumber: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data tempat tidur',
      data: beds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tempat tidur',
      error: (error as Error).message
    });
  }
};

export const getBedById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bed = await prisma.bed.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        inpatients: {
          select: {
            id: true,
            patient: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data tempat tidur',
      data: bed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data tempat tidur',
      error: (error as Error).message
    });
  }
};

export const createBed = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = bedSchema.parse(req.body);
    
    // Cek apakah kamar ada
    const roomExists = await prisma.room.findUnique({
      where: { id: validatedData.roomId }
    });
    
    if (!roomExists) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    // Cek apakah nomor tempat tidur sudah digunakan di kamar yang sama
    const existingBed = await prisma.bed.findFirst({
      where: {
        roomNumber: validatedData.roomNumber,
        roomId: validatedData.roomId,
      }
    });
    
    if (existingBed) {
      return res.status(400).json({
        success: false,
        message: 'Nomor tempat tidur sudah digunakan di kamar ini'
      });
    }
    
    const bed = await prisma.bed.create({
      data: {
        ...validatedData,
        status: validatedData.status || 'available',
      },
      include: {
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
      message: 'Berhasil menambahkan tempat tidur',
      data: bed
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
      message: 'Terjadi kesalahan saat menambahkan tempat tidur',
      error: (error as Error).message
    });
  }
};

export const updateBed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = bedSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data tempat tidur ada
    const existingBed = await prisma.bed.findUnique({
      where: { id }
    });
    
    if (!existingBed) {
      return res.status(404).json({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    }
    
    // Jika nomor tempat tidur diubah, cek apakah sudah digunakan di kamar yang sama
    if (validatedData.roomNumber && validatedData.roomNumber !== existingBed.roomNumber) {
      const existingBedWithSameNumber = await prisma.bed.findFirst({
        where: {
          roomNumber: validatedData.roomNumber,
          roomId: validatedData.roomId || existingBed.roomId,
          id: { not: id }, // Abaikan tempat tidur saat ini
        }
      });
      
      if (existingBedWithSameNumber) {
        return res.status(400).json({
          success: false,
          message: 'Nomor tempat tidur sudah digunakan di kamar ini'
        });
      }
    }
    
    // Cek apakah kamar ada jika di-update
    if (validatedData.roomId && validatedData.roomId !== existingBed.roomId) {
      const roomExists = await prisma.room.findUnique({
        where: { id: validatedData.roomId }
      });
      
      if (!roomExists) {
        return res.status(404).json({
          success: false,
          message: 'Kamar tidak ditemukan'
        });
      }
    }
    
    const bed = await prisma.bed.update({
      where: { id },
      data: {
        ...validatedData,
        status: validatedData.status || existingBed.status,
      },
      include: {
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
      message: 'Berhasil memperbarui tempat tidur',
      data: bed
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
      message: 'Terjadi kesalahan saat memperbarui tempat tidur',
      error: (error as Error).message
    });
  }
};

export const deleteBed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bed = await prisma.bed.findUnique({
      where: { id }
    });
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    }
    
    // Cek apakah tempat tidur sedang digunakan
    const activeInpatient = await prisma.inpatient.findFirst({
      where: {
        bedId: id,
        dischargeDate: null,
        status: 'admitted'
      }
    });
    
    if (activeInpatient) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus tempat tidur yang sedang digunakan oleh pasien'
      });
    }
    
    await prisma.bed.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus tempat tidur'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus tempat tidur',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk pembaruan status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status wajib diisi'
      });
    }
    
    if (!['available', 'occupied', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const bed = await prisma.bed.findUnique({
      where: { id }
    });
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    }
    
    const updatedBed = await prisma.bed.update({
      where: { id },
      data: {
        status: status
      },
      include: {
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
      message: 'Status tempat tidur berhasil diperbarui',
      data: updatedBed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status tempat tidur',
      error: (error as Error).message
    });
  }
};
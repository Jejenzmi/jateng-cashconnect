import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk room
const roomSchema = z.object({
  name: z.string().min(1, { message: 'Nama ruangan wajib diisi' }),
  type: z.string().min(1, { message: 'Tipe ruangan wajib diisi' }),
  floor: z.number().int().optional(),
  capacity: z.number().int().positive({ message: 'Kapasitas harus angka positif' }).optional(),
});

export const getAllRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { 
        isDeleted: false 
      },
      select: {
        id: true,
        name: true,
        type: true,
        floor: true,
        capacity: true,
        available: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data ruangan',
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data ruangan',
      error: (error as Error).message
    });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const room = await prisma.room.findUnique({
      where: { 
        id,
        isDeleted: false 
      },
      select: {
        id: true,
        name: true,
        type: true,
        floor: true,
        capacity: true,
        available: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data ruangan',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data ruangan',
      error: (error as Error).message
    });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = roomSchema.parse(req.body);
    
    const room = await prisma.room.create({
      data: {
        ...validatedData,
        capacity: validatedData.capacity || 1,
        available: validatedData.capacity || 1, // Awalnya semua kapasitas tersedia
        floor: validatedData.floor || 0,
      },
      select: {
        id: true,
        name: true,
        type: true,
        floor: true,
        capacity: true,
        available: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data ruangan',
      data: room
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
      message: 'Terjadi kesalahan saat menambahkan data ruangan',
      error: (error as Error).message
    });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = roomSchema.parse(req.body);
    
    // Periksa apakah ruangan ada
    const existingRoom = await prisma.room.findUnique({
      where: { 
        id,
        isDeleted: false 
      }
    });
    
    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    }
    
    const room = await prisma.room.update({
      where: { id },
      data: {
        ...validatedData,
        capacity: validatedData.capacity || 1,
        floor: validatedData.floor || 0,
      },
      select: {
        id: true,
        name: true,
        type: true,
        floor: true,
        capacity: true,
        available: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Berhasil memperbarui data ruangan',
      data: room
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
      message: 'Terjadi kesalahan saat memperbarui data ruangan',
      error: (error as Error).message
    });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const room = await prisma.room.findUnique({
      where: { 
        id,
        isDeleted: false 
      }
    });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    }
    
    // Soft delete
    await prisma.room.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data ruangan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data ruangan',
      error: (error as Error).message
    });
  }
};


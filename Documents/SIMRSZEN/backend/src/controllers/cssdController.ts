import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { logger } from '../utils/logger';  // Changed to named import

// Schema validasi untuk instrument
const instrumentSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Nama instrumen wajib diisi' }),
    type: z.string().min(1, { message: 'Tipe instrumen wajib diisi' }),
    sterilizationMethod: z.string().min(1, { message: 'Metode sterilisasi wajib diisi' }),
    status: z.string().min(1, { message: 'Status wajib diisi' }),
    location: z.string().min(1, { message: 'Lokasi wajib diisi' }),
    quantity: z.coerce.number().int().min(0, { message: 'Jumlah harus angka positif atau nol' })
  })
});

// Schema validasi untuk proses sterilisasi
const sterilizationProcessSchema = z.object({
  body: z.object({
    instrumentId: z.string().min(1, { message: 'ID instrumen wajib diisi' }),
    batchNumber: z.string().min(1, { message: 'Nomor batch wajib diisi' }),
    startDate: z.string().datetime({ message: 'Tanggal mulai harus format datetime' }),
    endDate: z.string().datetime({ message: 'Tanggal selesai harus format datetime' }),
    temperature: z.coerce.number({ message: 'Temperatur harus angka' }),
    pressure: z.coerce.number({ message: 'Tekanan harus angka' }),
    duration: z.coerce.number({ message: 'Durasi harus angka' }),
    operator: z.string().min(1, { message: 'Operator wajib diisi' }),
    status: z.string().min(1, { message: 'Status wajib diisi' })
  })
});

// Schema validasi untuk inventory steril
const sterileInventorySchema = z.object({
  body: z.object({
    instrumentId: z.string().min(1, { message: 'ID instrumen wajib diisi' }),
    batchNumber: z.string().min(1, { message: 'Nomor batch wajib diisi' }),
    receivedDate: z.string().datetime({ message: 'Tanggal diterima harus format datetime' }),
    quantity: z.coerce.number().int().min(0, { message: 'Jumlah harus angka positif atau nol' }),
    location: z.string().min(1, { message: 'Lokasi wajib diisi' }),
    expiryDate: z.string().datetime({ message: 'Tanggal kadaluarsa harus format datetime' }),
    status: z.string().min(1, { message: 'Status wajib diisi' })
  })
});

// Controller untuk manajemen instrumen
export const getAllInstruments = async (_req: Request, res: Response) => {
  try {
    const instruments = await prisma.instrument.findMany({
      where: {
        deletedAt: null // Hanya ambil instrumen yang belum dihapus
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    logger.info('Successfully retrieved instruments list');
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar instrumen',
      data: instruments
    });
  } catch (error) {
    logger.error('Error retrieving instruments list', { error: (error as Error).message, stack: (error as Error).stack });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar instrumen',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const getInstrumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const instrument = await prisma.instrument.findUnique({
      where: { id }
    });
    
    if (!instrument || instrument.deletedAt) {
      logger.warn('Instrument not found', { id });
      return res.status(404).json({
        success: false,
        message: 'Instrumen tidak ditemukan'
      });
    }
    
    logger.info('Successfully retrieved instrument', { id });
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil instrumen',
      data: instrument
    });
  } catch (error) {
    logger.error('Error retrieving instrument', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      instrumentId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil instrumen',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const createInstrument = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = instrumentSchema.parse({
      body: req.body
    });

    const { name, type, sterilizationMethod, status, location, quantity } = validatedData.body;

    const newInstrument = await prisma.instrument.create({
      data: {
        name,
        type,
        sterilizationMethod,
        status,
        location,
        quantity: Number(quantity),
        batchNumber: `BST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });

    logger.info('Successfully created instrument', { 
      instrumentId: newInstrument.id,
      name: newInstrument.name
    });

    res.status(201).json({
      success: true,
      message: 'Instrumen berhasil ditambahkan',
      data: newInstrument
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in create instrument', { 
        error: error.errors,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error creating instrument', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan instrumen',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const updateInstrument = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = instrumentSchema.parse({
      body: req.body
    });

    const { id } = req.params;
    const { name, type, sterilizationMethod, status, location, quantity } = validatedData.body;

    // Cek apakah instrument ada
    const existingInstrument = await prisma.instrument.findUnique({
      where: { id }
    });

    if (!existingInstrument || existingInstrument.deletedAt) {
      logger.warn('Attempt to update non-existent instrument', { id });
      return res.status(404).json({
        success: false,
        message: 'Instrumen tidak ditemukan'
      });
    }

    const updatedInstrument = await prisma.instrument.update({
      where: { id },
      data: {
        name,
        type,
        sterilizationMethod,
        status,
        location,
        quantity: Number(quantity)
      }
    });

    logger.info('Successfully updated instrument', { 
      id,
      name: updatedInstrument.name
    });

    res.status(200).json({
      success: true,
      message: 'Instrumen berhasil diperbarui',
      data: updatedInstrument
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in update instrument', { 
        error: error.errors,
        params: req.params,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error updating instrument', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      params: req.params,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui instrumen',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const deleteInstrument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah instrument ada
    const existingInstrument = await prisma.instrument.findUnique({
      where: { id }
    });

    if (!existingInstrument || existingInstrument.deletedAt) {
      logger.warn('Attempt to delete non-existent instrument', { id });
      return res.status(404).json({
        success: false,
        message: 'Instrumen tidak ditemukan'
      });
    }

    // Soft delete - hanya mengubah deletedAt
    await prisma.instrument.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    logger.info('Successfully deleted instrument', { id });

    res.status(200).json({
      success: true,
      message: 'Instrumen berhasil dihapus'
    });
  } catch (error) {
    logger.error('Error deleting instrument', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      instrumentId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus instrumen',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

// Controller untuk manajemen proses sterilisasi
export const getAllProcesses = async (_req: Request, res: Response) => {
  try {
    const processes = await prisma.sterilizationProcess.findMany({
      where: {
        deletedAt: null
      },
      include: {
        instrument: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    logger.info('Successfully retrieved sterilization processes list');
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar proses sterilisasi',
      data: processes
    });
  } catch (error) {
    logger.error('Error retrieving sterilization processes list', { 
      error: (error as Error).message, 
      stack: (error as Error).stack 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar proses sterilisasi',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const getProcessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const process = await prisma.sterilizationProcess.findUnique({
      where: { id },
      include: {
        instrument: true
      }
    });
    
    if (!process || process.deletedAt) {
      logger.warn('Sterilization process not found', { id });
      return res.status(404).json({
        success: false,
        message: 'Proses sterilisasi tidak ditemukan'
      });
    }
    
    logger.info('Successfully retrieved sterilization process', { id });
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil proses sterilisasi',
      data: process
    });
  } catch (error) {
    logger.error('Error retrieving sterilization process', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      processId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil proses sterilisasi',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const createProcess = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = sterilizationProcessSchema.parse({
      body: req.body
    });

    const { 
      instrumentId, 
      batchNumber, 
      startDate, 
      endDate, 
      temperature, 
      pressure, 
      duration, 
      operator, 
      status 
    } = validatedData.body;

    // Cek apakah instrument yang dituju ada
    const instrument = await prisma.instrument.findUnique({
      where: { id: instrumentId }
    });

    if (!instrument || instrument.deletedAt) {
      logger.warn('Instrument not found for sterilization process', { instrumentId });
      return res.status(404).json({
        success: false,
        message: 'Instrumen tidak ditemukan'
      });
    }

    const newProcess = await prisma.sterilizationProcess.create({
      data: {
        instrumentId,
        batchNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        temperature: Number(temperature),
        pressure: Number(pressure),
        duration: Number(duration),
        operator,
        status
      }
    });

    logger.info('Successfully created sterilization process', { 
      processId: newProcess.id,
      instrumentId 
    });

    res.status(201).json({
      success: true,
      message: 'Proses sterilisasi berhasil ditambahkan',
      data: newProcess
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in create sterilization process', { 
        error: error.errors,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error creating sterilization process', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan proses sterilisasi',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const updateProcess = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = sterilizationProcessSchema.parse({
      body: req.body
    });

    const { id } = req.params;
    const { 
      batchNumber, 
      startDate, 
      endDate, 
      temperature, 
      pressure, 
      duration, 
      operator, 
      status 
    } = validatedData.body;

    // Cek apakah process ada
    const existingProcess = await prisma.sterilizationProcess.findUnique({
      where: { id }
    });

    if (!existingProcess || existingProcess.deletedAt) {
      logger.warn('Attempt to update non-existent sterilization process', { id });
      return res.status(404).json({
        success: false,
        message: 'Proses sterilisasi tidak ditemukan'
      });
    }

    const updatedProcess = await prisma.sterilizationProcess.update({
      where: { id },
      data: {
        batchNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        temperature: Number(temperature),
        pressure: Number(pressure),
        duration: Number(duration),
        operator,
        status
      }
    });

    logger.info('Successfully updated sterilization process', { 
      id,
      processId: updatedProcess.id
    });

    res.status(200).json({
      success: true,
      message: 'Proses sterilisasi berhasil diperbarui',
      data: updatedProcess
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in update sterilization process', { 
        error: error.errors,
        params: req.params,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error updating sterilization process', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      params: req.params,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui proses sterilisasi',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const deleteProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah process ada
    const existingProcess = await prisma.sterilizationProcess.findUnique({
      where: { id }
    });

    if (!existingProcess || existingProcess.deletedAt) {
      logger.warn('Attempt to delete non-existent sterilization process', { id });
      return res.status(404).json({
        success: false,
        message: 'Proses sterilisasi tidak ditemukan'
      });
    }

    // Soft delete - hanya mengubah deletedAt
    await prisma.sterilizationProcess.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    logger.info('Successfully deleted sterilization process', { id });

    res.status(200).json({
      success: true,
      message: 'Proses sterilisasi berhasil dihapus'
    });
  } catch (error) {
    logger.error('Error deleting sterilization process', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      processId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus proses sterilisasi',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

// Controller untuk manajemen persediaan steril
export const getAllInventory = async (_req: Request, res: Response) => {
  try {
    const inventory = await prisma.sterileInventory.findMany({
      where: {
        deletedAt: null
      },
      include: {
        instrument: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    logger.info('Successfully retrieved sterile inventory list');
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar persediaan steril',
      data: inventory
    });
  } catch (error) {
    logger.error('Error retrieving sterile inventory list', { 
      error: (error as Error).message, 
      stack: (error as Error).stack 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar persediaan steril',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inventory = await prisma.sterileInventory.findUnique({
      where: { id },
      include: {
        instrument: true
      }
    });
    
    if (!inventory || inventory.deletedAt) {
      logger.warn('Sterile inventory item not found', { id });
      return res.status(404).json({
        success: false,
        message: 'Item persediaan steril tidak ditemukan'
      });
    }
    
    logger.info('Successfully retrieved sterile inventory item', { id });
    
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil item persediaan steril',
      data: inventory
    });
  } catch (error) {
    logger.error('Error retrieving sterile inventory item', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      inventoryId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil item persediaan steril',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const createInventory = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = sterileInventorySchema.parse({
      body: req.body
    });

    const { 
      instrumentId, 
      batchNumber, 
      receivedDate, 
      quantity, 
      location, 
      expiryDate, 
      status 
    } = validatedData.body;

    // Cek apakah instrument yang dituju ada
    const instrument = await prisma.instrument.findUnique({
      where: { id: instrumentId }
    });

    if (!instrument || instrument.deletedAt) {
      logger.warn('Instrument not found for sterile inventory', { instrumentId });
      return res.status(404).json({
        success: false,
        message: 'Instrumen tidak ditemukan'
      });
    }

    const newInventory = await prisma.sterileInventory.create({
      data: {
        instrumentId,
        batchNumber,
        receivedDate: new Date(receivedDate),
        quantity: Number(quantity),
        location,
        expiryDate: new Date(expiryDate),
        status
      }
    });

    logger.info('Successfully created sterile inventory item', { 
      inventoryId: newInventory.id,
      instrumentId 
    });

    res.status(201).json({
      success: true,
      message: 'Item persediaan steril berhasil ditambahkan',
      data: newInventory
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in create sterile inventory', { 
        error: error.errors,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error creating sterile inventory', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan item persediaan steril',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = sterileInventorySchema.parse({
      body: req.body
    });

    const { id } = req.params;
    const { 
      batchNumber, 
      receivedDate, 
      quantity, 
      location, 
      expiryDate, 
      status 
    } = validatedData.body;

    // Cek apakah inventory item ada
    const existingInventory = await prisma.sterileInventory.findUnique({
      where: { id }
    });

    if (!existingInventory || existingInventory.deletedAt) {
      logger.warn('Attempt to update non-existent sterile inventory', { id });
      return res.status(404).json({
        success: false,
        message: 'Item persediaan steril tidak ditemukan'
      });
    }

    const updatedInventory = await prisma.sterileInventory.update({
      where: { id },
      data: {
        batchNumber,
        receivedDate: new Date(receivedDate),
        quantity: Number(quantity),
        location,
        expiryDate: new Date(expiryDate),
        status
      }
    });

    logger.info('Successfully updated sterile inventory item', { 
      id,
      inventoryId: updatedInventory.id
    });

    res.status(200).json({
      success: true,
      message: 'Item persediaan steril berhasil diperbarui',
      data: updatedInventory
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error in update sterile inventory', { 
        error: error.errors,
        params: req.params,
        requestBody: req.body 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    logger.error('Error updating sterile inventory', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      params: req.params,
      requestBody: req.body 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui item persediaan steril',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek apakah inventory item ada
    const existingInventory = await prisma.sterileInventory.findUnique({
      where: { id }
    });

    if (!existingInventory || existingInventory.deletedAt) {
      logger.warn('Attempt to delete non-existent sterile inventory', { id });
      return res.status(404).json({
        success: false,
        message: 'Item persediaan steril tidak ditemukan'
      });
    }

    // Soft delete - hanya mengubah deletedAt
    await prisma.sterileInventory.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    logger.info('Successfully deleted sterile inventory item', { id });

    res.status(200).json({
      success: true,
      message: 'Item persediaan steril berhasil dihapus'
    });
  } catch (error) {
    logger.error('Error deleting sterile inventory', { 
      error: (error as Error).message, 
      stack: (error as Error).stack,
      inventoryId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus item persediaan steril',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Terjadi kesalahan internal'
    });
  }
};
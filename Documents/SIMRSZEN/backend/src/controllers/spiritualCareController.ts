import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Controller untuk manajemen permintaan pelayanan rohani
export const getAllSpiritualRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.spiritualRequest.findMany({
      where: {
        deletedAt: null // Hanya ambil permintaan yang belum dihapus
      },
      include: {
        patient: {
          select: {
            id: true,
            nama: true,
            nik: true
          }
        },
        clergy: {
          select: {
            id: true,
            name: true,
            religion: true
          }
        }
      },
      orderBy: {
        requestedAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar permintaan pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const getSpiritualRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const request = await prisma.spiritualRequest.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true,
            nik: true
          }
        },
        clergy: {
          select: {
            id: true,
            name: true,
            religion: true
          }
        }
      }
    });
    
    if (!request || request.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Permintaan pelayanan rohani tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil permintaan pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const createSpiritualRequest = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      patientId, 
      requesterName,
      religion,
      specificRequest,
      preferredClergyId,
      urgencyLevel,
      requestedAt
    } = req.body;

    const newRequest = await prisma.spiritualRequest.create({
      data: {
        patientId,
        requesterName,
        religion,
        specificRequest,
        preferredClergyId: preferredClergyId || null,
        urgencyLevel: urgencyLevel || 'normal',
        requestedAt: requestedAt ? new Date(requestedAt) : new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Permintaan pelayanan rohani berhasil ditambahkan',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan permintaan pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const updateSpiritualRequest = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      requesterName,
      religion,
      specificRequest,
      preferredClergyId,
      urgencyLevel,
      status
    } = req.body;

    const updatedRequest = await prisma.spiritualRequest.update({
      where: { id },
      data: {
        requesterName,
        religion,
        specificRequest,
        preferredClergyId: preferredClergyId || null,
        urgencyLevel,
        status
      }
    });

    res.status(200).json({
      success: true,
      message: 'Permintaan pelayanan rohani berhasil diperbarui',
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui permintaan pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const deleteSpiritualRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.spiritualRequest.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Permintaan pelayanan rohani berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus permintaan pelayanan rohani',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen petugas pelayanan rohani
export const getAllClergy = async (req: Request, res: Response) => {
  try {
    const clergies = await prisma.clergy.findMany({
      where: {
        deletedAt: null
      },
      include: {
        requests: true,
        services: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: clergies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar petugas pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const getClergyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const clergy = await prisma.clergy.findUnique({
      where: { id },
      include: {
        requests: true,
        services: true
      }
    });
    
    if (!clergy || clergy.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Petugas pelayanan rohani tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: clergy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data petugas pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const createClergy = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      name, 
      religion, 
      organization,
      contactInfo,
      availability
    } = req.body;

    const newClergy = await prisma.clergy.create({
      data: {
        name,
        religion,
        organization,
        contactInfo,
        availability: availability || true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Petugas pelayanan rohani berhasil ditambahkan',
      data: newClergy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan petugas pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const updateClergy = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      name, 
      religion, 
      organization,
      contactInfo,
      availability
    } = req.body;

    const updatedClergy = await prisma.clergy.update({
      where: { id },
      data: {
        name,
        religion,
        organization,
        contactInfo,
        availability
      }
    });

    res.status(200).json({
      success: true,
      message: 'Petugas pelayanan rohani berhasil diperbarui',
      data: updatedClergy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui petugas pelayanan rohani',
      error: (error as Error).message
    });
  }
};

export const deleteClergy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.clergy.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Petugas pelayanan rohani berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus petugas pelayanan rohani',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen layanan rohani
export const getAllSpiritualServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.spiritualService.findMany({
      where: {
        deletedAt: null
      },
      include: {
        patient: {
          select: {
            id: true,
            nama: true
          }
        },
        clergy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        serviceDate: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar layanan rohani',
      error: (error as Error).message
    });
  }
};

export const getSpiritualServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.spiritualService.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true
          }
        },
        clergy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!service || service.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Layanan rohani tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil layanan rohani',
      error: (error as Error).message
    });
  }
};

export const createSpiritualService = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      patientId, 
      clergyId, 
      serviceType,
      serviceDate,
      notes,
      outcome
    } = req.body;

    const newService = await prisma.spiritualService.create({
      data: {
        patientId,
        clergyId,
        serviceType,
        serviceDate: new Date(serviceDate),
        notes,
        outcome
      }
    });

    res.status(201).json({
      success: true,
      message: 'Layanan rohani berhasil ditambahkan',
      data: newService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan layanan rohani',
      error: (error as Error).message
    });
  }
};

export const updateSpiritualService = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      serviceType,
      serviceDate,
      notes,
      outcome
    } = req.body;

    const updatedService = await prisma.spiritualService.update({
      where: { id },
      data: {
        serviceType,
        serviceDate: new Date(serviceDate),
        notes,
        outcome
      }
    });

    res.status(200).json({
      success: true,
      message: 'Layanan rohani berhasil diperbarui',
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui layanan rohani',
      error: (error as Error).message
    });
  }
};

export const deleteSpiritualService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.spiritualService.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Layanan rohani berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus layanan rohani',
      error: (error as Error).message
    });
  }
};
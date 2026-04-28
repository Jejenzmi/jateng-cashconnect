import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Controller untuk manajemen sesi terapi
export const getAllTherapySessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.therapySession.findMany({
      where: {
        deletedAt: null // Hanya ambil sesi yang belum dihapus
      },
      include: {
        patient: {
          select: {
            id: true,
            nama: true,
            nik: true
          }
        },
        physiotherapist: {
          select: {
            id: true,
            name: true,
            licenseNumber: true
          }
        },
        treatmentPlan: {
          select: {
            id: true,
            planName: true
          }
        }
      },
      orderBy: {
        sessionDate: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar sesi terapi',
      error: (error as Error).message
    });
  }
};

export const getTherapySessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const session = await prisma.therapySession.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true,
            nik: true
          }
        },
        physiotherapist: {
          select: {
            id: true,
            name: true,
            licenseNumber: true
          }
        },
        treatmentPlan: {
          select: {
            id: true,
            planName: true
          }
        }
      }
    });
    
    if (!session || session.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Sesi terapi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil sesi terapi',
      error: (error as Error).message
    });
  }
};

export const createTherapySession = async (req: Request, res: Response) => {
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
      physiotherapistId, 
      treatmentPlanId,
      sessionDate,
      sessionType,
      therapyGoals,
      interventions,
      progressNotes,
      nextAppointment
    } = req.body;

    const newSession = await prisma.therapySession.create({
      data: {
        patientId,
        physiotherapistId,
        treatmentPlanId,
        sessionDate: new Date(sessionDate),
        sessionType,
        therapyGoals,
        interventions,
        progressNotes,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sesi terapi berhasil ditambahkan',
      data: newSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan sesi terapi',
      error: (error as Error).message
    });
  }
};

export const updateTherapySession = async (req: Request, res: Response) => {
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
      sessionDate,
      sessionType,
      therapyGoals,
      interventions,
      progressNotes,
      nextAppointment
    } = req.body;

    const updatedSession = await prisma.therapySession.update({
      where: { id },
      data: {
        sessionDate: new Date(sessionDate),
        sessionType,
        therapyGoals,
        interventions,
        progressNotes,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Sesi terapi berhasil diperbarui',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui sesi terapi',
      error: (error as Error).message
    });
  }
};

export const deleteTherapySession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.therapySession.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Sesi terapi berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus sesi terapi',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen fisioterapis
export const getAllPhysiotherapists = async (req: Request, res: Response) => {
  try {
    const physiotherapists = await prisma.physiotherapist.findMany({
      where: {
        deletedAt: null
      },
      include: {
        therapySessions: true,
        treatmentPlans: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: physiotherapists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar fisioterapis',
      error: (error as Error).message
    });
  }
};

export const getPhysiotherapistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const physiotherapist = await prisma.physiotherapist.findUnique({
      where: { id },
      include: {
        therapySessions: true,
        treatmentPlans: true
      }
    });
    
    if (!physiotherapist || physiotherapist.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Fisioterapis tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: physiotherapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data fisioterapis',
      error: (error as Error).message
    });
  }
};

export const createPhysiotherapist = async (req: Request, res: Response) => {
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
      licenseNumber, 
      specialization,
      contactInfo
    } = req.body;

    const newPhysiotherapist = await prisma.physiotherapist.create({
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo
      }
    });

    res.status(201).json({
      success: true,
      message: 'Fisioterapis berhasil ditambahkan',
      data: newPhysiotherapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan fisioterapis',
      error: (error as Error).message
    });
  }
};

export const updatePhysiotherapist = async (req: Request, res: Response) => {
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
      licenseNumber, 
      specialization,
      contactInfo
    } = req.body;

    const updatedPhysiotherapist = await prisma.physiotherapist.update({
      where: { id },
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo
      }
    });

    res.status(200).json({
      success: true,
      message: 'Fisioterapis berhasil diperbarui',
      data: updatedPhysiotherapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui fisioterapis',
      error: (error as Error).message
    });
  }
};

export const deletePhysiotherapist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.physiotherapist.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Fisioterapis berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus fisioterapis',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen rencana perawatan
export const getAllTreatmentPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.treatmentPlan.findMany({
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
        physiotherapist: {
          select: {
            id: true,
            name: true
          }
        },
        therapySessions: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar rencana perawatan',
      error: (error as Error).message
    });
  }
};

export const getTreatmentPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const plan = await prisma.treatmentPlan.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true
          }
        },
        physiotherapist: {
          select: {
            id: true,
            name: true
          }
        },
        therapySessions: true
      }
    });
    
    if (!plan || plan.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Rencana perawatan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil rencana perawatan',
      error: (error as Error).message
    });
  }
};

export const createTreatmentPlan = async (req: Request, res: Response) => {
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
      physiotherapistId, 
      planName,
      diagnosis,
      therapyGoals,
      interventions,
      duration,
      frequency,
      startDate,
      endDate
    } = req.body;

    const newPlan = await prisma.treatmentPlan.create({
      data: {
        patientId,
        physiotherapistId,
        planName,
        diagnosis,
        therapyGoals,
        interventions,
        duration,
        frequency,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rencana perawatan berhasil ditambahkan',
      data: newPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan rencana perawatan',
      error: (error as Error).message
    });
  }
};

export const updateTreatmentPlan = async (req: Request, res: Response) => {
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
      planName,
      diagnosis,
      therapyGoals,
      interventions,
      duration,
      frequency,
      startDate,
      endDate
    } = req.body;

    const updatedPlan = await prisma.treatmentPlan.update({
      where: { id },
      data: {
        planName,
        diagnosis,
        therapyGoals,
        interventions,
        duration,
        frequency,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rencana perawatan berhasil diperbarui',
      data: updatedPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui rencana perawatan',
      error: (error as Error).message
    });
  }
};

export const deleteTreatmentPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.treatmentPlan.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rencana perawatan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus rencana perawatan',
      error: (error as Error).message
    });
  }
};
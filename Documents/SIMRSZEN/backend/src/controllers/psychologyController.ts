import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Controller untuk manajemen sesi terapi psikologi
export const getAllPsychologySessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.psychologySession.findMany({
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
        psychologist: {
          select: {
            id: true,
            name: true,
            licenseNumber: true
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
      message: 'Gagal mengambil daftar sesi terapi psikologi',
      error: (error as Error).message
    });
  }
};

export const getPsychologySessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const session = await prisma.psychologySession.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true,
            nik: true
          }
        },
        psychologist: {
          select: {
            id: true,
            name: true,
            licenseNumber: true
          }
        }
      }
    });
    
    if (!session || session.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Sesi terapi psikologi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil sesi terapi psikologi',
      error: (error as Error).message
    });
  }
};

export const createPsychologySession = async (req: Request, res: Response) => {
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
      psychologistId, 
      sessionDate,
      sessionType,
      therapyGoals,
      interventions,
      patientProgress,
      nextAppointment,
      notes
    } = req.body;

    const newSession = await prisma.psychologySession.create({
      data: {
        patientId,
        psychologistId,
        sessionDate: new Date(sessionDate),
        sessionType,
        therapyGoals,
        interventions,
        patientProgress,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
        notes
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sesi terapi psikologi berhasil ditambahkan',
      data: newSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan sesi terapi psikologi',
      error: (error as Error).message
    });
  }
};

export const updatePsychologySession = async (req: Request, res: Response) => {
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
      patientProgress,
      nextAppointment,
      notes,
      status
    } = req.body;

    const updatedSession = await prisma.psychologySession.update({
      where: { id },
      data: {
        sessionDate: new Date(sessionDate),
        sessionType,
        therapyGoals,
        interventions,
        patientProgress,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
        notes,
        status
      }
    });

    res.status(200).json({
      success: true,
      message: 'Sesi terapi psikologi berhasil diperbarui',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui sesi terapi psikologi',
      error: (error as Error).message
    });
  }
};

export const deletePsychologySession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.psychologySession.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Sesi terapi psikologi berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus sesi terapi psikologi',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen psikolog
export const getAllPsychologists = async (req: Request, res: Response) => {
  try {
    const psychologists = await prisma.psychologist.findMany({
      where: {
        deletedAt: null
      },
      include: {
        sessions: true,
        reports: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: psychologists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar psikolog',
      error: (error as Error).message
    });
  }
};

export const getPsychologistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const psychologist = await prisma.psychologist.findUnique({
      where: { id },
      include: {
        sessions: true,
        reports: true
      }
    });
    
    if (!psychologist || psychologist.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Psikolog tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: psychologist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data psikolog',
      error: (error as Error).message
    });
  }
};

export const createPsychologist = async (req: Request, res: Response) => {
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

    const newPsychologist = await prisma.psychologist.create({
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo
      }
    });

    res.status(201).json({
      success: true,
      message: 'Psikolog berhasil ditambahkan',
      data: newPsychologist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan psikolog',
      error: (error as Error).message
    });
  }
};

export const updatePsychologist = async (req: Request, res: Response) => {
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
      contactInfo,
      isActive
    } = req.body;

    const updatedPsychologist = await prisma.psychologist.update({
      where: { id },
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Psikolog berhasil diperbarui',
      data: updatedPsychologist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui psikolog',
      error: (error as Error).message
    });
  }
};

export const deletePsychologist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.psychologist.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Psikolog berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus psikolog',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen laporan psikologi
export const getAllPsychologyReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.psychologyReport.findMany({
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
        psychologist: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar laporan psikologi',
      error: (error as Error).message
    });
  }
};

export const getPsychologyReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const report = await prisma.psychologyReport.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            nama: true
          }
        },
        psychologist: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!report || report.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Laporan psikologi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan psikologi',
      error: (error as Error).message
    });
  }
};

export const createPsychologyReport = async (req: Request, res: Response) => {
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
      psychologistId, 
      reportType,
      reportDate,
      content,
      recommendations,
      attachments
    } = req.body;

    const newReport = await prisma.psychologyReport.create({
      data: {
        patientId,
        psychologistId,
        reportType,
        reportDate: new Date(reportDate),
        content,
        recommendations,
        attachments: attachments || []
      }
    });

    res.status(201).json({
      success: true,
      message: 'Laporan psikologi berhasil ditambahkan',
      data: newReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan laporan psikologi',
      error: (error as Error).message
    });
  }
};

export const updatePsychologyReport = async (req: Request, res: Response) => {
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
      reportType,
      reportDate,
      content,
      recommendations,
      attachments
    } = req.body;

    const updatedReport = await prisma.psychologyReport.update({
      where: { id },
      data: {
        reportType,
        reportDate: new Date(reportDate),
        content,
        recommendations,
        attachments: attachments || []
      }
    });

    res.status(200).json({
      success: true,
      message: 'Laporan psikologi berhasil diperbarui',
      data: updatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui laporan psikologi',
      error: (error as Error).message
    });
  }
};

export const deletePsychologyReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.psychologyReport.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Laporan psikologi berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus laporan psikologi',
      error: (error as Error).message
    });
  }
};
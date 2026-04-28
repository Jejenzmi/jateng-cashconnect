import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema validasi untuk inpatient
const inpatientSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pasien wajib diisi' }),
  visitId: z.string().min(1, { message: 'ID kunjungan wajib diisi' }),
  roomId: z.string().min(1, { message: 'ID kamar wajib diisi' }),
  bedId: z.string().min(1, { message: 'ID tempat tidur wajib diisi' }),
  admissionDate: z.string().datetime({ message: 'Tanggal masuk harus format datetime' }),
  admissionReason: z.string().min(1, { message: 'Alasan rawat inap wajib diisi' }),
  attendingDoctorId: z.string().min(1, { message: 'ID dokter penanggung jawab wajib diisi' }),
  notes: z.string().optional(),
  status: z.enum(['admitted', 'discharged', 'transferred', 'expired'], { message: 'Status tidak valid' }).optional(),
});

export const getAllInpatients = async (_req: Request, res: Response) => {
  try {
    const inpatients = await prisma.inpatient.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            medicalRecordNumber: true,
          }
        },
        visit: {
          select: {
            id: true,
            visitNumber: true,
            chiefComplaint: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        bed: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          }
        },
        attendingDoctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      },
      orderBy: {
        admissionDate: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data rawat inap',
      data: inpatients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rawat inap',
      error: (error as Error).message
    });
  }
};

export const getInpatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inpatient = await prisma.inpatient.findUnique({
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
        visit: {
          select: {
            id: true,
            visitNumber: true,
            chiefComplaint: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        bed: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          }
        },
        attendingDoctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            phone: true,
            email: true,
          }
        }
      }
    });

    if (!inpatient) {
      return res.status(404).json({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mengambil data rawat inap',
      data: inpatient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rawat inap',
      error: (error as Error).message
    });
  }
};

export const createInpatient = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const validatedData = inpatientSchema.parse(req.body);
    
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
    
    // Cek apakah kunjungan ada
    const visitExists = await prisma.visit.findUnique({
      where: { id: validatedData.visitId }
    });
    
    if (!visitExists) {
      return res.status(404).json({
        success: false,
        message: 'Kunjungan tidak ditemukan'
      });
    }
    
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
    
    // Cek apakah tempat tidur ada
    const bedExists = await prisma.bed.findUnique({
      where: { id: validatedData.bedId }
    });
    
    if (!bedExists) {
      return res.status(404).json({
        success: false,
        message: 'Tempat tidur tidak ditemukan'
      });
    }
    
    // Cek apakah dokter penanggung jawab ada
    const doctorExists = await prisma.doctor.findUnique({
      where: { id: validatedData.attendingDoctorId }
    });
    
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Dokter penanggung jawab tidak ditemukan'
      });
    }
    
    // Cek apakah tempat tidur sedang tersedia
    const existingOccupancy = await prisma.inpatient.findFirst({
      where: {
        bedId: validatedData.bedId,
        dischargeDate: null,
        status: 'admitted'
      }
    });
    
    if (existingOccupancy) {
      return res.status(400).json({
        success: false,
        message: 'Tempat tidur sedang digunakan oleh pasien lain'
      });
    }
    
    const inpatient = await prisma.inpatient.create({
      data: {
        ...validatedData,
        status: validatedData.status || 'admitted',
        admissionDate: new Date(validatedData.admissionDate),
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
        visit: {
          select: {
            id: true,
            visitNumber: true,
            chiefComplaint: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        bed: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          }
        },
        attendingDoctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          }
        }
      }
    });

    // Update status tempat tidur
    await prisma.bed.update({
      where: { id: validatedData.bedId },
      data: { status: 'occupied' }
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan data rawat inap',
      data: inpatient
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
      message: 'Terjadi kesalahan saat menambahkan data rawat inap',
      error: (error as Error).message
    });
  }
};

export const updateInpatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = inpatientSchema.partial().merge(z.object({ id: z.string().optional() })).parse({ id, ...req.body });
    
    // Periksa apakah data rawat inap ada
    const existingInpatient = await prisma.inpatient.findUnique({
      where: { id }
    });
    
    if (!existingInpatient) {
      return res.status(404).json({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    }
    
    // Jika status diubah menjadi discharged, set tanggal keluar
    let dischargeDate = existingInpatient.dischargeDate;
    if (validatedData.status === 'discharged' && !existingInpatient.dischargeDate) {
      dischargeDate = new Date();
      
      // Update status tempat tidur menjadi available
      await prisma.bed.update({
        where: { id: existingInpatient.bedId },
        data: { status: 'available' }
      });
    }
    
    const inpatient = await prisma.inpatient.update({
      where: { id },
      data: {
        ...validatedData,
        status: validatedData.status || existingInpatient.status,
        dischargeDate: dischargeDate,
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
        visit: {
          select: {
            id: true,
            visitNumber: true,
            chiefComplaint: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        bed: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          }
        },
        attendingDoctor: {
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
      message: 'Berhasil memperbarui data rawat inap',
      data: inpatient
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
      message: 'Terjadi kesalahan saat memperbarui data rawat inap',
      error: (error as Error).message
    });
  }
};

export const deleteInpatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inpatient = await prisma.inpatient.findUnique({
      where: { id }
    });
    
    if (!inpatient) {
      return res.status(404).json({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    }
    
    await prisma.inpatient.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Berhasil menghapus data rawat inap'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data rawat inap',
      error: (error as Error).message
    });
  }
};

// Endpoint khusus untuk pemindahan pasien
export const transferPatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roomId, bedId, reason } = req.body;
    
    const inpatient = await prisma.inpatient.findUnique({
      where: { id }
    });
    
    if (!inpatient) {
      return res.status(404).json({
        success: false,
        message: 'Data rawat inap tidak ditemukan'
      });
    }
    
    // Cek apakah kamar dan tempat tidur tujuan tersedia
    const bedExists = await prisma.bed.findUnique({
      where: { id: bedId }
    });
    
    if (!bedExists) {
      return res.status(404).json({
        success: false,
        message: 'Tempat tidur tujuan tidak ditemukan'
      });
    }
    
    // Cek apakah tempat tidur sedang tersedia
    const existingOccupancy = await prisma.inpatient.findFirst({
      where: {
        bedId: bedId,
        dischargeDate: null,
        status: 'admitted'
      }
    });
    
    if (existingOccupancy) {
      return res.status(400).json({
        success: false,
        message: 'Tempat tidur tujuan sedang digunakan oleh pasien lain'
      });
    }
    
    // Update data rawat inap dengan kamar dan tempat tidur baru
    const updatedInpatient = await prisma.inpatient.update({
      where: { id },
      data: {
        roomId: roomId,
        bedId: bedId,
        status: 'transferred',
        notes: `${inpatient.notes || ''}\nPemindahan: ${reason} pada ${new Date().toISOString()}`
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
        visit: {
          select: {
            id: true,
            visitNumber: true,
            chiefComplaint: true,
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        bed: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          }
        },
        attendingDoctor: {
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
      message: 'Berhasil memindahkan pasien',
      data: updatedInpatient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memindahan pasien',
      error: (error as Error).message
    });
  }
};
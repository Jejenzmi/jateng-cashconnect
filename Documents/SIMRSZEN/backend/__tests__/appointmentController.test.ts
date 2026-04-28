import { Request, Response } from 'express';
import { 
  getAllAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  updateAppointmentStatus
} from '../src/controllers/appointmentController';
import prisma from '../src/config/db';

// Mock prisma
jest.mock('../src/config/db');

// Definisikan tipe untuk mock Prisma
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

// Define a type for our mock request
type MockRequest = Partial<Request> & {
  params?: any;
  body?: any;
};

// Mock response object
const createMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('Appointment Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAppointments', () => {
    it('should return all appointments', async () => {
      const mockAppointments = [
        {
          id: '1',
          patientId: 'patient1',
          doctorId: 'doctor1',
          scheduleId: 'schedule1',
          appointmentDate: new Date(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
          createdAt: new Date(),
          updatedAt: new Date(),
          patient: {
            id: 'patient1',
            name: 'John Doe',
            nik: '1234567890',
          },
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Jane Smith',
            specialization: 'Cardiology',
          },
          schedule: {
            id: 'schedule1',
            dayOfWeek: 'MONDAY',
            startTime: '08:00',
            endTime: '16:00',
          }
        }
      ];

      mockedPrisma.appointment.findMany = jest.fn().mockResolvedValue(mockAppointments);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllAppointments(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data janji temu pasien',
        data: mockAppointments
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.appointment.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllAppointments(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data janji temu pasien',
        error: 'Database error'
      });
    });
  });

  describe('getAppointmentById', () => {
    it('should return appointment by ID', async () => {
      const mockAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
          phone: '081234567891',
          email: 'jane@example.com',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(mockAppointment);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getAppointmentById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data janji temu pasien',
        data: mockAppointment
      });
    });

    it('should return 404 if appointment not found', async () => {
      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getAppointmentById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const mockNewAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          scheduleId: 'schedule1',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doctor1',
        fullName: 'Dr. Jane Smith',
        specialization: 'Cardiology',
      });
      
      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue({
        id: 'schedule1',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
      });
      
      mockedPrisma.appointment.create = jest.fn().mockResolvedValue(mockNewAppointment);

      const res = createMockResponse();

      await createAppointment(mockReq as Request, res);

      expect(mockedPrisma.appointment.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          scheduleId: 'schedule1',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
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

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan janji temu pasien',
        data: mockNewAppointment
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          doctorId: 'doctor1',
          scheduleId: 'schedule1',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createAppointment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    });

    it('should return 404 if doctor not found', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'nonexistent',
          scheduleId: 'schedule1',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
      });
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createAppointment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    });

    it('should return 404 if schedule not found', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          scheduleId: 'nonexistent',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890',
      });
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doctor1',
        fullName: 'Dr. Jane Smith',
        specialization: 'Cardiology',
      });
      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createAppointment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Jadwal tidak ditemukan'
      });
    });
  });

  describe('updateAppointment', () => {
    it('should update an existing appointment', async () => {
      const mockExistingAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      const mockUpdatedAppointment = {
        ...mockExistingAppointment,
        reason: 'Follow-up',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingAppointment,
          reason: 'Follow-up',
        }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(mockExistingAppointment);
      mockedPrisma.appointment.update = jest.fn().mockResolvedValue(mockUpdatedAppointment);

      const res = createMockResponse();

      await updateAppointment(mockReq as Request, res);

      expect(mockedPrisma.appointment.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingAppointment,
          reason: 'Follow-up',
          priority: 'normal',
          status: 'scheduled',
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui janji temu pasien',
        data: mockUpdatedAppointment
      });
    });

    it('should return 404 if appointment to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          scheduleId: 'schedule1',
          appointmentDate: new Date().toISOString(),
          reason: 'Checkup',
          priority: 'normal',
          status: 'scheduled',
        }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateAppointment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    });
  });

  describe('deleteAppointment', () => {
    it('should delete an appointment', async () => {
      const mockAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(mockAppointment);
      mockedPrisma.appointment.delete = jest.fn().mockResolvedValue(mockAppointment);

      const res = createMockResponse();

      await deleteAppointment(mockReq as Request, res);

      expect(mockedPrisma.appointment.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus janji temu pasien'
      });
    });

    it('should return 404 if appointment to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteAppointment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should update appointment status', async () => {
      const mockAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'confirmed'
        }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(mockAppointment);
      mockedPrisma.appointment.update = jest.fn().mockResolvedValue({
        ...mockAppointment,
        status: 'confirmed',
        confirmedAt: new Date()
      });

      const res = createMockResponse();

      await updateAppointmentStatus(mockReq as Request, res);

      expect(mockedPrisma.appointment.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'confirmed',
          confirmedAt: expect.any(Date)
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui status janji temu pasien',
        data: {
          ...mockAppointment,
          status: 'confirmed',
          confirmedAt: expect.any(Date)
        }
      });
    });

    it('should update appointment status to cancelled with reason', async () => {
      const mockAppointment = {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        scheduleId: 'schedule1',
        appointmentDate: new Date(),
        reason: 'Checkup',
        priority: 'normal',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890',
        },
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology',
        },
        schedule: {
          id: 'schedule1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
        }
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'cancelled',
          cancellationReason: 'Pasien tidak bisa datang'
        }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(mockAppointment);
      mockedPrisma.appointment.update = jest.fn().mockResolvedValue({
        ...mockAppointment,
        status: 'cancelled',
        cancellationReason: 'Pasien tidak bisa datang'
      });

      const res = createMockResponse();

      await updateAppointmentStatus(mockReq as Request, res);

      expect(mockedPrisma.appointment.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'cancelled',
          cancellationReason: 'Pasien tidak bisa datang'
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui status janji temu pasien',
        data: {
          ...mockAppointment,
          status: 'cancelled',
          cancellationReason: 'Pasien tidak bisa datang'
        }
      });
    });

    it('should return 400 if invalid status is provided', async () => {
      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'invalid_status'
        }
      } as MockRequest;

      const res = createMockResponse();

      await updateAppointmentStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Status tidak valid'
      });
    });

    it('should return 404 if appointment to update status is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          status: 'confirmed'
        }
      } as MockRequest;

      mockedPrisma.appointment.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateAppointmentStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data janji temu pasien tidak ditemukan'
      });
    });
  });
});
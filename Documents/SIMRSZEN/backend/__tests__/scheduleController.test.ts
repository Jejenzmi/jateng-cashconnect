import { Request, Response } from 'express';
import { 
  getAllSchedules, 
  getScheduleById, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../src/controllers/scheduleController';
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

describe('Schedule Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSchedules', () => {
    it('should return all schedules', async () => {
      const mockSchedules = [
        {
          id: '1',
          doctorId: 'doc1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
          maxVisits: 20,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          doctor: {
            id: 'doc1',
            fullName: 'Dr. John Doe',
            specialization: 'Cardiology',
          }
        }
      ];

      mockedPrisma.schedule.findMany = jest.fn().mockResolvedValue(mockSchedules);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllSchedules(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data jadwal dokter',
        data: mockSchedules
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.schedule.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllSchedules(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data jadwal dokter',
        error: 'Database error'
      });
    });
  });

  describe('getScheduleById', () => {
    it('should return schedule by ID', async () => {
      const mockSchedule = {
        id: '1',
        doctorId: 'doc1',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        doctor: {
          id: 'doc1',
          fullName: 'Dr. John Doe',
          specialization: 'Cardiology',
        },
        appointments: []
      };

      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(mockSchedule);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getScheduleById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data jadwal dokter',
        data: mockSchedule
      });
    });

    it('should return 404 if schedule not found', async () => {
      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getScheduleById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data jadwal dokter tidak ditemukan'
      });
    });
  });

  describe('createSchedule', () => {
    it('should create a new schedule', async () => {
      const mockNewSchedule = {
        id: '1',
        doctorId: 'doc1',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        doctor: {
          id: 'doc1',
          fullName: 'Dr. John Doe',
          specialization: 'Cardiology',
        }
      };

      const mockReq = {
        body: {
          doctorId: 'doc1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
          maxVisits: 20,
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doc1',
        fullName: 'Dr. John Doe',
        specialization: 'Cardiology',
      });
      
      mockedPrisma.schedule.create = jest.fn().mockResolvedValue(mockNewSchedule);

      const res = createMockResponse();

      await createSchedule(mockReq as Request, res);

      expect(mockedPrisma.schedule.create).toHaveBeenCalledWith({
        data: {
          doctorId: 'doc1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
          maxVisits: 20,
          isActive: true,
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

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan jadwal dokter',
        data: mockNewSchedule
      });
    });

    it('should return 404 if doctor not found', async () => {
      const mockReq = {
        body: {
          doctorId: 'nonexistent',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
          maxVisits: 20,
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createSchedule(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    });
  });

  describe('updateSchedule', () => {
    it('should update an existing schedule', async () => {
      const mockExistingSchedule = {
        id: '1',
        doctorId: 'doc1',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        doctor: {
          id: 'doc1',
          fullName: 'Dr. John Doe',
          specialization: 'Cardiology',
        }
      };

      const mockUpdatedSchedule = {
        ...mockExistingSchedule,
        dayOfWeek: 'TUESDAY',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingSchedule,
          dayOfWeek: 'TUESDAY',
        }
      } as MockRequest;

      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(mockExistingSchedule);
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doc1',
        fullName: 'Dr. John Doe',
        specialization: 'Cardiology',
      });
      mockedPrisma.schedule.update = jest.fn().mockResolvedValue(mockUpdatedSchedule);

      const res = createMockResponse();

      await updateSchedule(mockReq as Request, res);

      expect(mockedPrisma.schedule.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingSchedule,
          dayOfWeek: 'TUESDAY',
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui jadwal dokter',
        data: mockUpdatedSchedule
      });
    });

    it('should return 404 if schedule to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          doctorId: 'doc1',
          dayOfWeek: 'MONDAY',
          startTime: '08:00',
          endTime: '16:00',
          maxVisits: 20,
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateSchedule(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data jadwal dokter tidak ditemukan'
      });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete a schedule', async () => {
      const mockSchedule = {
        id: '1',
        doctorId: 'doc1',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '16:00',
        maxVisits: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        doctor: {
          id: 'doc1',
          fullName: 'Dr. John Doe',
          specialization: 'Cardiology',
        }
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(mockSchedule);
      mockedPrisma.schedule.delete = jest.fn().mockResolvedValue(mockSchedule);

      const res = createMockResponse();

      await deleteSchedule(mockReq as Request, res);

      expect(mockedPrisma.schedule.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus jadwal dokter'
      });
    });

    it('should return 404 if schedule to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.schedule.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteSchedule(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data jadwal dokter tidak ditemukan'
      });
    });
  });
});
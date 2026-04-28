import { Request, Response } from 'express';
import { 
  getAllRadiologyOrders, 
  getRadiologyOrderByID, 
  createRadiologyOrder, 
  updateRadiologyOrder, 
  deleteRadiologyOrder
} from '../src/controllers/radiologyOrderController';
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

describe('RadiologyOrder Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRadiologyOrders', () => {
    it('should return all radiology orders', async () => {
      const mockRadiologyOrders = [
        {
          id: '1',
          patientId: 'patient1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          doctorId: 'doctor1',
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
          },
          visitId: 'visit1',
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          examId: 'exam1',
          exam: {
            id: 'exam1',
            name: 'X-Ray Chest',
            code: 'XR001',
          },
          notes: 'Additional notes',
          priority: 'routine',
          result: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.radiologyOrder.findMany = jest.fn().mockResolvedValue(mockRadiologyOrders);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyOrders(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pesanan radiologi',
        data: mockRadiologyOrders
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.radiologyOrder.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyOrders(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pesanan radiologi',
        error: 'Database error'
      });
    });
  });

  describe('getRadiologyOrderByID', () => {
    it('should return radiology order by ID', async () => {
      const mockRadiologyOrder = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
          nik: '123456789',
          phone: '081234567890',
          address: 'Jl. Example 123',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
          phone: '081234567891',
          email: 'dr.smith@example.com',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        examId: 'exam1',
        exam: {
          id: 'exam1',
          name: 'X-Ray Chest',
          code: 'XR001',
          category: 'X-Ray',
          description: 'X-Ray of chest area',
          preparation: 'No special preparation needed',
          contraindications: 'None',
        },
        notes: 'Additional notes',
        priority: 'routine',
        result: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(mockRadiologyOrder);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyOrderByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pesanan radiologi',
        data: mockRadiologyOrder
      });
    });

    it('should return 404 if radiology order not found', async () => {
      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyOrderByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
      });
    });
  });

  describe('createRadiologyOrder', () => {
    it('should create a new radiology order', async () => {
      const mockNewOrder = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        examId: 'exam1',
        exam: {
          id: 'exam1',
          name: 'X-Ray Chest',
          code: 'XR001',
        },
        notes: 'Additional notes',
        priority: 'urgent',
        result: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          visitId: 'visit1',
          examId: 'exam1',
          notes: 'Additional notes',
          priority: 'urgent',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        medicalRecordNumber: 'RM-001',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue({
        id: 'doctor1',
        fullName: 'Dr. Smith',
        specialization: 'Cardiology',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VISIT-001',
      });
      
      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue({
        id: 'exam1',
        name: 'X-Ray Chest',
        code: 'XR001',
      });
      
      mockedPrisma.radiologyOrder.create = jest.fn().mockResolvedValue(mockNewOrder);

      const res = createMockResponse();

      await createRadiologyOrder(mockReq as Request, res);

      expect(mockedPrisma.radiologyOrder.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          visitId: 'visit1',
          examId: 'exam1',
          notes: 'Additional notes',
          priority: 'urgent',
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          exam: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan pesanan radiologi',
        data: mockNewOrder
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          doctorId: 'doctor1',
          visitId: 'visit1',
          examId: 'exam1',
          priority: 'routine',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createRadiologyOrder(mockReq as Request, res);

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
          visitId: 'visit1',
          examId: 'exam1',
          priority: 'routine',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        medicalRecordNumber: 'RM-001',
      });
      
      mockedPrisma.doctor.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createRadiologyOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    });
  });

  describe('updateRadiologyOrder', () => {
    it('should update an existing radiology order', async () => {
      const mockExistingOrder = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        examId: 'exam1',
        exam: {
          id: 'exam1',
          name: 'X-Ray Chest',
          code: 'XR001',
        },
        notes: 'Original notes',
        priority: 'routine',
        result: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedOrder = {
        ...mockExistingOrder,
        notes: 'Updated notes',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          notes: 'Updated notes',
        }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(mockExistingOrder);
      mockedPrisma.radiologyOrder.update = jest.fn().mockResolvedValue(mockUpdatedOrder);

      const res = createMockResponse();

      await updateRadiologyOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui pesanan radiologi',
        data: mockUpdatedOrder
      });
    });

    it('should return 404 if radiology order to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          notes: 'Updated notes',
        }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateRadiologyOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
      });
    });
  });

  describe('deleteRadiologyOrder', () => {
    it('should delete a radiology order', async () => {
      const mockRadiologyOrder = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
        },
        doctorId: 'doctor1',
        doctor: {
          id: 'doctor1',
          fullName: 'Dr. Smith',
          specialization: 'Cardiology',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        examId: 'exam1',
        exam: {
          id: 'exam1',
          name: 'X-Ray Chest',
          code: 'XR001',
        },
        notes: 'Additional notes',
        priority: 'routine',
        result: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(mockRadiologyOrder);
      mockedPrisma.radiologyResult.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.radiologyOrder.delete = jest.fn().mockResolvedValue(mockRadiologyOrder);

      const res = createMockResponse();

      await deleteRadiologyOrder(mockReq as Request, res);

      expect(mockedPrisma.radiologyOrder.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus pesanan radiologi'
      });
    });

    it('should return 400 if order has associated results', async () => {
      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue({
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        examId: 'exam1',
        priority: 'routine',
        notes: 'Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      mockedPrisma.radiologyResult.findFirst = jest.fn().mockResolvedValue({
        id: 'result1',
        orderId: '1',
        result: 'Some result',
        status: 'completed',
        resultDate: new Date(),
      });

      const res = createMockResponse();

      await deleteRadiologyOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tidak dapat menghapus pesanan yang sudah memiliki hasil'
      });
    });

    it('should return 404 if radiology order to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteRadiologyOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan radiologi tidak ditemukan'
      });
    });
  });
});
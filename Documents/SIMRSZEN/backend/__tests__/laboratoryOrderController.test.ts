import { Request, Response } from 'express';
import { 
  getAllLaboratoryOrders, 
  getLaboratoryOrderByID, 
  createLaboratoryOrder, 
  updateLaboratoryOrder, 
  deleteLaboratoryOrder
} from '../src/controllers/laboratoryOrderController';
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

describe('LaboratoryOrder Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLaboratoryOrders', () => {
    it('should return all laboratory orders', async () => {
      const mockLaboratoryOrders = [
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
          testId: 'test1',
          test: {
            id: 'test1',
            name: 'Complete Blood Count',
            code: 'CBC001',
          },
          notes: 'Additional notes',
          priority: 'routine',
          result: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.laboratoryOrder.findMany = jest.fn().mockResolvedValue(mockLaboratoryOrders);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryOrders(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pesanan laboratorium',
        data: mockLaboratoryOrders
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.laboratoryOrder.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryOrders(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pesanan laboratorium',
        error: 'Database error'
      });
    });
  });

  describe('getLaboratoryOrderByID', () => {
    it('should return laboratory order by ID', async () => {
      const mockLaboratoryOrder = {
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
        testId: 'test1',
        test: {
          id: 'test1',
          name: 'Complete Blood Count',
          code: 'CBC001',
          description: 'Complete blood count test',
          normalValues: 'Normal values',
          sampleType: 'Blood',
          preparation: 'Fast for 8 hours',
        },
        notes: 'Additional notes',
        priority: 'routine',
        result: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(mockLaboratoryOrder);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryOrderByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pesanan laboratorium',
        data: mockLaboratoryOrder
      });
    });

    it('should return 404 if laboratory order not found', async () => {
      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryOrderByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    });
  });

  describe('createLaboratoryOrder', () => {
    it('should create a new laboratory order', async () => {
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
        testId: 'test1',
        test: {
          id: 'test1',
          name: 'Complete Blood Count',
          code: 'CBC001',
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
          testId: 'test1',
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
      
      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue({
        id: 'test1',
        name: 'Complete Blood Count',
        code: 'CBC001',
      });
      
      mockedPrisma.laboratoryOrder.create = jest.fn().mockResolvedValue(mockNewOrder);

      const res = createMockResponse();

      await createLaboratoryOrder(mockReq as Request, res);

      expect(mockedPrisma.laboratoryOrder.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          doctorId: 'doctor1',
          visitId: 'visit1',
          testId: 'test1',
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
          test: {
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
        message: 'Berhasil menambahkan pesanan laboratorium',
        data: mockNewOrder
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          doctorId: 'doctor1',
          visitId: 'visit1',
          testId: 'test1',
          priority: 'routine',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createLaboratoryOrder(mockReq as Request, res);

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
          testId: 'test1',
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

      await createLaboratoryOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dokter tidak ditemukan'
      });
    });
  });

  describe('updateLaboratoryOrder', () => {
    it('should update an existing laboratory order', async () => {
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
        testId: 'test1',
        test: {
          id: 'test1',
          name: 'Complete Blood Count',
          code: 'CBC001',
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

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(mockExistingOrder);
      mockedPrisma.laboratoryOrder.update = jest.fn().mockResolvedValue(mockUpdatedOrder);

      const res = createMockResponse();

      await updateLaboratoryOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui pesanan laboratorium',
        data: mockUpdatedOrder
      });
    });

    it('should return 404 if laboratory order to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          notes: 'Updated notes',
        }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateLaboratoryOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    });
  });

  describe('deleteLaboratoryOrder', () => {
    it('should delete a laboratory order', async () => {
      const mockLaboratoryOrder = {
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
        testId: 'test1',
        test: {
          id: 'test1',
          name: 'Complete Blood Count',
          code: 'CBC001',
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

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(mockLaboratoryOrder);
      mockedPrisma.laboratoryResult.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.laboratoryOrder.delete = jest.fn().mockResolvedValue(mockLaboratoryOrder);

      const res = createMockResponse();

      await deleteLaboratoryOrder(mockReq as Request, res);

      expect(mockedPrisma.laboratoryOrder.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus pesanan laboratorium'
      });
    });

    it('should return 400 if order has associated results', async () => {
      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue({
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        testId: 'test1',
        priority: 'routine',
        notes: 'Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      mockedPrisma.laboratoryResult.findFirst = jest.fn().mockResolvedValue({
        id: 'result1',
        orderId: '1',
        result: 'Some result',
        status: 'completed',
        resultDate: new Date(),
      });

      const res = createMockResponse();

      await deleteLaboratoryOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tidak dapat menghapus pesanan yang sudah memiliki hasil'
      });
    });

    it('should return 404 if laboratory order to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteLaboratoryOrder(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pesanan laboratorium tidak ditemukan'
      });
    });
  });
});
import { Request, Response } from 'express';
import { 
  getAllLaboratoryResults, 
  getLaboratoryResultByID, 
  createLaboratoryResult, 
  updateLaboratoryResult, 
  deleteLaboratoryResult,
  verifyLaboratoryResult
} from '../src/controllers/laboratoryResultController';
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

describe('LaboratoryResult Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLaboratoryResults', () => {
    it('should return all laboratory results', async () => {
      const mockLaboratoryResults = [
        {
          id: '1',
          orderId: 'order1',
          order: {
            id: 'order1',
            patient: {
              id: 'patient1',
              name: 'John Doe',
              medicalRecordNumber: 'RM-001',
            },
            doctor: {
              id: 'doctor1',
              fullName: 'Dr. Smith',
              specialization: 'Cardiology',
            },
            visit: {
              id: 'visit1',
              visitNumber: 'VISIT-001',
            },
            test: {
              id: 'test1',
              name: 'Complete Blood Count',
              code: 'CBC001',
            },
          },
          result: 'Normal results',
          notes: 'Additional notes',
          status: 'completed',
          resultDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.laboratoryResult.findMany = jest.fn().mockResolvedValue(mockLaboratoryResults);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryResults(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data hasil laboratorium',
        data: mockLaboratoryResults
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.laboratoryResult.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryResults(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data hasil laboratorium',
        error: 'Database error'
      });
    });
  });

  describe('getLaboratoryResultByID', () => {
    it('should return laboratory result by ID', async () => {
      const mockLaboratoryResult = {
        id: '1',
        orderId: 'order1',
        order: {
          id: 'order1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
            nik: '123456789',
            phone: '081234567890',
            address: 'Jl. Example 123',
          },
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
            phone: '081234567891',
            email: 'dr.smith@example.com',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          test: {
            id: 'test1',
            name: 'Complete Blood Count',
            code: 'CBC001',
            description: 'Complete blood count test',
            normalValues: 'Normal values',
            sampleType: 'Blood',
            preparation: 'Fast for 8 hours',
          },
        },
        result: 'Normal results',
        notes: 'Additional notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(mockLaboratoryResult);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryResultByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data hasil laboratorium',
        data: mockLaboratoryResult
      });
    });

    it('should return 404 if laboratory result not found', async () => {
      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryResultByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    });
  });

  describe('createLaboratoryResult', () => {
    it('should create a new laboratory result', async () => {
      const mockNewResult = {
        id: '1',
        orderId: 'order1',
        result: 'Test results',
        notes: 'Additional notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        order: {
          id: 'order1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          test: {
            id: 'test1',
            name: 'Complete Blood Count',
            code: 'CBC001',
          },
        }
      };

      const mockReq = {
        body: {
          orderId: 'order1',
          result: 'Test results',
          notes: 'Additional notes',
          status: 'completed',
        }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue({
        id: 'order1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        testId: 'test1',
      });
      
      mockedPrisma.laboratoryResult.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.laboratoryResult.create = jest.fn().mockResolvedValue(mockNewResult);

      const res = createMockResponse();

      await createLaboratoryResult(mockReq as Request, res);

      expect(mockedPrisma.laboratoryResult.create).toHaveBeenCalledWith({
        data: {
          orderId: 'order1',
          result: 'Test results',
          notes: 'Additional notes',
          status: 'completed',
        },
        include: {
          order: {
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
              },
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan hasil laboratorium',
        data: mockNewResult
      });
    });

    it('should return 404 if laboratory order not found', async () => {
      const mockReq = {
        body: {
          orderId: 'nonexistent',
          status: 'completed',
        }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pesanan laboratorium tidak ditemukan'
      });
    });

    it('should return 400 if result for order already exists', async () => {
      const mockReq = {
        body: {
          orderId: 'order1',
          status: 'completed',
        }
      } as MockRequest;

      mockedPrisma.laboratoryOrder.findUnique = jest.fn().mockResolvedValue({
        id: 'order1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        testId: 'test1',
      });
      
      mockedPrisma.laboratoryResult.findFirst = jest.fn().mockResolvedValue({
        id: 'existing-result',
        orderId: 'order1',
        result: 'Previous result',
        notes: 'Previous notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = createMockResponse();

      await createLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Hasil untuk pesanan ini sudah ada'
      });
    });
  });

  describe('updateLaboratoryResult', () => {
    it('should update an existing laboratory result', async () => {
      const mockExistingResult = {
        id: '1',
        orderId: 'order1',
        result: 'Initial result',
        notes: 'Initial notes',
        status: 'pending',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        order: {
          id: 'order1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          test: {
            id: 'test1',
            name: 'Complete Blood Count',
            code: 'CBC001',
          },
        }
      };

      const mockUpdatedResult = {
        ...mockExistingResult,
        result: 'Updated result',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          result: 'Updated result',
        }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(mockExistingResult);
      mockedPrisma.laboratoryResult.update = jest.fn().mockResolvedValue(mockUpdatedResult);

      const res = createMockResponse();

      await updateLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui hasil laboratorium',
        data: mockUpdatedResult
      });
    });

    it('should return 404 if laboratory result to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          result: 'Updated result',
        }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    });
  });

  describe('deleteLaboratoryResult', () => {
    it('should delete a laboratory result', async () => {
      const mockLaboratoryResult = {
        id: '1',
        orderId: 'order1',
        result: 'Test results',
        notes: 'Additional notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(mockLaboratoryResult);
      mockedPrisma.laboratoryResult.delete = jest.fn().mockResolvedValue(mockLaboratoryResult);

      const res = createMockResponse();

      await deleteLaboratoryResult(mockReq as Request, res);

      expect(mockedPrisma.laboratoryResult.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus hasil laboratorium'
      });
    });

    it('should return 404 if laboratory result to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil laboratorium tidak ditemukan'
      });
    });
  });

  describe('verifyLaboratoryResult', () => {
    it('should verify a laboratory result', async () => {
      const mockLaboratoryResult = {
        id: '1',
        orderId: 'order1',
        result: 'Test results',
        notes: 'Additional notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        order: {
          id: 'order1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          doctor: {
            id: 'doctor1',
            fullName: 'Dr. Smith',
            specialization: 'Cardiology',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          test: {
            id: 'test1',
            name: 'Complete Blood Count',
            code: 'CBC001',
          },
        }
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(mockLaboratoryResult);
      mockedPrisma.laboratoryResult.update = jest.fn().mockResolvedValue({
        ...mockLaboratoryResult,
        status: 'verified',
        resultDate: new Date(),
      });

      const res = createMockResponse();

      await verifyLaboratoryResult(mockReq as Request, res);

      expect(mockedPrisma.laboratoryResult.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'verified',
          resultDate: expect.any(Date),
        },
        include: {
          order: {
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
              },
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Hasil laboratorium berhasil diverifikasi',
        data: expect.objectContaining({
          status: 'verified'
        })
      });
    });

    it('should return 400 if trying to verify a non-completed result', async () => {
      const mockLaboratoryResult = {
        id: '1',
        orderId: 'order1',
        result: 'Test results',
        notes: 'Additional notes',
        status: 'pending', // Not completed
        resultDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.laboratoryResult.findUnique = jest.fn().mockResolvedValue(mockLaboratoryResult);

      const res = createMockResponse();

      await verifyLaboratoryResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Hanya hasil dengan status completed yang bisa diverifikasi'
      });
    });
  });
});
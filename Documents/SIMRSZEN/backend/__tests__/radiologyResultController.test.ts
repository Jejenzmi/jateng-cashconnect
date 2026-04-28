import { Request, Response } from 'express';
import { 
  getAllRadiologyResults, 
  getRadiologyResultByID, 
  createRadiologyResult, 
  updateRadiologyResult, 
  deleteRadiologyResult,
  verifyRadiologyResult
} from '../src/controllers/radiologyResultController';
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

describe('RadiologyResult Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRadiologyResults', () => {
    it('should return all radiology results', async () => {
      const mockRadiologyResults = [
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
            exam: {
              id: 'exam1',
              name: 'CT Scan Head',
              code: 'CT001',
            },
          },
          result: 'Normal findings',
          notes: 'Additional notes',
          status: 'completed',
          resultDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.radiologyResult.findMany = jest.fn().mockResolvedValue(mockRadiologyResults);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyResults(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data hasil radiologi',
        data: mockRadiologyResults
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.radiologyResult.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyResults(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data hasil radiologi',
        error: 'Database error'
      });
    });
  });

  describe('getRadiologyResultByID', () => {
    it('should return radiology result by ID', async () => {
      const mockRadiologyResult = {
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
          exam: {
            id: 'exam1',
            name: 'CT Scan Head',
            code: 'CT001',
            category: 'CT Scan',
            description: 'CT scan of head',
            preparation: 'No special preparation needed',
            contraindications: 'None',
          },
        },
        result: 'Normal findings',
        notes: 'Additional notes',
        status: 'completed',
        resultDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(mockRadiologyResult);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyResultByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data hasil radiologi',
        data: mockRadiologyResult
      });
    });

    it('should return 404 if radiology result not found', async () => {
      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyResultByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    });
  });

  describe('createRadiologyResult', () => {
    it('should create a new radiology result', async () => {
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
          exam: {
            id: 'exam1',
            name: 'CT Scan Head',
            code: 'CT001',
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

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue({
        id: 'order1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        examId: 'exam1',
      });
      
      mockedPrisma.radiologyResult.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.radiologyResult.create = jest.fn().mockResolvedValue(mockNewResult);

      const res = createMockResponse();

      await createRadiologyResult(mockReq as Request, res);

      expect(mockedPrisma.radiologyResult.create).toHaveBeenCalledWith({
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
              exam: {
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
        message: 'Berhasil menambahkan hasil radiologi',
        data: mockNewResult
      });
    });

    it('should return 404 if radiology order not found', async () => {
      const mockReq = {
        body: {
          orderId: 'nonexistent',
          status: 'completed',
        }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pesanan radiologi tidak ditemukan'
      });
    });

    it('should return 400 if result for order already exists', async () => {
      const mockReq = {
        body: {
          orderId: 'order1',
          status: 'completed',
        }
      } as MockRequest;

      mockedPrisma.radiologyOrder.findUnique = jest.fn().mockResolvedValue({
        id: 'order1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        visitId: 'visit1',
        examId: 'exam1',
      });
      
      mockedPrisma.radiologyResult.findFirst = jest.fn().mockResolvedValue({
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

      await createRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Hasil untuk pesanan ini sudah ada'
      });
    });
  });

  describe('updateRadiologyResult', () => {
    it('should update an existing radiology result', async () => {
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
          exam: {
            id: 'exam1',
            name: 'CT Scan Head',
            code: 'CT001',
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

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(mockExistingResult);
      mockedPrisma.radiologyResult.update = jest.fn().mockResolvedValue(mockUpdatedResult);

      const res = createMockResponse();

      await updateRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui hasil radiologi',
        data: mockUpdatedResult
      });
    });

    it('should return 404 if radiology result to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          result: 'Updated result',
        }
      } as MockRequest;

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    });
  });

  describe('deleteRadiologyResult', () => {
    it('should delete a radiology result', async () => {
      const mockRadiologyResult = {
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

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(mockRadiologyResult);
      mockedPrisma.radiologyResult.delete = jest.fn().mockResolvedValue(mockRadiologyResult);

      const res = createMockResponse();

      await deleteRadiologyResult(mockReq as Request, res);

      expect(mockedPrisma.radiologyResult.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus hasil radiologi'
      });
    });

    it('should return 404 if radiology result to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data hasil radiologi tidak ditemukan'
      });
    });
  });

  describe('verifyRadiologyResult', () => {
    it('should verify a radiology result', async () => {
      const mockRadiologyResult = {
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
          exam: {
            id: 'exam1',
            name: 'CT Scan Head',
            code: 'CT001',
          },
        }
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(mockRadiologyResult);
      mockedPrisma.radiologyResult.update = jest.fn().mockResolvedValue({
        ...mockRadiologyResult,
        status: 'verified',
        resultDate: new Date(),
      });

      const res = createMockResponse();

      await verifyRadiologyResult(mockReq as Request, res);

      expect(mockedPrisma.radiologyResult.update).toHaveBeenCalledWith({
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
              exam: {
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
        message: 'Hasil radiologi berhasil diverifikasi',
        data: expect.objectContaining({
          status: 'verified'
        })
      });
    });

    it('should return 400 if trying to verify a non-completed result', async () => {
      const mockRadiologyResult = {
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

      mockedPrisma.radiologyResult.findUnique = jest.fn().mockResolvedValue(mockRadiologyResult);

      const res = createMockResponse();

      await verifyRadiologyResult(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Hanya hasil dengan status completed yang bisa diverifikasi'
      });
    });
  });
});
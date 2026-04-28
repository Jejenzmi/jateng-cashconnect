import { Request, Response } from 'express';
import { 
  getAllLaboratoryTests, 
  getLaboratoryTestById, 
  createLaboratoryTest, 
  updateLaboratoryTest, 
  deleteLaboratoryTest 
} from '../src/controllers/laboratoryTestController';
import prisma from '../src/config/db';
import { Decimal } from '@prisma/client/runtime/library';

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

describe('Laboratory Test Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLaboratoryTests', () => {
    it('should return all laboratory tests', async () => {
      const mockLabTests = [
        {
          id: '1',
          name: 'Complete Blood Count',
          code: 'CBC001',
          group: 'Hematology',
          description: 'Complete blood count test',
          price: new Decimal(150000),
          normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
          sampleType: 'Blood',
          preparation: 'Overnight fasting required',
          processingTime: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.laboratoryTest.findMany = jest.fn().mockResolvedValue(mockLabTests);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryTests(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tes laboratorium',
        data: mockLabTests
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.laboratoryTest.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllLaboratoryTests(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data tes laboratorium',
        error: 'Database error'
      });
    });
  });

  describe('getLaboratoryTestById', () => {
    it('should return laboratory test by ID', async () => {
      const mockLabTest = {
        id: '1',
        name: 'Complete Blood Count',
        code: 'CBC001',
        group: 'Hematology',
        description: 'Complete blood count test',
        price: new Decimal(150000),
        normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
        sampleType: 'Blood',
        preparation: 'Overnight fasting required',
        processingTime: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(mockLabTest);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryTestById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tes laboratorium',
        data: mockLabTest
      });
    });

    it('should return 404 if laboratory test not found', async () => {
      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getLaboratoryTestById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    });
  });

  describe('createLaboratoryTest', () => {
    it('should create a new laboratory test', async () => {
      const mockNewLabTest = {
        id: '1',
        name: 'Complete Blood Count',
        code: 'CBC001',
        group: 'Hematology',
        description: 'Complete blood count test',
        price: new Decimal(150000),
        normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
        sampleType: 'Blood',
        preparation: 'Overnight fasting required',
        processingTime: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'Complete Blood Count',
          code: 'CBC001',
          group: 'Hematology',
          description: 'Complete blood count test',
          price: 150000,
          normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
          sampleType: 'Blood',
          preparation: 'Overnight fasting required',
          processingTime: 2,
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.laboratoryTest.create = jest.fn().mockResolvedValue(mockNewLabTest);

      const res = createMockResponse();

      await createLaboratoryTest(mockReq as Request, res);

      expect(mockedPrisma.laboratoryTest.create).toHaveBeenCalledWith({
        data: {
          name: 'Complete Blood Count',
          code: 'CBC001',
          group: 'Hematology',
          description: 'Complete blood count test',
          price: new Decimal(150000),
          normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
          sampleType: 'Blood',
          preparation: 'Overnight fasting required',
          processingTime: 2,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          code: true,
          group: true,
          description: true,
          price: true,
          normalValues: true,
          sampleType: true,
          preparation: true,
          processingTime: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data tes laboratorium',
        data: mockNewLabTest
      });
    });
  });

  describe('updateLaboratoryTest', () => {
    it('should update an existing laboratory test', async () => {
      const mockExistingLabTest = {
        id: '1',
        name: 'Complete Blood Count',
        code: 'CBC001',
        group: 'Hematology',
        description: 'Complete blood count test',
        price: new Decimal(150000),
        normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
        sampleType: 'Blood',
        preparation: 'Overnight fasting required',
        processingTime: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedLabTest = {
        ...mockExistingLabTest,
        name: 'Comprehensive Blood Count',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingLabTest,
          name: 'Comprehensive Blood Count',
        }
      } as MockRequest;

      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(mockExistingLabTest);
      mockedPrisma.laboratoryTest.update = jest.fn().mockResolvedValue(mockUpdatedLabTest);

      const res = createMockResponse();

      await updateLaboratoryTest(mockReq as Request, res);

      expect(mockedPrisma.laboratoryTest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingLabTest,
          name: 'Comprehensive Blood Count',
        },
        select: {
          id: true,
          name: true,
          code: true,
          group: true,
          description: true,
          price: true,
          normalValues: true,
          sampleType: true,
          preparation: true,
          processingTime: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data tes laboratorium',
        data: mockUpdatedLabTest
      });
    });

    it('should return 404 if laboratory test to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Complete Blood Count',
          code: 'CBC001',
          group: 'Hematology',
          description: 'Complete blood count test',
          price: new Decimal(150000), // Konversi ke Decimal
          normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
          sampleType: 'Blood',
          preparation: 'Overnight fasting required',
          processingTime: 2,
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateLaboratoryTest(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    });
  });

  describe('deleteLaboratoryTest', () => {
    it('should delete a laboratory test', async () => {
      const mockLabTest = {
        id: '1',
        name: 'Complete Blood Count',
        code: 'CBC001',
        group: 'Hematology',
        description: 'Complete blood count test',
        price: new Decimal(150000),
        normalValues: 'RBC: 4.5-5.5M/uL, WBC: 4,000-11,000/uL',
        sampleType: 'Blood',
        preparation: 'Overnight fasting required',
        processingTime: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(mockLabTest);
      mockedPrisma.laboratoryTest.delete = jest.fn().mockResolvedValue(mockLabTest);

      const res = createMockResponse();

      await deleteLaboratoryTest(mockReq as Request, res);

      expect(mockedPrisma.laboratoryTest.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data tes laboratorium'
      });
    });

    it('should return 404 if laboratory test to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.laboratoryTest.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteLaboratoryTest(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tes laboratorium tidak ditemukan'
      });
    });
  });
});
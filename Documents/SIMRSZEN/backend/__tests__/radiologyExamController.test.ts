import { Request, Response } from 'express';
import { 
  getAllRadiologyExams, 
  getRadiologyExamById, 
  createRadiologyExam, 
  updateRadiologyExam, 
  deleteRadiologyExam 
} from '../src/controllers/radiologyExamController';
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

describe('Radiology Exam Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRadiologyExams', () => {
    it('should return all radiology exams', async () => {
      const mockExams = [
        {
          id: '1',
          name: 'CT Scan Head',
          code: 'CT001',
          category: 'CT',
          description: 'Computed tomography scan of the head',
          price: new Decimal(750000),
          preparation: '6 hours fasting required',
          contraindications: 'Pregnancy',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.radiologyExam.findMany = jest.fn().mockResolvedValue(mockExams);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyExams(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pemeriksaan radiologi',
        data: mockExams
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.radiologyExam.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRadiologyExams(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pemeriksaan radiologi',
        error: 'Database error'
      });
    });
  });

  describe('getRadiologyExamById', () => {
    it('should return radiology exam by ID', async () => {
      const mockExam = {
        id: '1',
        name: 'CT Scan Head',
        code: 'CT001',
        category: 'CT',
        description: 'Computed tomography scan of the head',
        price: new Decimal(750000),
        preparation: '6 hours fasting required',
        contraindications: 'Pregnancy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(mockExam);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyExamById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pemeriksaan radiologi',
        data: mockExam
      });
    });

    it('should return 404 if radiology exam not found', async () => {
      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getRadiologyExamById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    });
  });

  describe('createRadiologyExam', () => {
    it('should create a new radiology exam', async () => {
      const mockNewExam = {
        id: '1',
        name: 'CT Scan Head',
        code: 'CT001',
        category: 'CT',
        description: 'Computed tomography scan of the head',
        price: new Decimal(750000),
        preparation: '6 hours fasting required',
        contraindications: 'Pregnancy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'CT Scan Head',
          code: 'CT001',
          category: 'CT',
          description: 'Computed tomography scan of the head',
          price: 750000,
          preparation: '6 hours fasting required',
          contraindications: 'Pregnancy',
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.radiologyExam.create = jest.fn().mockResolvedValue(mockNewExam);

      const res = createMockResponse();

      await createRadiologyExam(mockReq as Request, res);

      expect(mockedPrisma.radiologyExam.create).toHaveBeenCalledWith({
        data: {
          name: 'CT Scan Head',
          code: 'CT001',
          category: 'CT',
          description: 'Computed tomography scan of the head',
          price: new Decimal(750000),
          preparation: '6 hours fasting required',
          contraindications: 'Pregnancy',
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          code: true,
          category: true,
          description: true,
          price: true,
          preparation: true,
          contraindications: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data pemeriksaan radiologi',
        data: mockNewExam
      });
    });
  });

  describe('updateRadiologyExam', () => {
    it('should update an existing radiology exam', async () => {
      const mockExistingExam = {
        id: '1',
        name: 'CT Scan Head',
        code: 'CT001',
        category: 'CT',
        description: 'Computed tomography scan of the head',
        price: new Decimal(750000),
        preparation: '6 hours fasting required',
        contraindications: 'Pregnancy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedExam = {
        ...mockExistingExam,
        name: 'MRI Head',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingExam,
          name: 'MRI Head',
        }
      } as MockRequest;

      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(mockExistingExam);
      mockedPrisma.radiologyExam.update = jest.fn().mockResolvedValue(mockUpdatedExam);

      const res = createMockResponse();

      await updateRadiologyExam(mockReq as Request, res);

      expect(mockedPrisma.radiologyExam.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingExam,
          name: 'MRI Head',
        },
        select: {
          id: true,
          name: true,
          code: true,
          category: true,
          description: true,
          price: true,
          preparation: true,
          contraindications: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data pemeriksaan radiologi',
        data: mockUpdatedExam
      });
    });

    it('should return 404 if radiology exam to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'CT Scan Head',
          code: 'CT001',
          category: 'CT',
          description: 'Computed tomography scan of the head',
          price: 750000,
          preparation: '6 hours fasting required',
          contraindications: 'Pregnancy',
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateRadiologyExam(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    });
  });

  describe('deleteRadiologyExam', () => {
    it('should delete a radiology exam', async () => {
      const mockExam = {
        id: '1',
        name: 'CT Scan Head',
        code: 'CT001',
        category: 'CT',
        description: 'Computed tomography scan of the head',
        price: new Decimal(750000),
        preparation: '6 hours fasting required',
        contraindications: 'Pregnancy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(mockExam);
      mockedPrisma.radiologyExam.delete = jest.fn().mockResolvedValue(mockExam);

      const res = createMockResponse();

      await deleteRadiologyExam(mockReq as Request, res);

      expect(mockedPrisma.radiologyExam.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data pemeriksaan radiologi'
      });
    });

    it('should return 404 if radiology exam to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.radiologyExam.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteRadiologyExam(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pemeriksaan radiologi tidak ditemukan'
      });
    });
  });
});
import { Request, Response } from 'express';
import { 
  getAllDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../src/controllers/departmentController';
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

describe('Department Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDepartments', () => {
    it('should return all departments', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Poli Umum',
          description: 'Poli untuk pemeriksaan umum',
          headId: 'user1',
          head: {
            id: 'user1',
            fullName: 'Dr. Ahmad',
            role: 'DOCTOR'
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.department.findMany = jest.fn().mockResolvedValue(mockDepartments);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllDepartments(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data departemen',
        data: mockDepartments
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.department.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllDepartments(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data departemen',
        error: 'Database error'
      });
    });
  });

  describe('getDepartmentById', () => {
    it('should return department by ID', async () => {
      const mockDepartment = {
        id: '1',
        name: 'Poli Umum',
        description: 'Poli untuk pemeriksaan umum',
        headId: 'user1',
        head: {
          id: 'user1',
          fullName: 'Dr. Ahmad',
          role: 'DOCTOR'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(mockDepartment);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getDepartmentById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data departemen',
        data: mockDepartment
      });
    });

    it('should return 404 if department not found', async () => {
      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getDepartmentById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    });
  });

  describe('createDepartment', () => {
    it('should create a new department', async () => {
      const mockNewDepartment = {
        id: '1',
        name: 'Poli Gigi',
        description: 'Poli untuk pemeriksaan gigi',
        headId: 'user2',
        head: {
          id: 'user2',
          fullName: 'Dr. Budi',
          role: 'DOCTOR'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'Poli Gigi',
          description: 'Poli untuk pemeriksaan gigi',
          headId: 'user2',
        }
      } as MockRequest;

      mockedPrisma.user.findUnique = jest.fn().mockResolvedValue({
        id: 'user2',
        fullName: 'Dr. Budi',
        role: 'DOCTOR'
      });
      
      mockedPrisma.department.create = jest.fn().mockResolvedValue(mockNewDepartment);

      const res = createMockResponse();

      await createDepartment(mockReq as Request, res);

      expect(mockedPrisma.department.create).toHaveBeenCalledWith({
        data: {
          name: 'Poli Gigi',
          description: 'Poli untuk pemeriksaan gigi',
          headId: 'user2',
        },
        include: {
          head: {
            select: {
              id: true,
              fullName: true,
              role: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data departemen',
        data: mockNewDepartment
      });
    });

    it('should return 404 if user not found', async () => {
      const mockReq = {
        body: {
          name: 'Poli Gigi',
          description: 'Poli untuk pemeriksaan gigi',
          headId: 'nonexistent',
        }
      } as MockRequest;

      mockedPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createDepartment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User tidak ditemukan'
      });
    });
  });

  describe('updateDepartment', () => {
    it('should update an existing department', async () => {
      const mockExistingDepartment = {
        id: '1',
        name: 'Poli Gigi',
        description: 'Poli untuk pemeriksaan gigi',
        headId: 'user2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedDepartment = {
        ...mockExistingDepartment,
        name: 'Poli Gigi dan Mulut',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingDepartment,
          name: 'Poli Gigi dan Mulut',
        }
      } as MockRequest;

      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(mockExistingDepartment);
      mockedPrisma.user.findUnique = jest.fn().mockResolvedValue({
        id: 'user2',
        fullName: 'Dr. Budi',
        role: 'DOCTOR'
      });
      mockedPrisma.department.update = jest.fn().mockResolvedValue(mockUpdatedDepartment);

      const res = createMockResponse();

      await updateDepartment(mockReq as Request, res);

      expect(mockedPrisma.department.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Poli Gigi dan Mulut',
          description: 'Poli untuk pemeriksaan gigi',
          headId: 'user2',
        },
        include: {
          head: {
            select: {
              id: true,
              fullName: true,
              role: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data departemen',
        data: mockUpdatedDepartment
      });
    });

    it('should return 404 if department to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Poli Gigi',
          description: 'Poli untuk pemeriksaan gigi',
          headId: 'user2',
        }
      } as MockRequest;

      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateDepartment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    });
  });

  describe('deleteDepartment', () => {
    it('should delete a department', async () => {
      const mockDepartment = {
        id: '1',
        name: 'Poli Gigi',
        description: 'Poli untuk pemeriksaan gigi',
        headId: 'user2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(mockDepartment);
      mockedPrisma.department.delete = jest.fn().mockResolvedValue(mockDepartment);

      const res = createMockResponse();

      await deleteDepartment(mockReq as Request, res);

      expect(mockedPrisma.department.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data departemen'
      });
    });

    it('should return 404 if department to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.department.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteDepartment(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data departemen tidak ditemukan'
      });
    });
  });
});
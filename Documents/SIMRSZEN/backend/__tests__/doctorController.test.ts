import { Request, Response } from 'express';
import { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../src/controllers/doctorController';
import prisma from '../src/config/db';

// Mock prisma
jest.mock('../src/config/db');

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

describe('Doctor Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDoctors', () => {
    it('should return all doctors', async () => {
      const mockDoctors = [
        {
          id: '1',
          nip: '1234567890',
          fullName: 'Dr. John Doe',
          specialization: 'Umum',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Example 123',
          licenseNumber: 'STR123456',
          employmentDate: new Date('2020-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.doctor.findMany.mockResolvedValue(mockDoctors);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllDoctors(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data dokter',
        data: mockDoctors
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.doctor.findMany.mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllDoctors(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data dokter',
        error: 'Database error'
      });
    });
  });

  describe('getDoctorById', () => {
    it('should return doctor by ID', async () => {
      const mockDoctor = {
        id: '1',
        nip: '1234567890',
        fullName: 'Dr. John Doe',
        specialization: 'Umum',
        phone: '081234567890',
        email: 'john@example.com',
        address: 'Jl. Example 123',
        licenseNumber: 'STR123456',
        employmentDate: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.doctor.findUnique.mockResolvedValue(mockDoctor);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getDoctorById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data dokter',
        data: mockDoctor
      });
    });

    it('should return 404 if doctor not found', async () => {
      mockedPrisma.doctor.findUnique.mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getDoctorById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    });
  });

  describe('createDoctor', () => {
    it('should create a new doctor', async () => {
      const mockNewDoctor = {
        id: '1',
        nip: '1234567890',
        fullName: 'Dr. John Doe',
        specialization: 'Umum',
        phone: '081234567890',
        email: 'john@example.com',
        address: 'Jl. Example 123',
        licenseNumber: 'STR123456',
        employmentDate: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          nip: '1234567890',
          fullName: 'Dr. John Doe',
          specialization: 'Umum',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Example 123',
          licenseNumber: 'STR123456',
          employmentDate: '2020-01-01',
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(null); // No existing doctor with this NIP
      mockedPrisma.doctor.create.mockResolvedValue(mockNewDoctor);

      const res = createMockResponse();

      await createDoctor(mockReq as Request, res);

      expect(mockedPrisma.doctor.create).toHaveBeenCalledWith({
        data: {
          nip: '1234567890',
          fullName: 'Dr. John Doe',
          specialization: 'Umum',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Example 123',
          licenseNumber: 'STR123456',
          employmentDate: new Date('2020-01-01'),
        },
        select: {
          id: true,
          nip: true,
          fullName: true,
          specialization: true,
          phone: true,
          email: true,
          address: true,
          licenseNumber: true,
          employmentDate: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data dokter',
        data: mockNewDoctor
      });
    });

    it('should return error if NIP already exists', async () => {
      const existingDoctor = {
        id: '1',
        nip: '1234567890',
        fullName: 'Dr. John Doe',
        specialization: 'Umum',
        phone: '081234567890',
        email: 'john@example.com',
        address: 'Jl. Example 123',
        licenseNumber: 'STR123456',
        employmentDate: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          nip: '1234567890',
          fullName: 'Dr. John Doe',
          specialization: 'Umum',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Example 123',
          licenseNumber: 'STR123456',
          employmentDate: '2020-01-01',
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(existingDoctor); // Existing doctor with this NIP

      const res = createMockResponse();

      await createDoctor(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'NIP sudah terdaftar dalam sistem'
      });
    });
  });

  describe('updateDoctor', () => {
    it('should update an existing doctor', async () => {
      const mockExistingDoctor = {
        id: '1',
        nip: '1234567890',
        fullName: 'Dr. John Doe',
        specialization: 'Umum',
        phone: '081234567890',
        email: 'john@example.com',
        address: 'Jl. Example 123',
        licenseNumber: 'STR123456',
        employmentDate: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedDoctor = {
        ...mockExistingDoctor,
        fullName: 'Dr. John Smith',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingDoctor,
          fullName: 'Dr. John Smith',
          employmentDate: '2020-01-01',
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(mockExistingDoctor);
      mockedPrisma.doctor.update.mockResolvedValue(mockUpdatedDoctor);

      const res = createMockResponse();

      await updateDoctor(mockReq as Request, res);

      expect(mockedPrisma.doctor.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingDoctor,
          fullName: 'Dr. John Smith',
          employmentDate: new Date('2020-01-01'),
        },
        select: {
          id: true,
          nip: true,
          fullName: true,
          specialization: true,
          phone: true,
          email: true,
          address: true,
          licenseNumber: true,
          employmentDate: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data dokter',
        data: mockUpdatedDoctor
      });
    });

    it('should return 404 if doctor to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          nip: '1234567890',
          fullName: 'Dr. John Doe',
          specialization: 'Umum',
          phone: '081234567890',
          email: 'john@example.com',
          address: 'Jl. Example 123',
          licenseNumber: 'STR123456',
          employmentDate: '2020-01-01',
        }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await updateDoctor(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    });
  });

  describe('deleteDoctor', () => {
    it('should soft delete a doctor', async () => {
      const mockDoctor = {
        id: '1',
        nip: '1234567890',
        fullName: 'Dr. John Doe',
        specialization: 'Umum',
        phone: '081234567890',
        email: 'john@example.com',
        address: 'Jl. Example 123',
        licenseNumber: 'STR123456',
        employmentDate: new Date('2020-01-01'),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(mockDoctor);
      mockedPrisma.doctor.update.mockResolvedValue({
        ...mockDoctor,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const res = createMockResponse();

      await deleteDoctor(mockReq as Request, res);

      expect(mockedPrisma.doctor.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data dokter'
      });
    });

    it('should return 404 if doctor to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.doctor.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await deleteDoctor(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data dokter tidak ditemukan'
      });
    });
  });
});


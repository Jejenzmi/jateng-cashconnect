import { Request, Response } from 'express';
import { 
  getAllPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../src/controllers/patientController';
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

describe('Patient Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        {
          id: '1',
          nik: '1234567890123456',
          medicalRecordNumber: 'MR123456',
          name: 'John Doe',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'L',
          bloodType: 'A',
          bpjsNumber: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.patient.findMany.mockResolvedValue(mockPatients);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPatients(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pasien',
        data: mockPatients
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.patient.findMany.mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPatients(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data pasien',
        error: 'Database error'
      });
    });
  });

  describe('getPatientById', () => {
    it('should return patient by ID', async () => {
      const mockPatient = {
        id: '1',
        nik: '1234567890123456',
        medicalRecordNumber: 'MR123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'L',
        bloodType: 'A',
        bpjsNumber: '1234567890',
        phone: '081234567890',
        address: 'Jl. Example 123',
        occupation: 'Software Engineer',
        maritalStatus: 'Menikah',
        religion: 'Islam',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '081234567891',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.patient.findUnique.mockResolvedValue(mockPatient);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getPatientById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data pasien',
        data: mockPatient
      });
    });

    it('should return 404 if patient not found', async () => {
      mockedPrisma.patient.findUnique.mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getPatientById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    });
  });

  describe('createPatient', () => {
    it('should create a new patient', async () => {
      const mockNewPatient = {
        id: '1',
        nik: '1234567890123456',
        medicalRecordNumber: 'MR123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'L',
        bloodType: 'A',
        bpjsNumber: '1234567890',
        phone: '081234567890',
        address: 'Jl. Example 123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          nik: '1234567890123456',
          name: 'John Doe',
          dateOfBirth: '1990-01-01',
          gender: 'L',
          bloodType: 'A',
          bpjsNumber: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(null); // No existing patient with this NIK
      mockedPrisma.patient.create.mockResolvedValue(mockNewPatient);

      const res = createMockResponse();

      await createPatient(mockReq as Request, res);

      expect(mockedPrisma.patient.create).toHaveBeenCalledWith({
        data: {
          nik: '1234567890123456',
          name: 'John Doe',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'L',
          bloodType: 'A',
          bpjsNumber: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
        },
        select: {
          id: true,
          nik: true,
          medicalRecordNumber: true,
          name: true,
          dateOfBirth: true,
          gender: true,
          bloodType: true,
          bpjsNumber: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data pasien',
        data: mockNewPatient
      });
    });

    it('should return error if NIK already exists', async () => {
      const existingPatient = {
        id: '1',
        nik: '1234567890123456',
        medicalRecordNumber: 'MR123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'L',
        bloodType: 'A',
        bpjsNumber: '1234567890',
        phone: '081234567890',
        address: 'Jl. Example 123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          nik: '1234567890123456',
          name: 'John Doe',
          dateOfBirth: '1990-01-01',
          gender: 'L',
          bloodType: 'A',
          bpjsNumber: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(existingPatient); // Existing patient with this NIK

      const res = createMockResponse();

      await createPatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'NIK sudah terdaftar dalam sistem'
      });
    });
  });

  describe('updatePatient', () => {
    it('should update an existing patient', async () => {
      const mockExistingPatient = {
        id: '1',
        nik: '1234567890123456',
        medicalRecordNumber: 'MR123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'L',
        bloodType: 'A',
        bpjsNumber: '1234567890',
        phone: '081234567890',
        address: 'Jl. Example 123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedPatient = {
        ...mockExistingPatient,
        name: 'John Smith',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingPatient,
          name: 'John Smith',
          dateOfBirth: '1990-01-01',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(mockExistingPatient);
      mockedPrisma.patient.update.mockResolvedValue(mockUpdatedPatient);

      const res = createMockResponse();

      await updatePatient(mockReq as Request, res);

      expect(mockedPrisma.patient.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingPatient,
          name: 'John Smith',
          dateOfBirth: new Date('1990-01-01'),
        },
        select: {
          id: true,
          nik: true,
          medicalRecordNumber: true,
          name: true,
          dateOfBirth: true,
          gender: true,
          bloodType: true,
          bpjsNumber: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data pasien',
        data: mockUpdatedPatient
      });
    });

    it('should return 404 if patient to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          nik: '1234567890123456',
          name: 'John Doe',
          dateOfBirth: '1990-01-01',
          gender: 'L',
          bloodType: 'A',
          bpjsNumber: '1234567890',
          phone: '081234567890',
          address: 'Jl. Example 123',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await updatePatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    });
  });

  describe('deletePatient', () => {
    it('should soft delete a patient', async () => {
      const mockPatient = {
        id: '1',
        nik: '1234567890123456',
        medicalRecordNumber: 'MR123456',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'L',
        bloodType: 'A',
        bpjsNumber: '1234567890',
        phone: '081234567890',
        address: 'Jl. Example 123',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(mockPatient);
      mockedPrisma.patient.update.mockResolvedValue({
        ...mockPatient,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const res = createMockResponse();

      await deletePatient(mockReq as Request, res);

      expect(mockedPrisma.patient.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data pasien'
      });
    });

    it('should return 404 if patient to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.patient.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await deletePatient(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data pasien tidak ditemukan'
      });
    });
  });
});


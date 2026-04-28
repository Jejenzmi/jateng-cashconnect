import { Request, Response } from 'express';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
} from '../src/controllers/medicineController';
import prisma from '../src/config/db';

// Define proper types for medicine
interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  price: number;
  stock: number;
  unit: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock prisma
jest.mock('../src/config/db');

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

// Define a type for our mock request
type MockRequest = Partial<Request> & {
  params?: any;
  body?: any;
};

// Mock response object with proper typing
const createMockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockImplementation((statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  });
  res.json = jest.fn().mockImplementation((body: any) => {
    res.body = body;
    return res;
  });
  res.send = jest.fn().mockImplementation((body: any) => {
    res.body = body;
    return res;
  });
  return res;
};

describe('Medicine Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMedicines', () => {
    it('should return all medicines', async () => {
      const mockMedicines = [
        {
          id: '1',
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'Kimia Farma',
          price: 1500,
          stock: 100,
          unit: 'tablet',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.medicine.findMany.mockResolvedValue(mockMedicines);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllMedicines(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data obat',
        data: mockMedicines
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.medicine.findMany.mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllMedicines(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data obat',
        error: 'Database error'
      });
    });
  });

  describe('getMedicineById', () => {
    it('should return medicine by ID', async () => {
      const mockMedicine = {
        id: '1',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        price: 1500,
        stock: 100,
        unit: 'tablet',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.medicine.findUnique.mockResolvedValue(mockMedicine);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getMedicineById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data obat',
        data: mockMedicine
      });
    });

    it('should return 404 if medicine not found', async () => {
      mockedPrisma.medicine.findUnique.mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getMedicineById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    });
  });

  describe('createMedicine', () => {
    it('should create a new medicine', async () => {
      const mockNewMedicine = {
        id: '1',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        price: 1500,
        stock: 100,
        unit: 'tablet',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'Kimia Farma',
          price: 1500,
          stock: 100,
          unit: 'tablet',
        }
      } as MockRequest;

      mockedPrisma.medicine.create.mockResolvedValue(mockNewMedicine);

      const res = createMockResponse();

      await createMedicine(mockReq as Request, res);

      expect(mockedPrisma.medicine.create).toHaveBeenCalledWith({
        data: {
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'Kimia Farma',
          price: 1500,
          stock: 100,
          unit: 'tablet',
        },
        select: {
          id: true,
          name: true,
          genericName: true,
          dosageForm: true,
          strength: true,
          manufacturer: true,
          price: true,
          stock: true,
          unit: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data obat',
        data: mockNewMedicine
      });
    });
  });

  describe('updateMedicine', () => {
    it('should update an existing medicine', async () => {
      const mockExistingMedicine = {
        id: '1',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        price: 1500,
        stock: 100,
        unit: 'tablet',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedMedicine = {
        ...mockExistingMedicine,
        name: 'Ibuprofen',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingMedicine,
          name: 'Ibuprofen',
        }
      } as MockRequest;

      mockedPrisma.medicine.findUnique.mockResolvedValue(mockExistingMedicine);
      mockedPrisma.medicine.update.mockResolvedValue(mockUpdatedMedicine);

      const res = createMockResponse();

      await updateMedicine(mockReq as Request, res);

      expect(mockedPrisma.medicine.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingMedicine,
          name: 'Ibuprofen',
        },
        select: {
          id: true,
          name: true,
          genericName: true,
          dosageForm: true,
          strength: true,
          manufacturer: true,
          price: true,
          stock: true,
          unit: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data obat',
        data: mockUpdatedMedicine
      });
    });

    it('should return 404 if medicine to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'Kimia Farma',
          price: 1500,
          stock: 100,
          unit: 'tablet',
        }
      } as MockRequest;

      mockedPrisma.medicine.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await updateMedicine(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    });
  });

  describe('deleteMedicine', () => {
    it('should soft delete a medicine', async () => {
      const mockMedicine = {
        id: '1',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        price: 1500,
        stock: 100,
        unit: 'tablet',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.medicine.findUnique.mockResolvedValue(mockMedicine);
      mockedPrisma.medicine.update.mockResolvedValue({
        ...mockMedicine,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const res = createMockResponse();

      await deleteMedicine(mockReq as Request, res);

      expect(mockedPrisma.medicine.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data obat'
      });
    });

    it('should return 404 if medicine to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.medicine.findUnique.mockResolvedValue(null);

      const res = createMockResponse();

      await deleteMedicine(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data obat tidak ditemukan'
      });
    });
  });
});


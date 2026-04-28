import { Request, Response } from 'express';
import { 
  getAllPrescriptionItems, 
  getPrescriptionItemByID, 
  createPrescriptionItem, 
  updatePrescriptionItem, 
  deletePrescriptionItem
} from '../src/controllers/prescriptionItemController';
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

describe('PrescriptionItem Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPrescriptionItems', () => {
    it('should return all prescription items', async () => {
      const mockPrescriptionItems = [
        {
          id: '1',
          prescriptionId: 'prescription1',
          prescription: {
            id: 'prescription1',
            visit: {
              id: 'visit1',
              visitNumber: 'VISIT-001',
              patient: {
                id: 'patient1',
                name: 'John Doe',
                medicalRecordNumber: 'RM-001',
              }
            }
          },
          medicineId: 'medicine1',
          medicine: {
            id: 'medicine1',
            name: 'Paracetamol',
            price: 5000,
          },
          quantity: 10,
          dosage: '1 tablet',
          frequency: '3 kali sehari',
          duration: 7,
          notes: 'Setelah makan',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.prescriptionItem.findMany = jest.fn().mockResolvedValue(mockPrescriptionItems);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPrescriptionItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item resep obat',
        data: mockPrescriptionItems
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.prescriptionItem.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPrescriptionItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data item resep obat',
        error: 'Database error'
      });
    });
  });

  describe('getPrescriptionItemByID', () => {
    it('should return prescription item by ID', async () => {
      const mockPrescriptionItem = {
        id: '1',
        prescriptionId: 'prescription1',
        prescription: {
          id: 'prescription1',
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
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
            }
          }
        },
        medicineId: 'medicine1',
        medicine: {
          id: 'medicine1',
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'Pharma Co.',
          price: 5000,
          stock: 100,
          unit: 'tablet',
        },
        quantity: 10,
        dosage: '1 tablet',
        frequency: '3 kali sehari',
        duration: 7,
        notes: 'Setelah makan',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(mockPrescriptionItem);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getPrescriptionItemByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item resep obat',
        data: mockPrescriptionItem
      });
    });

    it('should return 404 if prescription item not found', async () => {
      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getPrescriptionItemByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    });
  });

  describe('createPrescriptionItem', () => {
    it('should create a new prescription item', async () => {
      const mockNewPrescriptionItem = {
        id: '1',
        prescriptionId: 'prescription1',
        prescription: {
          id: 'prescription1',
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
            patient: {
              id: 'patient1',
              name: 'John Doe',
              medicalRecordNumber: 'RM-001',
            }
          }
        },
        medicineId: 'medicine1',
        medicine: {
          id: 'medicine1',
          name: 'Paracetamol',
          price: 5000,
        },
        quantity: 10,
        dosage: '1 tablet',
        frequency: '3 kali sehari',
        duration: 7,
        notes: 'Setelah makan',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          prescriptionId: 'prescription1',
          medicineId: 'medicine1',
          quantity: 10,
          dosage: '1 tablet',
          frequency: '3 kali sehari',
          duration: 7,
          notes: 'Setelah makan',
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue({
        id: 'prescription1',
        visitId: 'visit1',
      });
      
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 100,
        unit: 'tablet',
      });
      
      mockedPrisma.medicine.update = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 90, // 100 - 10
        unit: 'tablet',
      });
      
      mockedPrisma.prescriptionItem.create = jest.fn().mockResolvedValue(mockNewPrescriptionItem);

      const res = createMockResponse();

      await createPrescriptionItem(mockReq as Request, res);

      expect(mockedPrisma.prescriptionItem.create).toHaveBeenCalledWith({
        data: {
          prescriptionId: 'prescription1',
          medicineId: 'medicine1',
          quantity: 10,
          dosage: '1 tablet',
          frequency: '3 kali sehari',
          duration: 7,
          notes: 'Setelah makan',
        },
        include: {
          prescription: {
            include: {
              visit: {
                include: {
                  patient: {
                    select: {
                      id: true,
                      name: true,
                      medicalRecordNumber: true,
                    }
                  }
                }
              }
            }
          },
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan item resep obat',
        data: mockNewPrescriptionItem
      });
    });

    it('should return 404 if prescription not found', async () => {
      const mockReq = {
        body: {
          prescriptionId: 'nonexistent',
          medicineId: 'medicine1',
          quantity: 10,
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createPrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resep obat tidak ditemukan'
      });
    });

    it('should return 404 if medicine not found', async () => {
      const mockReq = {
        body: {
          prescriptionId: 'prescription1',
          medicineId: 'nonexistent',
          quantity: 10,
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue({
        id: 'prescription1',
        visitId: 'visit1',
      });
      
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createPrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Obat tidak ditemukan'
      });
    });

    it('should return 400 if stock is insufficient', async () => {
      const mockReq = {
        body: {
          prescriptionId: 'prescription1',
          medicineId: 'medicine1',
          quantity: 1000, // More than available stock
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue({
        id: 'prescription1',
        visitId: 'visit1',
      });
      
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 10, // Only 10 available
        unit: 'tablet',
      });

      const res = createMockResponse();

      await createPrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Stok obat tidak mencukupi. Tersedia: 10, Diminta: 1000'
      });
    });
  });

  describe('updatePrescriptionItem', () => {
    it('should update an existing prescription item', async () => {
      const mockExistingItem = {
        id: '1',
        prescriptionId: 'prescription1',
        medicineId: 'medicine1',
        quantity: 5,
        dosage: '1 tablet',
        frequency: '2 kali sehari',
        duration: 5,
        notes: 'Sebelum makan',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedItem = {
        ...mockExistingItem,
        quantity: 10,
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          quantity: 10,
        }
      } as MockRequest;

      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(mockExistingItem);
      mockedPrisma.prescriptionItem.update = jest.fn().mockResolvedValue(mockUpdatedItem);
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 5, // 10 - 5 = 5 remaining after old quantity
        unit: 'tablet',
      });
      mockedPrisma.medicine.update = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 0, // 5 - 5 = 0 (difference is 10-5=5 to subtract)
        unit: 'tablet',
      });

      const res = createMockResponse();

      await updatePrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui item resep obat',
        data: mockUpdatedItem
      });
    });

    it('should return 404 if prescription item to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          quantity: 10,
        }
      } as MockRequest;

      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updatePrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    });
  });

  describe('deletePrescriptionItem', () => {
    it('should delete a prescription item and restore stock', async () => {
      const mockPrescriptionItem = {
        id: '1',
        prescriptionId: 'prescription1',
        medicineId: 'medicine1',
        quantity: 10,
        dosage: '1 tablet',
        frequency: '3 kali sehari',
        duration: 7,
        notes: 'Setelah makan',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(mockPrescriptionItem);
      mockedPrisma.medicine.update = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: 5000,
        stock: 110, // 100 + 10 (restore quantity)
        unit: 'tablet',
      });
      mockedPrisma.prescriptionItem.delete = jest.fn().mockResolvedValue(mockPrescriptionItem);

      const res = createMockResponse();

      await deletePrescriptionItem(mockReq as Request, res);

      expect(mockedPrisma.prescriptionItem.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus item resep obat'
      });
    });

    it('should return 404 if prescription item to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.prescriptionItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deletePrescriptionItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item resep obat tidak ditemukan'
      });
    });
  });
});
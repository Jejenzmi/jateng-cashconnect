import { Request, Response } from 'express';
import { 
  getAllBillItems, 
  getBillItemByID, 
  createBillItem, 
  updateBillItem, 
  deleteBillItem
} from '../src/controllers/billItemController';
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

describe('BillItem Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBillItems', () => {
    it('should return all bill items', async () => {
      const mockBillItems = [
        {
          id: '1',
          billId: 'bill1',
          bill: {
            id: 'bill1',
            patient: {
              id: 'patient1',
              name: 'John Doe',
              medicalRecordNumber: 'RM-001',
            },
            visit: {
              id: 'visit1',
              visitNumber: 'VISIT-001',
            }
          },
          itemName: 'Biaya Konsultasi',
          quantity: 1,
          unitPrice: 100000,
          totalPrice: 100000,
          notes: 'Biaya konsultasi dokter spesialis',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.billItem.findMany = jest.fn().mockResolvedValue(mockBillItems);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBillItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item tagihan',
        data: mockBillItems
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.billItem.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBillItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data item tagihan',
        error: 'Database error'
      });
    });
  });

  describe('getBillItemByID', () => {
    it('should return bill item by ID', async () => {
      const mockBillItem = {
        id: '1',
        billId: 'bill1',
        bill: {
          id: 'bill1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
            nik: '123456789',
            phone: '081234567890',
            address: 'Jl. Example 123',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          }
        },
        itemName: 'Biaya Konsultasi',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        notes: 'Biaya konsultasi dokter spesialis',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(mockBillItem);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getBillItemByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item tagihan',
        data: mockBillItem
      });
    });

    it('should return 404 if bill item not found', async () => {
      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getBillItemByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    });
  });

  describe('createBillItem', () => {
    it('should create a new bill item', async () => {
      const mockNewBillItem = {
        id: '1',
        billId: 'bill1',
        bill: {
          id: 'bill1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          }
        },
        itemName: 'Biaya Konsultasi',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        notes: 'Biaya konsultasi dokter spesialis',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          billId: 'bill1',
          itemName: 'Biaya Konsultasi',
          quantity: 1,
          unitPrice: 100000,
          notes: 'Biaya konsultasi dokter spesialis',
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue({
        id: 'bill1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: 100000,
        discountAmount: 0,
        finalAmount: 100000,
      });
      
      mockedPrisma.billItem.create = jest.fn().mockResolvedValue(mockNewBillItem);
      mockedPrisma.billItem.findMany = jest.fn().mockResolvedValue([mockNewBillItem]);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue({
        id: 'bill1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: 100000,
        discountAmount: 0,
        finalAmount: 100000,
      });

      const res = createMockResponse();

      await createBillItem(mockReq as Request, res);

      expect(mockedPrisma.billItem.create).toHaveBeenCalledWith({
        data: {
          billId: 'bill1',
          itemName: 'Biaya Konsultasi',
          quantity: 1,
          unitPrice: 100000,
          totalPrice: 100000,
          notes: 'Biaya konsultasi dokter spesialis',
        },
        include: {
          bill: {
            include: {
              patient: {
                select: {
                  id: true,
                  name: true,
                  medicalRecordNumber: true,
                }
              },
              visit: {
                select: {
                  id: true,
                  visitNumber: true,
                }
              }
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan item tagihan',
        data: mockNewBillItem
      });
    });

    it('should return 404 if bill not found', async () => {
      const mockReq = {
        body: {
          billId: 'nonexistent',
          itemName: 'Biaya Konsultasi',
          quantity: 1,
          unitPrice: 100000,
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createBillItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    });

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        body: {
          billId: 'bill1',
          itemName: 'Biaya Konsultasi',
          quantity: 2,
          unitPrice: 50000,
          totalPrice: 150000, // This doesn't match quantity * unitPrice
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue({
        id: 'bill1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: 100000,
        discountAmount: 0,
        finalAmount: 100000,
      });

      const res = createMockResponse();

      await createBillItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Total harga harus sama dengan jumlah dikali harga satuan'
      });
    });
  });

  describe('updateBillItem', () => {
    it('should update an existing bill item', async () => {
      const mockExistingItem = {
        id: '1',
        billId: 'bill1',
        bill: {
          id: 'bill1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          }
        },
        itemName: 'Biaya Konsultasi Lama',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        notes: 'Biaya konsultasi dokter spesialis',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedItem = {
        ...mockExistingItem,
        itemName: 'Biaya Konsultasi Baru',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          itemName: 'Biaya Konsultasi Baru',
        }
      } as MockRequest;

      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(mockExistingItem);
      mockedPrisma.billItem.update = jest.fn().mockResolvedValue(mockUpdatedItem);
      mockedPrisma.billItem.findMany = jest.fn().mockResolvedValue([mockUpdatedItem]);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue({
        id: 'bill1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: 100000,
        discountAmount: 0,
        finalAmount: 100000,
      });

      const res = createMockResponse();

      await updateBillItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui item tagihan',
        data: mockUpdatedItem
      });
    });

    it('should return 404 if bill item to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          itemName: 'Updated Item Name',
        }
      } as MockRequest;

      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateBillItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    });
  });

  describe('deleteBillItem', () => {
    it('should delete a bill item and update bill total', async () => {
      const mockBillItem = {
        id: '1',
        billId: 'bill1',
        itemName: 'Biaya Konsultasi',
        quantity: 1,
        unitPrice: 100000,
        totalPrice: 100000,
        notes: 'Biaya konsultasi dokter spesialis',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(mockBillItem);
      mockedPrisma.billItem.delete = jest.fn().mockResolvedValue(mockBillItem);
      mockedPrisma.billItem.findMany = jest.fn().mockResolvedValue([]);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue({
        id: 'bill1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
      });

      const res = createMockResponse();

      await deleteBillItem(mockReq as Request, res);

      expect(mockedPrisma.billItem.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus item tagihan'
      });
    });

    it('should return 404 if bill item to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.billItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteBillItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item tagihan tidak ditemukan'
      });
    });
  });
});
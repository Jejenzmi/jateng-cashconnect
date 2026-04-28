import { Request, Response } from 'express';
import { 
  getAllBills, 
  getBillByID, 
  createBill, 
  updateBill, 
  deleteBill
} from '../src/controllers/billController';
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

describe('Bill Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBills', () => {
    it('should return all bills', async () => {
      const mockBills = [
        {
          id: '1',
          patientId: 'patient1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'RM-001',
          },
          visitId: 'visit1',
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          items: [
            {
              id: 'item1',
              itemName: 'Biaya Konsultasi',
              quantity: 1,
              unitPrice: 100000,
              totalPrice: 100000,
              notes: 'Biaya konsultasi dokter spesialis',
            }
          ],
          totalAmount: 100000,
          discountPercent: 0,
          discountAmount: 0,
          finalAmount: 100000,
          paymentStatus: 'pending',
          paymentMethod: null,
          notes: 'Tagihan pertama',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.bill.findMany = jest.fn().mockResolvedValue(mockBills);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBills(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tagihan',
        data: mockBills
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.bill.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBills(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data tagihan',
        error: 'Database error'
      });
    });
  });

  describe('getBillByID', () => {
    it('should return bill by ID', async () => {
      const mockBill = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
          nik: '123456789',
          phone: '081234567890',
          address: 'Jl. Example 123',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [
          {
            id: 'item1',
            itemName: 'Biaya Konsultasi',
            quantity: 1,
            unitPrice: 100000,
            totalPrice: 100000,
            notes: 'Biaya konsultasi dokter spesialis',
          }
        ],
        totalAmount: 100000,
        discountPercent: 0,
        discountAmount: 0,
        finalAmount: 100000,
        paymentStatus: 'pending',
        paymentMethod: null,
        notes: 'Tagihan pertama',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockBill);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getBillByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tagihan',
        data: mockBill
      });
    });

    it('should return 404 if bill not found', async () => {
      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getBillByID(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    });
  });

  describe('createBill', () => {
    it('should create a new bill', async () => {
      const mockNewBill = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [],
        totalAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        finalAmount: 0,
        paymentStatus: 'pending',
        paymentMethod: null,
        notes: 'Tagihan pertama',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          discountPercent: 0,
          discountAmount: 0,
          paymentStatus: 'pending',
          notes: 'Tagihan pertama',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        medicalRecordNumber: 'RM-001',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VISIT-001',
      });
      
      mockedPrisma.bill.create = jest.fn().mockResolvedValue(mockNewBill);

      const res = createMockResponse();

      await createBill(mockReq as Request, res);

      expect(mockedPrisma.bill.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient1',
          visitId: 'visit1',
          totalAmount: 0,
          discountAmount: 0,
          discountPercent: 0,
          finalAmount: 0,
          paymentStatus: 'pending',
          paymentMethod: null,
          notes: 'Tagihan pertama',
        },
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
          },
          items: {
            select: {
              id: true,
              itemName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              notes: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan tagihan',
        data: mockNewBill
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          visitId: 'visit1',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Pasien tidak ditemukan'
      });
    });

    it('should return 404 if visit not found', async () => {
      const mockReq = {
        body: {
          patientId: 'patient1',
          visitId: 'nonexistent',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        medicalRecordNumber: 'RM-001',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kunjungan tidak ditemukan'
      });
    });
  });

  describe('updateBill', () => {
    it('should update an existing bill', async () => {
      const mockExistingBill = {
        id: '1',
        patientId: 'patient1',
        patient: {
          id: 'patient1',
          name: 'John Doe',
          medicalRecordNumber: 'RM-001',
        },
        visitId: 'visit1',
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [],
        totalAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        finalAmount: 0,
        paymentStatus: 'pending',
        paymentMethod: null,
        notes: 'Tagihan pertama',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedBill = {
        ...mockExistingBill,
        notes: 'Tagihan yang diperbarui',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          notes: 'Tagihan yang diperbarui',
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockExistingBill);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue(mockUpdatedBill);

      const res = createMockResponse();

      await updateBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui tagihan',
        data: mockUpdatedBill
      });
    });

    it('should return 404 if bill to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          notes: 'Updated Notes',
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    });
  });

  describe('deleteBill', () => {
    it('should delete a bill', async () => {
      const mockBill = {
        id: '1',
        patientId: 'patient1',
        visitId: 'visit1',
        items: [],
        totalAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        finalAmount: 0,
        paymentStatus: 'pending',
        paymentMethod: null,
        notes: 'Tagihan pertama',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockBill);
      mockedPrisma.billItem.deleteMany = jest.fn().mockResolvedValue({});
      mockedPrisma.bill.delete = jest.fn().mockResolvedValue(mockBill);

      const res = createMockResponse();

      await deleteBill(mockReq as Request, res);

      expect(mockedPrisma.billItem.deleteMany).toHaveBeenCalledWith({
        where: { billId: '1' }
      });

      expect(mockedPrisma.bill.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus tagihan'
      });
    });

    it('should return 404 if bill to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    });
  });
});
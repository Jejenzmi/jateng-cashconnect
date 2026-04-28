import { Request, Response } from 'express';
import { 
  getAllBills, 
  getBillById, 
  createBill, 
  updateBill, 
  deleteBill,
  updatePaymentStatus
} from '../src/controllers/billingController';
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

describe('Billing Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBills', () => {
    it('should return all bills', async () => {
      const mockBills = [
        {
          id: '1',
          patientId: 'patient1',
          visitId: 'visit1',
          totalAmount: new Decimal(500000),
          discountPercent: new Decimal(10),
          discountAmount: new Decimal(50000),
          finalAmount: new Decimal(450000),
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          paidAt: new Date(),
          notes: 'Pembayaran lunas',
          createdAt: new Date(),
          updatedAt: new Date(),
          patient: {
            id: 'patient1',
            name: 'John Doe',
            nik: '1234567890123456',
          },
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
          },
          items: [
            {
              id: 'item1',
              billId: '1',
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: new Decimal(300000),
              totalPrice: new Decimal(300000),
              notes: 'Pemeriksaan umum',
            },
            {
              id: 'item2',
              billId: '1',
              itemName: 'Biaya Obat',
              quantity: 2,
              unitPrice: new Decimal(100000),
              totalPrice: new Decimal(200000),
              notes: 'Obat generik',
            }
          ]
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

  describe('getBillById', () => {
    it('should return bill by ID', async () => {
      const mockBill = {
        id: '1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        paidAt: new Date(),
        notes: 'Pembayaran lunas',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890123456',
          medicalRecordNumber: 'MRN-001',
        },
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [
          {
            id: 'item1',
            billId: '1',
            itemName: 'Biaya Pemeriksaan',
            quantity: 1,
            unitPrice: new Decimal(300000),
            totalPrice: new Decimal(300000),
            notes: 'Pemeriksaan umum',
          }
        ]
      };

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockBill);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getBillById(req as Request, res);

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

      await getBillById(req as Request, res);

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
        visitId: 'visit1',
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'unpaid',
        paymentMethod: null,
        paidAt: null,
        notes: 'Pembayaran awal',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890123456',
        },
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [
          {
            id: 'item1',
            billId: '1',
            itemName: 'Biaya Pemeriksaan',
            quantity: 1,
            unitPrice: new Decimal(300000),
            totalPrice: new Decimal(300000),
            notes: 'Pemeriksaan umum',
          }
        ]
      };

      const mockReq = {
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          items: [
            {
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: 300000,
              totalPrice: 300000,
              notes: 'Pemeriksaan umum',
            }
          ],
          discountPercent: 10,
          notes: 'Pembayaran awal',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890123456',
      });
      
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VISIT-001',
      });

      mockedPrisma.bill.create = jest.fn().mockResolvedValue({
        id: '1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'unpaid',
        paymentMethod: null,
        paidAt: null,
        notes: 'Pembayaran awal',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.billItem.create = jest.fn().mockResolvedValue({
        id: 'item1',
        billId: '1',
        itemName: 'Biaya Pemeriksaan',
        quantity: 1,
        unitPrice: new Decimal(300000),
        totalPrice: new Decimal(300000),
        notes: 'Pemeriksaan umum',
      });

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockNewBill);

      const res = createMockResponse();

      await createBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data tagihan',
        data: mockNewBill
      });
    });

    it('should return 404 if patient not found', async () => {
      const mockReq = {
        body: {
          patientId: 'nonexistent',
          visitId: 'visit1',
          items: [
            {
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: 300000,
              totalPrice: 300000,
              notes: 'Pemeriksaan umum',
            }
          ],
          notes: 'Pembayaran awal',
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
          items: [
            {
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: 300000,
              totalPrice: 300000,
              notes: 'Pemeriksaan umum',
            }
          ],
          notes: 'Pembayaran awal',
        }
      } as MockRequest;

      mockedPrisma.patient.findUnique = jest.fn().mockResolvedValue({
        id: 'patient1',
        name: 'John Doe',
        nik: '1234567890123456',
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
        visitId: 'visit1',
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'unpaid',
        paymentMethod: null,
        paidAt: null,
        notes: 'Pembayaran awal',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'item1',
            billId: '1',
            itemName: 'Biaya Pemeriksaan',
            quantity: 1,
            unitPrice: new Decimal(300000),
            totalPrice: new Decimal(300000),
            notes: 'Pemeriksaan umum',
          }
        ]
      };

      const mockUpdatedBill = {
        ...mockExistingBill,
        notes: 'Pembayaran diperbarui',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingBill,
          notes: 'Pembayaran diperbarui',
          items: [
            {
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: 300000,
              totalPrice: 300000,
              notes: 'Pemeriksaan umum',
            }
          ]
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockExistingBill);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue(mockUpdatedBill);
      mockedPrisma.billItem.deleteMany = jest.fn().mockResolvedValue({});
      mockedPrisma.billItem.create = jest.fn().mockResolvedValue({});

      const res = createMockResponse();

      await updateBill(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data tagihan',
        data: mockUpdatedBill
      });
    });

    it('should return 404 if bill to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          patientId: 'patient1',
          visitId: 'visit1',
          items: [
            {
              itemName: 'Biaya Pemeriksaan',
              quantity: 1,
              unitPrice: 300000,
              totalPrice: 300000,
              notes: 'Pemeriksaan umum',
            }
          ],
          notes: 'Pembayaran awal',
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
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        paidAt: new Date(),
        notes: 'Pembayaran lunas',
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
        message: 'Berhasil menghapus data tagihan'
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

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const mockBill = {
        id: '1',
        patientId: 'patient1',
        visitId: 'visit1',
        totalAmount: new Decimal(500000),
        discountPercent: new Decimal(10),
        discountAmount: new Decimal(50000),
        finalAmount: new Decimal(450000),
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        paidAt: new Date(),
        notes: 'Pembayaran lunas',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: {
          id: 'patient1',
          name: 'John Doe',
          nik: '1234567890123456',
        },
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
        },
        items: [
          {
            id: 'item1',
            billId: '1',
            itemName: 'Biaya Pemeriksaan',
            quantity: 1,
            unitPrice: new Decimal(300000),
            totalPrice: new Decimal(300000),
            notes: 'Pemeriksaan umum',
          }
        ]
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          paymentStatus: 'paid',
          paymentMethod: 'cash'
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(mockBill);
      mockedPrisma.bill.update = jest.fn().mockResolvedValue(mockBill);

      const res = createMockResponse();

      await updatePaymentStatus(mockReq as Request, res);

      expect(mockedPrisma.bill.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          paidAt: expect.any(Date),
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              nik: true,
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
            }
          },
          items: true
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui status pembayaran',
        data: mockBill
      });
    });

    it('should return 400 if invalid payment status is provided', async () => {
      const mockReq = {
        params: { id: '1' },
        body: {
          paymentStatus: 'invalid_status'
        }
      } as MockRequest;

      const res = createMockResponse();

      await updatePaymentStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Status pembayaran tidak valid'
      });
    });

    it('should return 400 if invalid payment method is provided', async () => {
      const mockReq = {
        params: { id: '1' },
        body: {
          paymentStatus: 'paid',
          paymentMethod: 'invalid_method'
        }
      } as MockRequest;

      const res = createMockResponse();

      await updatePaymentStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Metode pembayaran tidak valid'
      });
    });

    it('should return 404 if bill to update payment status is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          paymentStatus: 'paid'
        }
      } as MockRequest;

      mockedPrisma.bill.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updatePaymentStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tagihan tidak ditemukan'
      });
    });
  });
});
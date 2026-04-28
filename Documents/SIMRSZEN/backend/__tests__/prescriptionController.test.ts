import { Request, Response } from 'express';
import { 
  getAllPrescriptions, 
  getPrescriptionById, 
  createPrescription, 
  updatePrescription, 
  deletePrescription,
  updatePrescriptionStatus
} from '../src/controllers/prescriptionController';
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

describe('Prescription Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPrescriptions', () => {
    it('should return all prescriptions', async () => {
      const mockPrescriptions = [
        {
          id: '1',
          visitId: 'visit1',
          notes: 'Resep untuk pasien',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: {
            id: 'visit1',
            visitNumber: 'VISIT-001',
            patient: {
              id: 'patient1',
              name: 'John Doe',
              medicalRecordNumber: 'MRN-001',
            }
          },
          items: [
            {
              id: 'item1',
              prescriptionId: '1',
              medicineId: 'medicine1',
              medicine: {
                id: 'medicine1',
                name: 'Paracetamol',
                price: new Decimal(5000),
              },
              quantity: 2,
              dosage: '1 tablet',
              frequency: '3x sehari',
              duration: 7,
              notes: 'Setelah makan',
            }
          ]
        }
      ];

      mockedPrisma.prescription.findMany = jest.fn().mockResolvedValue(mockPrescriptions);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPrescriptions(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data resep obat',
        data: mockPrescriptions
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.prescription.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllPrescriptions(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data resep obat',
        error: 'Database error'
      });
    });
  });

  describe('getPrescriptionById', () => {
    it('should return prescription by ID', async () => {
      const mockPrescription = {
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'MRN-001',
          }
        },
        items: [
          {
            id: 'item1',
            prescriptionId: '1',
            medicineId: 'medicine1',
            medicine: {
              id: 'medicine1',
              name: 'Paracetamol',
              price: new Decimal(5000),
            },
            quantity: 2,
            dosage: '1 tablet',
            frequency: '3x sehari',
            duration: 7,
            notes: 'Setelah makan',
          }
        ]
      };

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(mockPrescription);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getPrescriptionById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data resep obat',
        data: mockPrescription
      });
    });

    it('should return 404 if prescription not found', async () => {
      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getPrescriptionById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data resep obat tidak ditemukan'
      });
    });
  });

  describe('createPrescription', () => {
    it('should create a new prescription', async () => {
      const mockNewPrescription = {
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'MRN-001',
          }
        },
        items: [
          {
            id: 'item1',
            prescriptionId: '1',
            medicineId: 'medicine1',
            medicine: {
              id: 'medicine1',
              name: 'Paracetamol',
              price: new Decimal(5000),
            },
            quantity: 2,
            dosage: '1 tablet',
            frequency: '3x sehari',
            duration: 7,
            notes: 'Setelah makan',
          }
        ]
      };

      const mockReq = {
        body: {
          visitId: 'visit1',
          items: [
            {
              medicineId: 'medicine1',
              quantity: 2,
              dosage: '1 tablet',
              frequency: '3x sehari',
              duration: 7,
              notes: 'Setelah makan',
            }
          ],
          notes: 'Resep untuk pasien',
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VISIT-001',
      });
      
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: new Decimal(5000),
      });
      
      mockedPrisma.prescription.create = jest.fn().mockResolvedValue({
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.prescriptionItem.create = jest.fn().mockResolvedValue({});
      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(mockNewPrescription);

      const res = createMockResponse();

      await createPrescription(mockReq as Request, res);

      expect(mockedPrisma.prescription.create).toHaveBeenCalledWith({
        data: {
          visitId: 'visit1',
          notes: 'Resep untuk pasien',
          status: 'pending',
        },
        include: {
          visit: {
            select: {
              id: true,
              visitNumber: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  medicalRecordNumber: true,
                }
              }
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                }
              }
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data resep obat',
        data: mockNewPrescription
      });
    });

    it('should return 404 if visit not found', async () => {
      const mockReq = {
        body: {
          visitId: 'nonexistent',
          items: [
            {
              medicineId: 'medicine1',
              quantity: 2,
              dosage: '1 tablet',
              frequency: '3x sehari',
              duration: 7,
              notes: 'Setelah makan',
            }
          ],
          notes: 'Resep untuk pasien',
        }
      } as MockRequest;

      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createPrescription(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kunjungan tidak ditemukan'
      });
    });
  });

  describe('updatePrescription', () => {
    it('should update an existing prescription', async () => {
      const mockExistingPrescription = {
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      };

      const mockUpdatedPrescription = {
        ...mockExistingPrescription,
        notes: 'Resep diperbarui',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingPrescription,
          notes: 'Resep diperbarui',
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(mockExistingPrescription);
      mockedPrisma.visit.findUnique = jest.fn().mockResolvedValue({
        id: 'visit1',
        visitNumber: 'VISIT-001',
      });
      mockedPrisma.medicine.findUnique = jest.fn().mockResolvedValue({
        id: 'medicine1',
        name: 'Paracetamol',
        price: new Decimal(5000),
      });
      mockedPrisma.prescription.update = jest.fn().mockResolvedValue(mockUpdatedPrescription);
      mockedPrisma.prescriptionItem.deleteMany = jest.fn().mockResolvedValue({});
      mockedPrisma.prescriptionItem.create = jest.fn().mockResolvedValue({});

      const res = createMockResponse();

      await updatePrescription(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data resep obat',
        data: mockUpdatedPrescription
      });
    });

    it('should return 404 if prescription to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          visitId: 'visit1',
          items: [
            {
              medicineId: 'medicine1',
              quantity: 2,
              dosage: '1 tablet',
              frequency: '3x sehari',
              duration: 7,
              notes: 'Setelah makan',
            }
          ],
          notes: 'Resep untuk pasien',
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updatePrescription(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data resep obat tidak ditemukan'
      });
    });
  });

  describe('deletePrescription', () => {
    it('should delete a prescription', async () => {
      const mockPrescription = {
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(mockPrescription);
      mockedPrisma.prescriptionItem.deleteMany = jest.fn().mockResolvedValue({});
      mockedPrisma.prescription.delete = jest.fn().mockResolvedValue(mockPrescription);

      const res = createMockResponse();

      await deletePrescription(mockReq as Request, res);

      expect(mockedPrisma.prescriptionItem.deleteMany).toHaveBeenCalledWith({
        where: { prescriptionId: '1' }
      });

      expect(mockedPrisma.prescription.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data resep obat'
      });
    });

    it('should return 404 if prescription to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deletePrescription(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data resep obat tidak ditemukan'
      });
    });
  });

  describe('updatePrescriptionStatus', () => {
    it('should update prescription status', async () => {
      const mockPrescription = {
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'dispensed',
        createdAt: new Date(),
        updatedAt: new Date(),
        visit: {
          id: 'visit1',
          visitNumber: 'VISIT-001',
          patient: {
            id: 'patient1',
            name: 'John Doe',
            medicalRecordNumber: 'MRN-001',
          }
        },
        items: [
          {
            id: 'item1',
            prescriptionId: '1',
            medicineId: 'medicine1',
            medicine: {
              id: 'medicine1',
              name: 'Paracetamol',
              price: new Decimal(5000),
            },
            quantity: 2,
            dosage: '1 tablet',
            frequency: '3x sehari',
            duration: 7,
            notes: 'Setelah makan',
          }
        ]
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'dispensed'
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue({
        id: '1',
        visitId: 'visit1',
        notes: 'Resep untuk pasien',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedPrisma.prescription.update = jest.fn().mockResolvedValue(mockPrescription);

      const res = createMockResponse();

      await updatePrescriptionStatus(mockReq as Request, res);

      expect(mockedPrisma.prescription.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'dispensed',
          issuedAt: expect.any(Date),
        },
        include: {
          visit: {
            select: {
              id: true,
              visitNumber: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  medicalRecordNumber: true,
                }
              }
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                }
              }
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui status resep obat',
        data: mockPrescription
      });
    });

    it('should return 400 if invalid status is provided', async () => {
      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'invalid_status'
        }
      } as MockRequest;

      const res = createMockResponse();

      await updatePrescriptionStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Status resep tidak valid'
      });
    });

    it('should return 404 if prescription to update status is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          status: 'dispensed'
        }
      } as MockRequest;

      mockedPrisma.prescription.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updatePrescriptionStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data resep obat tidak ditemukan'
      });
    });
  });
});
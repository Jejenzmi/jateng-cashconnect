import { Request, Response } from 'express';
import { 
  getAllBeds, 
  getBedById, 
  createBed, 
  updateBed, 
  deleteBed,
  updateStatus
} from '../src/controllers/bedController';
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

describe('Bed Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBeds', () => {
    it('should return all beds', async () => {
      const mockBeds = [
        {
          id: '1',
          name: 'Bed 101A',
          roomNumber: '101A',
          roomId: 'room1',
          room: {
            id: 'room1',
            name: 'ICU 1',
            type: 'Intensive Care Unit',
          },
          status: 'available',
          description: 'ICU bed with ventilator support',
          inpatients: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.bed.findMany = jest.fn().mockResolvedValue(mockBeds);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBeds(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tempat tidur',
        data: mockBeds
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.bed.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllBeds(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data tempat tidur',
        error: 'Database error'
      });
    });
  });

  describe('getBedById', () => {
    it('should return bed by ID', async () => {
      const mockBed = {
        id: '1',
        name: 'Bed 101A',
        roomNumber: '101A',
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 1',
          type: 'Intensive Care Unit',
        },
        status: 'occupied',
        description: 'ICU bed with ventilator support',
        inpatients: [{
          id: 'inpatient1',
          patient: {
            id: 'patient1',
            name: 'John Doe',
          }
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(mockBed);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getBedById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data tempat tidur',
        data: mockBed
      });
    });

    it('should return 404 if bed not found', async () => {
      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getBedById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    });
  });

  describe('createBed', () => {
    it('should create a new bed', async () => {
      const mockNewBed = {
        id: '1',
        name: 'Bed 102B',
        roomNumber: '102B',
        roomId: 'room2',
        room: {
          id: 'room2',
          name: 'General Ward A',
          type: 'General Ward',
        },
        status: 'available',
        description: 'General ward bed',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'Bed 102B',
          roomNumber: '102B',
          roomId: 'room2',
          status: 'available',
          description: 'General ward bed',
        }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue({
        id: 'room2',
        name: 'General Ward A',
        type: 'General Ward',
      });
      
      mockedPrisma.bed.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.bed.create = jest.fn().mockResolvedValue(mockNewBed);

      const res = createMockResponse();

      await createBed(mockReq as Request, res);

      expect(mockedPrisma.bed.create).toHaveBeenCalledWith({
        data: {
          name: 'Bed 102B',
          roomNumber: '102B',
          roomId: 'room2',
          status: 'available',
          description: 'General ward bed',
        },
        include: {
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan tempat tidur',
        data: mockNewBed
      });
    });

    it('should return 404 if room not found', async () => {
      const mockReq = {
        body: {
          name: 'Bed 102B',
          roomNumber: '102B',
          roomId: 'nonexistent',
          status: 'available',
          description: 'General ward bed',
        }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    });

    it('should return 400 if room number already exists in the same room', async () => {
      const mockReq = {
        body: {
          name: 'Bed 102B',
          roomNumber: '102B',
          roomId: 'room2',
          status: 'available',
          description: 'General ward bed',
        }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue({
        id: 'room2',
        name: 'General Ward A',
        type: 'General Ward',
      });
      
      mockedPrisma.bed.findFirst = jest.fn().mockResolvedValue({
        id: 'existing-bed',
        name: 'Existing Bed',
        roomNumber: '102B',
        roomId: 'room2',
        status: 'available',
        description: 'Existing bed',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = createMockResponse();

      await createBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nomor tempat tidur sudah digunakan di kamar ini'
      });
    });
  });

  describe('updateBed', () => {
    it('should update an existing bed', async () => {
      const mockExistingBed = {
        id: '1',
        name: 'Bed 101A',
        roomNumber: '101A',
        roomId: 'room1',
        status: 'available',
        description: 'ICU bed with ventilator support',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedBed = {
        ...mockExistingBed,
        name: 'Bed 101A Updated',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          name: 'Bed 101A Updated',
        }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(mockExistingBed);
      mockedPrisma.bed.update = jest.fn().mockResolvedValue(mockUpdatedBed);

      const res = createMockResponse();

      await updateBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui tempat tidur',
        data: mockUpdatedBed
      });
    });

    it('should return 404 if bed to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Updated Name',
        }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    });
  });

  describe('deleteBed', () => {
    it('should delete a bed', async () => {
      const mockBed = {
        id: '1',
        name: 'Bed 101A',
        roomNumber: '101A',
        roomId: 'room1',
        status: 'available',
        description: 'ICU bed with ventilator support',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(mockBed);
      mockedPrisma.inpatient.findFirst = jest.fn().mockResolvedValue(null);
      mockedPrisma.bed.delete = jest.fn().mockResolvedValue(mockBed);

      const res = createMockResponse();

      await deleteBed(mockReq as Request, res);

      expect(mockedPrisma.bed.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus tempat tidur'
      });
    });

    it('should return 400 if bed is currently in use', async () => {
      const mockBed = {
        id: '1',
        name: 'Bed 101A',
        roomNumber: '101A',
        roomId: 'room1',
        status: 'occupied',
        description: 'ICU bed with ventilator support',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(mockBed);
      mockedPrisma.inpatient.findFirst = jest.fn().mockResolvedValue({
        id: 'inpatient1',
        patientId: 'patient1',
        bedId: '1',
        status: 'admitted',
        dischargeDate: null,
      });

      const res = createMockResponse();

      await deleteBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tidak dapat menghapus tempat tidur yang sedang digunakan oleh pasien'
      });
    });

    it('should return 404 if bed to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteBed(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    });
  });

  describe('updateStatus', () => {
    it('should update status of a bed', async () => {
      const mockBed = {
        id: '1',
        name: 'Bed 101A',
        roomNumber: '101A',
        roomId: 'room1',
        room: {
          id: 'room1',
          name: 'ICU 1',
          type: 'Intensive Care Unit',
        },
        status: 'available',
        description: 'ICU bed with ventilator support',
        inpatients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          status: 'maintenance'
        }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(mockBed);
      mockedPrisma.bed.update = jest.fn().mockResolvedValue({
        ...mockBed,
        status: 'maintenance'
      });

      const res = createMockResponse();

      await updateStatus(mockReq as Request, res);

      expect(mockedPrisma.bed.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status: 'maintenance'
        },
        include: {
          room: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status tempat tidur berhasil diperbarui',
        data: expect.objectContaining({
          status: 'maintenance'
        })
      });
    });

    it('should return 404 if bed to update status is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          status: 'occupied'
        }
      } as MockRequest;

      mockedPrisma.bed.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateStatus(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data tempat tidur tidak ditemukan'
      });
    });
  });
});
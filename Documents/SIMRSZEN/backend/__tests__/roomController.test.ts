import { Request, Response } from 'express';
import { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from '../src/controllers/roomController';
import prisma from '../src/config/db';
import { Room } from '@prisma/client';

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

describe('Room Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'ICU 01',
          type: 'Intensive Care Unit',
          floor: 3,
          capacity: 10,
          available: 5,
          isDeleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.room.findMany = jest.fn().mockResolvedValue(mockRooms);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRooms(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data ruangan',
        data: mockRooms
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.room.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllRooms(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data ruangan',
        error: 'Database error'
      });
    });
  });

  describe('getRoomById', () => {
    it('should return room by ID', async () => {
      const mockRoom: Room = {
        id: '1',
        name: 'ICU 01',
        type: 'Intensive Care Unit',
        floor: 3,
        capacity: 10,
        available: 5,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(mockRoom);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getRoomById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data ruangan',
        data: mockRoom
      });
    });

    it('should return 404 if room not found', async () => {
      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getRoomById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    });
  });

  describe('createRoom', () => {
    it('should create a new room', async () => {
      const mockNewRoom: Room = {
        id: '1',
        name: 'ICU 01',
        type: 'Intensive Care Unit',
        floor: 3,
        capacity: 10,
        available: 10,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'ICU 01',
          type: 'Intensive Care Unit',
          floor: 3,
          capacity: 10,
        }
      } as MockRequest;

      mockedPrisma.room.create = jest.fn().mockResolvedValue(mockNewRoom);

      const res = createMockResponse();

      await createRoom(mockReq as Request, res);

      expect(mockedPrisma.room.create).toHaveBeenCalledWith({
        data: {
          name: 'ICU 01',
          type: 'Intensive Care Unit',
          floor: 3,
          capacity: 10,
          available: 10, // Initially all capacity available
        },
        select: {
          id: true,
          name: true,
          type: true,
          floor: true,
          capacity: true,
          available: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan data ruangan',
        data: mockNewRoom
      });
    });
  });

  describe('updateRoom', () => {
    it('should update an existing room', async () => {
      const mockExistingRoom: Room = {
        id: '1',
        name: 'ICU 01',
        type: 'Intensive Care Unit',
        floor: 3,
        capacity: 10,
        available: 5,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedRoom: Room = {
        ...mockExistingRoom,
        name: 'ICU 02',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          ...mockExistingRoom,
          name: 'ICU 02',
        }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(mockExistingRoom);
      mockedPrisma.room.update = jest.fn().mockResolvedValue(mockUpdatedRoom);

      const res = createMockResponse();

      await updateRoom(mockReq as Request, res);

      expect(mockedPrisma.room.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...mockExistingRoom,
          name: 'ICU 02',
        },
        select: {
          id: true,
          name: true,
          type: true,
          floor: true,
          capacity: true,
          available: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui data ruangan',
        data: mockUpdatedRoom
      });
    });

    it('should return 404 if room to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'ICU 01',
          type: 'Intensive Care Unit',
          floor: 3,
          capacity: 10,
        }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateRoom(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    });
  });

  describe('deleteRoom', () => {
    it('should soft delete a room', async () => {
      const mockRoom: Room = {
        id: '1',
        name: 'ICU 01',
        type: 'Intensive Care Unit',
        floor: 3,
        capacity: 10,
        available: 5,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(mockRoom);
      mockedPrisma.room.update = jest.fn().mockResolvedValue({
        ...mockRoom,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const res = createMockResponse();

      await deleteRoom(mockReq as Request, res);

      expect(mockedPrisma.room.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDeleted: true,
          deletedAt: expect.any(Date),
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus data ruangan'
      });
    });

    it('should return 404 if room to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.room.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteRoom(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data ruangan tidak ditemukan'
      });
    });
  });
});


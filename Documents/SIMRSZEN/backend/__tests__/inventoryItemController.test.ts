import { Request, Response } from 'express';
import { 
  getAllInventoryItems, 
  getInventoryItemById, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  updateStock
} from '../src/controllers/inventoryItemController';
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

describe('InventoryItem Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllInventoryItems', () => {
    it('should return all inventory items', async () => {
      const mockInventoryItems = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          code: 'PAR001',
          category: 'obat',
          unit: 'tablet',
          price: 1500,
          stock: 100,
          minStock: 20,
          supplierId: 'supplier1',
          supplier: {
            id: 'supplier1',
            name: 'PT. Farmasi Sejahtera',
            contactPerson: 'Budi Santoso',
            phone: '021-12345678',
          },
          description: 'Obat penurun panas',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockedPrisma.inventoryItem.findMany = jest.fn().mockResolvedValue(mockInventoryItems);

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllInventoryItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item inventaris',
        data: mockInventoryItems
      });
    });

    it('should handle errors', async () => {
      mockedPrisma.inventoryItem.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {} as MockRequest;
      const res = createMockResponse();

      await getAllInventoryItems(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data item inventaris',
        error: 'Database error'
      });
    });
  });

  describe('getInventoryItemById', () => {
    it('should return inventory item by ID', async () => {
      const mockInventoryItem = {
        id: '1',
        name: 'Paracetamol 500mg',
        code: 'PAR001',
        category: 'obat',
        unit: 'tablet',
        price: 1500,
        stock: 100,
        minStock: 20,
        supplierId: 'supplier1',
        supplier: {
          id: 'supplier1',
          name: 'PT. Farmasi Sejahtera',
          contactPerson: 'Budi Santoso',
          phone: '021-12345678',
          email: 'budi@farmasi.com',
          address: 'Jl. Raya Bogor Km. 30'
        },
        description: 'Obat penurun panas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(mockInventoryItem);

      const req = {
        params: { id: '1' }
      } as MockRequest;
      const res = createMockResponse();

      await getInventoryItemById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil mengambil data item inventaris',
        data: mockInventoryItem
      });
    });

    it('should return 404 if inventory item not found', async () => {
      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' }
      } as MockRequest;
      const res = createMockResponse();

      await getInventoryItemById(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    });
  });

  describe('createInventoryItem', () => {
    it('should create a new inventory item', async () => {
      const mockNewItem = {
        id: '1',
        name: 'Amoxicillin 250mg',
        code: 'AMX001',
        category: 'obat',
        unit: 'capsule',
        price: 2000,
        stock: 50,
        minStock: 10,
        supplierId: 'supplier2',
        supplier: {
          id: 'supplier2',
          name: 'CV. Obat Jaya',
          contactPerson: 'Siti Rahayu',
          phone: '021-87654321',
        },
        description: 'Antibiotik amoxicillin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        body: {
          name: 'Amoxicillin 250mg',
          code: 'AMX001',
          category: 'obat',
          unit: 'capsule',
          price: 2000,
          stock: 50,
          minStock: 10,
          supplierId: 'supplier2',
          description: 'Antibiotik amoxicillin',
          isActive: true,
        }
      } as MockRequest;

      mockedPrisma.supplier.findUnique = jest.fn().mockResolvedValue({
        id: 'supplier2',
        name: 'CV. Obat Jaya',
        contactPerson: 'Siti Rahayu',
        phone: '021-87654321',
      });
      
      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(null);
      mockedPrisma.inventoryItem.create = jest.fn().mockResolvedValue(mockNewItem);

      const res = createMockResponse();

      await createInventoryItem(mockReq as Request, res);

      expect(mockedPrisma.inventoryItem.create).toHaveBeenCalledWith({
        data: {
          name: 'Amoxicillin 250mg',
          code: 'AMX001',
          category: 'obat',
          unit: 'capsule',
          price: 2000,
          stock: 50,
          minStock: 10,
          supplierId: 'supplier2',
          description: 'Antibiotik amoxicillin',
          isActive: true,
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactPerson: true,
              phone: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menambahkan item inventaris',
        data: mockNewItem
      });
    });

    it('should return 404 if supplier not found', async () => {
      const mockReq = {
        body: {
          name: 'Amoxicillin 250mg',
          code: 'AMX001',
          category: 'obat',
          unit: 'capsule',
          price: 2000,
          stock: 50,
          minStock: 10,
          supplierId: 'nonexistent',
          description: 'Antibiotik amoxicillin',
        }
      } as MockRequest;

      mockedPrisma.supplier.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await createInventoryItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Supplier tidak ditemukan'
      });
    });

    it('should return 400 if code is already used', async () => {
      const mockReq = {
        body: {
          name: 'Amoxicillin 250mg',
          code: 'AMX001',
          category: 'obat',
          unit: 'capsule',
          price: 2000,
          stock: 50,
          minStock: 10,
          supplierId: 'supplier2',
          description: 'Antibiotik amoxicillin',
        }
      } as MockRequest;

      mockedPrisma.supplier.findUnique = jest.fn().mockResolvedValue({
        id: 'supplier2',
        name: 'CV. Obat Jaya',
        contactPerson: 'Siti Rahayu',
        phone: '021-87654321',
      });
      
      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue({
        id: 'existing',
        name: 'Existing Item',
        code: 'AMX001',
        category: 'obat',
        unit: 'capsule',
        price: 2000,
        stock: 50,
        minStock: 10,
        supplierId: 'supplier2',
        description: 'Existing item with same code',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = createMockResponse();

      await createInventoryItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Kode item sudah digunakan'
      });
    });
  });

  describe('updateInventoryItem', () => {
    it('should update an existing inventory item', async () => {
      const mockExistingItem = {
        id: '1',
        name: 'Paracetamol 500mg',
        code: 'PAR001',
        category: 'obat',
        unit: 'tablet',
        price: 1500,
        stock: 100,
        minStock: 20,
        supplierId: 'supplier1',
        description: 'Obat penurun panas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedItem = {
        ...mockExistingItem,
        name: 'Paracetamol Sirup 100ml',
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          name: 'Paracetamol Sirup 100ml',
        }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(mockExistingItem);
      mockedPrisma.inventoryItem.update = jest.fn().mockResolvedValue(mockUpdatedItem);

      const res = createMockResponse();

      await updateInventoryItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil memperbarui item inventaris',
        data: mockUpdatedItem
      });
    });

    it('should return 404 if inventory item to update is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Updated Name',
        }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateInventoryItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    });
  });

  describe('deleteInventoryItem', () => {
    it('should delete an inventory item', async () => {
      const mockInventoryItem = {
        id: '1',
        name: 'Paracetamol 500mg',
        code: 'PAR001',
        category: 'obat',
        unit: 'tablet',
        price: 1500,
        stock: 100,
        minStock: 20,
        supplierId: 'supplier1',
        description: 'Obat penurun panas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(mockInventoryItem);
      mockedPrisma.inventoryItem.delete = jest.fn().mockResolvedValue(mockInventoryItem);

      const res = createMockResponse();

      await deleteInventoryItem(mockReq as Request, res);

      expect(mockedPrisma.inventoryItem.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Berhasil menghapus item inventaris'
      });
    });

    it('should return 404 if inventory item to delete is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await deleteInventoryItem(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    });
  });

  describe('updateStock', () => {
    it('should update stock for an inventory item (add)', async () => {
      const mockInventoryItem = {
        id: '1',
        name: 'Paracetamol 500mg',
        code: 'PAR001',
        category: 'obat',
        unit: 'tablet',
        price: 1500,
        stock: 100,
        minStock: 20,
        supplierId: 'supplier1',
        supplier: {
          id: 'supplier1',
          name: 'PT. Farmasi Sejahtera',
          contactPerson: 'Budi Santoso',
          phone: '021-12345678',
        },
        description: 'Obat penurun panas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          quantity: 50,
          type: 'in'
        }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(mockInventoryItem);
      mockedPrisma.inventoryItem.update = jest.fn().mockResolvedValue({
        ...mockInventoryItem,
        stock: 150 // 100 + 50
      });

      const res = createMockResponse();

      await updateStock(mockReq as Request, res);

      expect(mockedPrisma.inventoryItem.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          stock: 150
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactPerson: true,
              phone: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Stok berhasil ditambahkan',
        data: expect.objectContaining({
          stock: 150
        })
      });
    });

    it('should update stock for an inventory item (subtract)', async () => {
      const mockInventoryItem = {
        id: '1',
        name: 'Paracetamol 500mg',
        code: 'PAR001',
        category: 'obat',
        unit: 'tablet',
        price: 1500,
        stock: 100,
        minStock: 20,
        supplierId: 'supplier1',
        supplier: {
          id: 'supplier1',
          name: 'PT. Farmasi Sejahtera',
          contactPerson: 'Budi Santoso',
          phone: '021-12345678',
        },
        description: 'Obat penurun panas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReq = {
        params: { id: '1' },
        body: {
          quantity: 30,
          type: 'out'
        }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(mockInventoryItem);
      mockedPrisma.inventoryItem.update = jest.fn().mockResolvedValue({
        ...mockInventoryItem,
        stock: 70 // 100 - 30
      });

      const res = createMockResponse();

      await updateStock(mockReq as Request, res);

      expect(mockedPrisma.inventoryItem.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          stock: 70
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              contactPerson: true,
              phone: true,
            }
          }
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Stok berhasil dikurangi',
        data: expect.objectContaining({
          stock: 70
        })
      });
    });

    it('should return 404 if inventory item to update stock is not found', async () => {
      const mockReq = {
        params: { id: 'nonexistent' },
        body: {
          quantity: 50,
          type: 'in'
        }
      } as MockRequest;

      mockedPrisma.inventoryItem.findUnique = jest.fn().mockResolvedValue(null);

      const res = createMockResponse();

      await updateStock(mockReq as Request, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data item inventaris tidak ditemukan'
      });
    });
  });
});
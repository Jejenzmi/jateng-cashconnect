import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all inventory items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, lowStock } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      isDeleted: false
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { category: { contains: String(search) } }
      ];
    }

    if (category) {
      whereClause.category = String(category);
    }

    if (lowStock === 'true') {
      whereClause.stock = { lte: 10 }; // Using a fixed value for minimum stock threshold
    }

    const inventoryItems = await db.inventoryItem.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const total = await db.inventoryItem.count({ where: whereClause });

    res.json({
      data: inventoryItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get inventory item by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await db.inventoryItem.findUnique({
      where: { id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
            email: true,
            address: true
          }
        }
      }
    });

    if (!inventoryItem || inventoryItem.isDeleted) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(inventoryItem);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      category,
      unit,
      stock,
      minStock,
      price,
      supplierId,
      location,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !category || !unit) {
      return res.status(400).json({ error: 'Name, category, and unit are required' });
    }

    const newItem = await db.inventoryItem.create({
      data: {
        name,
        category,
        unit,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
        price: parseFloat(price) || 0,
        supplierId: supplierId || null,
        location: location || null,
        notes: notes || null
      }
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update inventory item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      unit,
      stock,
      minStock,
      price,
      supplierId,
      location,
      notes
    } = req.body;

    const inventoryItem = await db.inventoryItem.findUnique({
      where: { id }
    });

    if (!inventoryItem || inventoryItem.isDeleted) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const updatedItem = await db.inventoryItem.update({
      where: { id },
      data: {
        name: name || inventoryItem.name,
        category: category || inventoryItem.category,
        unit: unit || inventoryItem.unit,
        stock: stock !== undefined ? parseInt(stock) : inventoryItem.stock,
        minStock: minStock !== undefined ? parseInt(minStock) : inventoryItem.minStock,
        price: price !== undefined ? parseFloat(price) : inventoryItem.price,
        supplierId: supplierId !== undefined ? supplierId : inventoryItem.supplierId,
        location: location !== undefined ? location : inventoryItem.location,
        notes: notes !== undefined ? notes : inventoryItem.notes,
        updatedAt: new Date()
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Delete inventory item (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await db.inventoryItem.findUnique({
      where: { id }
    });

    if (!inventoryItem || inventoryItem.isDeleted) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    await db.inventoryItem.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() }
    });

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Restock inventory item
router.post('/restock/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, notes } = req.body;

    if (!quantity || parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity is required and must be greater than 0' });
    }

    const inventoryItem = await db.inventoryItem.findUnique({
      where: { id }
    });

    if (!inventoryItem || inventoryItem.isDeleted) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const updatedItem = await db.inventoryItem.update({
      where: { id },
      data: {
        stock: {
          increment: parseInt(quantity)
        },
        updatedAt: new Date()
      }
    });

    // Optionally, create a transaction record
    console.log(`Restocked ${quantity} units to item ${inventoryItem.name}. New stock: ${updatedItem.stock}`);

    res.json({
      message: `Successfully restocked ${quantity} units`,
      updatedItem
    });
  } catch (error) {
    console.error('Error restocking inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get low stock items
router.get('/low-stock', authenticateToken, async (req, res) => {
  try {
    const lowStockItems = await db.inventoryItem.findMany({
      where: {
        isDeleted: false,
        stock: {
          lte: 10 // Using a fixed value for minimum stock threshold
        }
      },
      orderBy: { stock: 'asc' }
    });

    res.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;


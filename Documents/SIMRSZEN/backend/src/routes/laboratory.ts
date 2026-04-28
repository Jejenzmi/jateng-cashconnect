import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all lab tests
router.get('/tests', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, group } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      isActive: true
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { code: { contains: String(search) } },
        { group: { contains: String(search) } }
      ];
    }

    if (group) {
      whereClause.group = String(group);
    }

    const labTests = await db.laboratoryTest.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      orderBy: { name: 'asc' }
    });

    const total = await db.laboratoryTest.count({ where: whereClause });

    res.json({
      data: labTests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get lab test by ID
router.get('/tests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const labTest = await db.laboratoryTest.findUnique({
      where: { id }
    });

    if (!labTest || !labTest.isActive) {
      return res.status(404).json({ error: 'Lab test not found' });
    }

    res.json(labTest);
  } catch (error) {
    console.error('Error fetching lab test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new lab test
router.post('/tests', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      code,
      group,
      description,
      price,
      normalValues,
      sampleType,
      preparation,
      processingTime
    } = req.body;

    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    // Check if code already exists
    const existingTest = await db.laboratoryTest.findUnique({
      where: { code }
    });

    if (existingTest) {
      return res.status(409).json({ error: 'Lab test with this code already exists' });
    }

    const newTest = await db.laboratoryTest.create({
      data: {
        name,
        code,
        group: group || null,
        description: description || null,
        price: parseFloat(price),
        normalValues: normalValues || null,
        sampleType: sampleType || null,
        preparation: preparation || null,
        processingTime: processingTime ? parseInt(processingTime) : null
      }
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating lab test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update lab test
router.put('/tests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      group,
      description,
      price,
      normalValues,
      sampleType,
      preparation,
      processingTime,
      isActive
    } = req.body;

    const labTest = await db.laboratoryTest.findUnique({
      where: { id }
    });

    if (!labTest) {
      return res.status(404).json({ error: 'Lab test not found' });
    }

    const updatedTest = await db.laboratoryTest.update({
      where: { id },
      data: {
        name: name || labTest.name,
        group: group !== undefined ? group : labTest.group,
        description: description !== undefined ? description : labTest.description,
        price: price !== undefined ? parseFloat(price) : labTest.price,
        normalValues: normalValues !== undefined ? normalValues : labTest.normalValues,
        sampleType: sampleType !== undefined ? sampleType : labTest.sampleType,
        preparation: preparation !== undefined ? preparation : labTest.preparation,
        processingTime: processingTime !== undefined ? parseInt(processingTime) : labTest.processingTime,
        isActive: isActive !== undefined ? isActive : labTest.isActive,
        updatedAt: new Date()
      }
    });

    res.json(updatedTest);
  } catch (error) {
    console.error('Error updating lab test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get all lab orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, visitId, status, priority } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (patientId) {
      whereClause.visit = { patientId: String(patientId) };
    }

    if (visitId) {
      whereClause.visitId = String(visitId);
    }

    if (status) {
      whereClause.status = String(status);
    }

    if (priority) {
      whereClause.priority = String(priority);
    }

    const labOrders = await db.laboratoryOrder.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                nik: true
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        orderedBy: {
          select: {
            id: true,
            fullName: true
          }
        },
        tests: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: { orderedAt: 'desc' }
    });

    const total = await db.laboratoryOrder.count({ where: whereClause });

    res.json({
      data: labOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching lab orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get lab order by ID
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const labOrder = await db.laboratoryOrder.findUnique({
      where: { id },
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                nik: true
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        orderedBy: {
          select: {
            id: true,
            fullName: true
          }
        },
        tests: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
                normalValues: true
              }
            }
          }
        }
      }
    });

    if (!labOrder) {
      return res.status(404).json({ error: 'Lab order not found' });
    }

    res.json(labOrder);
  } catch (error) {
    console.error('Error fetching lab order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new lab order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const {
      visitId,
      orderedById,
      testIds,
      priority,
      notes
    } = req.body;

    // Validate required fields
    if (!visitId || !orderedById || !testIds || !Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json({ error: 'Visit ID, ordered by ID, and at least one test ID are required' });
    }

    // Check if visit exists
    const visit = await db.visit.findUnique({
      where: { id: visitId }
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    // Check if ordering user exists
    const orderingUser = await db.user.findUnique({
      where: { id: orderedById }
    });

    if (!orderingUser) {
      return res.status(404).json({ error: 'Ordering user not found' });
    }

    // Verify all test IDs exist and are active
    for (const testId of testIds) {
      const test = await db.laboratoryTest.findUnique({
        where: { id: testId }
      });

      if (!test || !test.isActive) {
        return res.status(404).json({ error: `Lab test with ID ${testId} not found or inactive` });
      }
    }

    // Create the lab order with test associations
    const newOrder = await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.laboratoryOrder.create({
        data: {
          visitId,
          orderedById,
          status: 'ordered',
          priority: priority || 'normal',
          notes: notes || null
        }
      });

      // Create lab results for each test
      for (const testId of testIds) {
        await tx.laboratoryResult.create({
          data: {
            orderId: order.id,
            testId
          }
        });
      }

      return order;
    });

    // Fetch the complete order with relations
    const completeOrder = await db.laboratoryOrder.findUnique({
      where: { id: newOrder.id },
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                nik: true
              }
            },
            doctor: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        orderedBy: {
          select: {
            id: true,
            fullName: true
          }
        },
        tests: {
          include: {
            test: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    console.error('Error creating lab order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update lab order status
router.patch('/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedAt } = req.body;

    const validStatuses = ['ordered', 'in_progress', 'completed', 'verified'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    const order = await db.laboratoryOrder.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Lab order not found' });
    }

    const updatedOrder = await db.laboratoryOrder.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : order.completedAt,
        updatedAt: new Date()
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating lab order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;
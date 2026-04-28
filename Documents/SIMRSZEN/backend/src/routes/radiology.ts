import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all radiology orders
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

    const radiologyOrders = await db.radiologyOrder.findMany({
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
        results: {
          include: {
            exam: {
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

    const total = await db.radiologyOrder.count({ where: whereClause });

    res.json({
      data: radiologyOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching radiology orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get radiology order by ID
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const radiologyOrder = await db.radiologyOrder.findUnique({
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
        results: {
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!radiologyOrder) {
      return res.status(404).json({ error: 'Radiology order not found' });
    }

    res.json(radiologyOrder);
  } catch (error) {
    console.error('Error fetching radiology order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new radiology order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const {
      visitId,
      orderedById,
      examIds,
      priority,
      notes
    } = req.body;

    // Validate required fields
    if (!visitId || !orderedById || !examIds || !Array.isArray(examIds) || examIds.length === 0) {
      return res.status(400).json({ error: 'Visit ID, ordered by ID, and at least one exam ID are required' });
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

    // Verify all exam IDs exist
    for (const examId of examIds) {
      const exam = await db.radiologyExam.findUnique({
        where: { id: examId }
      });

      if (!exam || !exam.isActive) {
        return res.status(404).json({ error: `Radiology exam with ID ${examId} not found or inactive` });
      }
    }

    // Create the radiology order with exam associations
    const newOrder = await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.radiologyOrder.create({
        data: {
          visitId,
          orderedById,
          status: 'ordered',
          priority: priority || 'normal',
          notes: notes || null
        }
      });

      // Create radiology results for each exam
      for (const examId of examIds) {
        await tx.radiologyResult.create({
          data: {
            orderId: order.id,
            examId
          }
        });
      }

      return order;
    });

    // Fetch the complete order with relations
    const completeOrder = await db.radiologyOrder.findUnique({
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
        results: {
          include: {
            exam: {
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
    console.error('Error creating radiology order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update radiology order status
router.patch('/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedAt } = req.body;

    const validStatuses = ['ordered', 'in_progress', 'completed', 'verified'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    const order = await db.radiologyOrder.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Radiology order not found' });
    }

    const updatedOrder = await db.radiologyOrder.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : order.completedAt,
        updatedAt: new Date()
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating radiology order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get all radiology exams
router.get('/exams', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      isActive: true
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { code: { contains: String(search) } },
        { category: { contains: String(search) } }
      ];
    }

    if (category) {
      whereClause.category = String(category);
    }

    const radiologyExams = await db.radiologyExam.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      orderBy: { name: 'asc' }
    });

    const total = await db.radiologyExam.count({ where: whereClause });

    res.json({
      data: radiologyExams,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching radiology exams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get radiology exam by ID
router.get('/exams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const radiologyExam = await db.radiologyExam.findUnique({
      where: { id }
    });

    if (!radiologyExam || !radiologyExam.isActive) {
      return res.status(404).json({ error: 'Radiology exam not found' });
    }

    res.json(radiologyExam);
  } catch (error) {
    console.error('Error fetching radiology exam:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new radiology exam
router.post('/exams', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      description,
      price,
      preparation,
      contraindications
    } = req.body;

    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    // Check if code already exists
    const existingExam = await db.radiologyExam.findUnique({
      where: { code }
    });

    if (existingExam) {
      return res.status(409).json({ error: 'Radiology exam with this code already exists' });
    }

    const newExam = await db.radiologyExam.create({
      data: {
        name,
        code,
        category: category || null,
        description: description || null,
        price: parseFloat(price),
        preparation: preparation || null,
        contraindications: contraindications || null
      }
    });

    res.status(201).json(newExam);
  } catch (error) {
    console.error('Error creating radiology exam:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update radiology exam
router.put('/exams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      price,
      preparation,
      contraindications,
      isActive
    } = req.body;

    const radiologyExam = await db.radiologyExam.findUnique({
      where: { id }
    });

    if (!radiologyExam) {
      return res.status(404).json({ error: 'Radiology exam not found' });
    }

    const updatedExam = await db.radiologyExam.update({
      where: { id },
      data: {
        name: name || radiologyExam.name,
        category: category !== undefined ? category : radiologyExam.category,
        description: description !== undefined ? description : radiologyExam.description,
        price: price !== undefined ? parseFloat(price) : radiologyExam.price,
        preparation: preparation !== undefined ? preparation : radiologyExam.preparation,
        contraindications: contraindications !== undefined ? contraindications : radiologyExam.contraindications,
        isActive: isActive !== undefined ? isActive : radiologyExam.isActive,
        updatedAt: new Date()
      }
    });

    res.json(updatedExam);
  } catch (error) {
    console.error('Error updating radiology exam:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get radiology results
router.get('/results', authenticateToken, async (req, res) => {
  try {
    const { orderId, examId } = req.query;

    const whereClause: any = {};

    if (orderId) {
      whereClause.orderId = String(orderId);
    }

    if (examId) {
      whereClause.examId = String(examId);
    }

    const radiologyResults = await db.radiologyResult.findMany({
      where: whereClause,
      include: {
        order: {
          include: {
            visit: {
              include: {
                patient: {
                  select: {
                    id: true,
                    name: true,
                    nik: true
                  }
                }
              }
            }
          }
        },
        exam: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    res.json(radiologyResults);
  } catch (error) {
    console.error('Error fetching radiology results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;
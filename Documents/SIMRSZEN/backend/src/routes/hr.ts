import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, departmentId, role } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      isActive: true
    };

    if (search) {
      whereClause.OR = [
        { fullName: { contains: String(search) } },
        { username: { contains: String(search) } },
        { email: { contains: String(search) } }
      ];
    }

    if (departmentId) {
      whereClause.departmentId = String(departmentId);
    }

    if (role) {
      whereClause.role = String(role);
    }

    const employees = await db.user.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        roleDetail: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    const total = await db.user.count({ where: whereClause });

    res.json({
      data: employees,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get employee by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await db.user.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            head: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        roleDetail: {
          select: {
            id: true,
            name: true,
            permissions: true
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      username,
      email,
      fullName,
      password,
      role,
      departmentId,
      roleId
    } = req.body;

    // Validate required fields
    if (!username || !fullName || !password) {
      return res.status(400).json({ error: 'Username, full name, and password are required' });
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await db.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Check if department exists if provided
    if (departmentId) {
      const department = await db.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
    }

    // Hash password (in real implementation, use bcrypt)
    const hashedPassword = password; // Replace with proper hashing in production

    const newEmployee = await db.user.create({
      data: {
        username,
        email: email || null,
        fullName,
        password: hashedPassword,
        role: role || 'USER',
        departmentId: departmentId || null,
        roleId: roleId || null
      }
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update employee
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      fullName,
      role,
      departmentId,
      roleId,
      isActive
    } = req.body;

    const employee = await db.user.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if email already exists for another user
    if (email && email !== employee.email) {
      const existingEmail = await db.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Check if department exists if provided
    if (departmentId) {
      const department = await db.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
    }

    const updatedEmployee = await db.user.update({
      where: { id },
      data: {
        username: username || employee.username,
        email: email !== undefined ? email : employee.email,
        fullName: fullName || employee.fullName,
        role: role || employee.role,
        departmentId: departmentId !== undefined ? departmentId : employee.departmentId,
        roleId: roleId !== undefined ? roleId : employee.roleId,
        isActive: isActive !== undefined ? isActive : employee.isActive,
        updatedAt: new Date()
      }
    });

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Delete employee (set isActive to false)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await db.user.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await db.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Employee deactivated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error deactivating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get departments
router.get('/departments', authenticateToken, async (req, res) => {
  try {
    const departments = await db.department.findMany({
      include: {
        head: {
          select: {
            id: true,
            fullName: true
          }
        },
        users: {
          where: { isActive: true },
          select: {
            id: true,
            fullName: true,
            role: true
          },
          take: 5 // Limit to first 5 employees per department
        }
      }
    });

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get roles
router.get('/roles', authenticateToken, async (req, res) => {
  try {
    const roles = await db.role.findMany();

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;
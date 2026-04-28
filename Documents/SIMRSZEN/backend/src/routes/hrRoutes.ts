import { Router } from 'express';
import { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  getAllAttendances,
  getAttendanceById
} from '../controllers/hrController.js';
import { requireRole, ROLES } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Employee routes
router.get('/employees', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(getAllEmployees)
);

router.get('/employees/:id', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(getEmployeeById)
);

router.post('/employees', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(createEmployee)
);

router.put('/employees/:id', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(updateEmployee)
);

router.delete('/employees/:id', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(deleteEmployee)
);

// Payroll routes
router.get('/payrolls', 
  requireRole([ROLES.ADMIN, ROLES.HR, ROLES.FINANCE]), 
  asyncHandler(getAllPayrolls)
);

router.get('/payrolls/:id', 
  requireRole([ROLES.ADMIN, ROLES.HR, ROLES.FINANCE]), 
  asyncHandler(getPayrollById)
);

router.post('/payrolls', 
  requireRole([ROLES.ADMIN, ROLES.HR, ROLES.FINANCE]), 
  asyncHandler(createPayroll)
);

// Attendance routes
router.get('/attendances', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(getAllAttendances)
);

router.get('/attendances/:id', 
  requireRole([ROLES.ADMIN, ROLES.HR]), 
  asyncHandler(getAttendanceById)
);

export default router;
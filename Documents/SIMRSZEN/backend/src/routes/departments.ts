import { Router } from 'express';
import { 
  getAllDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../controllers/departmentController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff administrasi yang dapat mengakses data departemen
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getAllDepartments);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getDepartmentById);

// Hanya admin yang dapat mengelola data departemen
router.post('/', authorizeRole(['ADMIN']), createDepartment);
router.put('/:id', authorizeRole(['ADMIN']), updateDepartment);
router.delete('/:id', authorizeRole(['ADMIN']), deleteDepartment);

export default router;
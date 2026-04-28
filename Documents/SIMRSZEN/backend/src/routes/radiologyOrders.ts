import { Router } from 'express';
import { 
  getAllRadiologyOrders, 
  getRadiologyOrderByID, 
  createRadiologyOrder, 
  updateRadiologyOrder, 
  deleteRadiologyOrder
} from '../controllers/radiologyOrderController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff radiologi yang dapat mengakses data pesanan radiologi
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'RADIOLOGY_STAFF']), getAllRadiologyOrders);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'RADIOLOGY_STAFF']), getRadiologyOrderByID);

// Hanya admin dan staff medis yang dapat membuat/memperbarui pesanan radiologi
router.post('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), createRadiologyOrder);
router.put('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), updateRadiologyOrder);
router.delete('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), deleteRadiologyOrder);

export default router;
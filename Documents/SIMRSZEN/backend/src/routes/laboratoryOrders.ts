import { Router } from 'express';
import { 
  getAllLaboratoryOrders, 
  getLaboratoryOrderByID, 
  createLaboratoryOrder, 
  updateLaboratoryOrder, 
  deleteLaboratoryOrder
} from '../controllers/laboratoryOrderController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff laboratorium yang dapat mengakses data pesanan laboratorium
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'LABORATORY_STAFF']), getAllLaboratoryOrders);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'LABORATORY_STAFF']), getLaboratoryOrderByID);

// Hanya admin dan staff medis yang dapat membuat/memperbarui pesanan laboratorium
router.post('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), createLaboratoryOrder);
router.put('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), updateLaboratoryOrder);
router.delete('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), deleteLaboratoryOrder);

export default router;
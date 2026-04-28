import { Router } from 'express';
import { 
  getAllPrescriptionItems, 
  getPrescriptionItemByID, 
  createPrescriptionItem, 
  updatePrescriptionItem, 
  deletePrescriptionItem
} from '../controllers/prescriptionItemController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff farmasi yang dapat mengakses data item resep
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'PHARMACY_STAFF']), getAllPrescriptionItems);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'PHARMACY_STAFF']), getPrescriptionItemByID);

// Hanya admin dan staff medis yang dapat membuat/memperbarui item resep
router.post('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), createPrescriptionItem);
router.put('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), updatePrescriptionItem);
router.delete('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), deletePrescriptionItem);

export default router;
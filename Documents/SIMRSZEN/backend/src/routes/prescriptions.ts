import { Router } from 'express';
import { 
  getAllPrescriptions, 
  getPrescriptionById, 
  createPrescription, 
  updatePrescription, 
  deletePrescription,
  updatePrescriptionStatus
} from '../controllers/prescriptionController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff apotek yang dapat mengakses data resep
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'PHARMACY_STAFF']), getAllPrescriptions);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'PHARMACY_STAFF']), getPrescriptionById);

// Hanya admin dan staff medis yang dapat mengelola data resep
router.post('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), createPrescription);
router.put('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), updatePrescription);
router.delete('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), deletePrescription);

// Endpoint khusus untuk mengubah status resep
router.patch('/:id/status', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), updatePrescriptionStatus);

export default router;
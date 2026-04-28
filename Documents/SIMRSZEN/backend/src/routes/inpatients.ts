import { Router } from 'express';
import { 
  getAllInpatients, 
  getInpatientById, 
  createInpatient, 
  updateInpatient, 
  deleteInpatient,
  transferPatient
} from '../controllers/inpatientController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff registrasi, dan staff medis yang dapat mengakses data rawat inap
router.get('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF', 'MEDICAL_STAFF']), getAllInpatients);
router.get('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF', 'MEDICAL_STAFF']), getInpatientById);

// Hanya admin dan staff registrasi yang dapat mengelola data rawat inap
router.post('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), createInpatient);
router.put('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), updateInpatient);
router.delete('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), deleteInpatient);

// Endpoint khusus untuk pemindahan pasien
router.patch('/:id/transfer', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'REGISTRATION_STAFF']), transferPatient);

export default router;
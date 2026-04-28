import { Router } from 'express';
import { 
  getAllPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../controllers/patientController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff medis yang dapat mengakses data pasien
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), getAllPatients);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), getPatientById);

// Hanya admin dan staff pendaftaran yang dapat mengelola data pasien
router.post('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), createPatient);
router.put('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), updatePatient);
router.delete('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), deletePatient);

export default router;
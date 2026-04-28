import { Router } from 'express';
import { 
  getAllDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../controllers/doctorController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff medis yang dapat mengakses data dokter
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), getAllDoctors);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF']), getDoctorById);

// Hanya admin dan staff pendaftaran yang dapat mengelola data dokter
router.post('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), createDoctor);
router.put('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), updateDoctor);
router.delete('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), deleteDoctor);

export default router;


import { Router } from 'express';
import { 
  getAllVisits, 
  getVisitById, 
  createVisit, 
  updateVisit, 
  deleteVisit,
  updateVisitStatus
} from '../controllers/visitController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff registrasi, dan staff medis yang dapat mengakses data kunjungan
router.get('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF', 'MEDICAL_STAFF']), getAllVisits);
router.get('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF', 'MEDICAL_STAFF']), getVisitById);

// Hanya admin dan staff registrasi yang dapat mengelola data kunjungan
router.post('/', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), createVisit);
router.put('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), updateVisit);
router.delete('/:id', authorizeRole(['ADMIN', 'REGISTRATION_STAFF']), deleteVisit);

// Endpoint khusus untuk mengubah status kunjungan
router.patch('/:id/status', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'REGISTRATION_STAFF']), updateVisitStatus);

export default router;


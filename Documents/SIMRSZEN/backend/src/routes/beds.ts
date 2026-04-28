import { Router } from 'express';
import { 
  getAllBeds, 
  getBedById, 
  createBed, 
  updateBed, 
  deleteBed,
  updateStatus
} from '../controllers/bedController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff administrasi yang dapat mengakses data tempat tidur
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getAllBeds);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getBedById);

// Hanya admin dan staff administrasi yang dapat mengelola data tempat tidur
router.post('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), createBed);
router.put('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), updateBed);
router.delete('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), deleteBed);

// Endpoint khusus untuk pembaruan status
router.patch('/:id/status', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'MEDICAL_STAFF']), updateStatus);

export default router;
import { Router } from 'express';
import { 
  getAllRadiologyResults, 
  getRadiologyResultByID, 
  createRadiologyResult, 
  updateRadiologyResult, 
  deleteRadiologyResult,
  verifyRadiologyResult
} from '../controllers/radiologyResultController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff radiologi yang dapat mengakses data hasil radiologi
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'RADIOLOGY_STAFF']), getAllRadiologyResults);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'RADIOLOGY_STAFF']), getRadiologyResultByID);

// Hanya admin dan staff radiologi yang dapat membuat/memperbarui hasil radiologi
router.post('/', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), createRadiologyResult);
router.put('/:id', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), updateRadiologyResult);
router.delete('/:id', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), deleteRadiologyResult);

// Endpoint khusus untuk verifikasi hasil
router.patch('/:id/verify', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), verifyRadiologyResult);

export default router;
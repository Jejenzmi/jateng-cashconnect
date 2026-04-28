import { Router } from 'express';
import { 
  getAllLaboratoryResults, 
  getLaboratoryResultByID, 
  createLaboratoryResult, 
  updateLaboratoryResult, 
  deleteLaboratoryResult,
  verifyLaboratoryResult
} from '../controllers/laboratoryResultController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff medis, dan staff laboratorium yang dapat mengakses data hasil laboratorium
router.get('/', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'LABORATORY_STAFF']), getAllLaboratoryResults);
router.get('/:id', authorizeRole(['ADMIN', 'MEDICAL_STAFF', 'LABORATORY_STAFF']), getLaboratoryResultByID);

// Hanya admin dan staff laboratorium yang dapat membuat/memperbarui hasil laboratorium
router.post('/', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), createLaboratoryResult);
router.put('/:id', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), updateLaboratoryResult);
router.delete('/:id', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), deleteLaboratoryResult);

// Endpoint khusus untuk verifikasi hasil
router.patch('/:id/verify', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), verifyLaboratoryResult);

export default router;
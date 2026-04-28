import { Router } from 'express';
import { 
  getAllLaboratoryTests, 
  getLaboratoryTestById, 
  createLaboratoryTest, 
  updateLaboratoryTest, 
  deleteLaboratoryTest 
} from '../controllers/laboratoryTestController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff laboratorium yang dapat mengakses data tes laboratorium
router.get('/', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), getAllLaboratoryTests);
router.get('/:id', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), getLaboratoryTestById);

// Hanya admin dan staff laboratorium yang dapat mengelola data tes laboratorium
router.post('/', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), createLaboratoryTest);
router.put('/:id', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), updateLaboratoryTest);
router.delete('/:id', authorizeRole(['ADMIN', 'LABORATORY_STAFF']), deleteLaboratoryTest);

export default router;
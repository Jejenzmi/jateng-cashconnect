import { Router } from 'express';
import { 
  getAllRadiologyExams, 
  getRadiologyExamById, 
  createRadiologyExam, 
  updateRadiologyExam, 
  deleteRadiologyExam 
} from '../controllers/radiologyExamController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff radiologi yang dapat mengakses data pemeriksaan radiologi
router.get('/', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), getAllRadiologyExams);
router.get('/:id', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), getRadiologyExamById);

// Hanya admin dan staff radiologi yang dapat mengelola data pemeriksaan radiologi
router.post('/', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), createRadiologyExam);
router.put('/:id', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), updateRadiologyExam);
router.delete('/:id', authorizeRole(['ADMIN', 'RADIOLOGY_STAFF']), deleteRadiologyExam);

export default router;
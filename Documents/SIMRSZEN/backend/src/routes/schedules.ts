import { Router } from 'express';
import { 
  getAllSchedules, 
  getScheduleById, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/scheduleController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff administrasi yang dapat mengakses data jadwal dokter
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getAllSchedules);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getScheduleById);

// Hanya admin dan staff administrasi yang dapat mengelola data jadwal dokter
router.post('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), createSchedule);
router.put('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), updateSchedule);
router.delete('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), deleteSchedule);

export default router;
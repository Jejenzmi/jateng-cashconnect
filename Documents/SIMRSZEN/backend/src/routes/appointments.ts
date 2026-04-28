import { Router } from 'express';
import { 
  getAllAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  updateAppointmentStatus
} from '../controllers/appointmentController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff administrasi, dan staff medis yang dapat mengakses data janji temu
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'MEDICAL_STAFF']), getAllAppointments);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'MEDICAL_STAFF']), getAppointmentById);

// Hanya admin dan staff administrasi yang dapat mengelola data janji temu
router.post('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), createAppointment);
router.put('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), updateAppointment);
router.delete('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), deleteAppointment);

// Endpoint khusus untuk mengubah status janji temu
router.patch('/:id/status', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'MEDICAL_STAFF']), updateAppointmentStatus);

export default router;
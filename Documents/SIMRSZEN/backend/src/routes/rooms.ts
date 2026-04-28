import { Router } from 'express';
import { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from '../controllers/roomController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff administrasi yang dapat mengakses data ruangan
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getAllRooms);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), getRoomById);

// Hanya admin dan staff administrasi yang dapat mengelola data ruangan
router.post('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), createRoom);
router.put('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), updateRoom);
router.delete('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF']), deleteRoom);

export default router;
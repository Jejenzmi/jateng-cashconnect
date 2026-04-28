import { Router } from 'express';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
} from '../controllers/medicineController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff farmasi yang dapat mengakses data obat
router.get('/', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), getAllMedicines);
router.get('/:id', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), getMedicineById);

// Hanya admin dan staff farmasi yang dapat mengelola data obat
router.post('/', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), createMedicine);
router.put('/:id', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), updateMedicine);
router.delete('/:id', authorizeRole(['ADMIN', 'PHARMACY_STAFF']), deleteMedicine);

export default router;


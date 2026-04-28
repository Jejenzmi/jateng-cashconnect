import { Router } from 'express';
import { 
  getAllBills, 
  getBillByID, 
  createBill, 
  updateBill, 
  deleteBill
} from '../controllers/billController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff keuangan yang dapat mengakses data tagihan
router.get('/', authorizeRole(['ADMIN', 'FINANCE_STAFF']), getAllBills);
router.get('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), getBillByID);

// Hanya admin dan staff keuangan yang dapat membuat/memperbarui tagihan
router.post('/', authorizeRole(['ADMIN', 'FINANCE_STAFF']), createBill);
router.put('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), updateBill);
router.delete('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), deleteBill);

export default router;
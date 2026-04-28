import { Router } from 'express';
import { 
  getAllBillItems, 
  getBillItemByID, 
  createBillItem, 
  updateBillItem, 
  deleteBillItem
} from '../controllers/billItemController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin dan staff keuangan yang dapat mengakses data item tagihan
router.get('/', authorizeRole(['ADMIN', 'FINANCE_STAFF']), getAllBillItems);
router.get('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), getBillItemByID);

// Hanya admin dan staff keuangan yang dapat membuat/memperbarui item tagihan
router.post('/', authorizeRole(['ADMIN', 'FINANCE_STAFF']), createBillItem);
router.put('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), updateBillItem);
router.delete('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), deleteBillItem);

export default router;
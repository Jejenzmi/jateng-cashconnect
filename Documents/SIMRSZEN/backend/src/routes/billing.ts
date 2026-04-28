import { Router } from 'express';
import { 
  getAllBills, 
  getBillById, 
  createBill, 
  updateBill, 
  deleteBill,
  updatePaymentStatus
} from '../controllers/billingController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff administrasi, dan staff keuangan yang dapat mengakses data billing
router.get('/', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'FINANCE_STAFF']), getAllBills);
router.get('/:id', authorizeRole(['ADMIN', 'ADMINISTRATIVE_STAFF', 'FINANCE_STAFF']), getBillById);

// Hanya admin dan staff keuangan yang dapat mengelola data billing
router.post('/', authorizeRole(['ADMIN', 'FINANCE_STAFF']), createBill);
router.put('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), updateBill);
router.delete('/:id', authorizeRole(['ADMIN', 'FINANCE_STAFF']), deleteBill);

// Endpoint khusus untuk mengubah status pembayaran
router.patch('/:id/payment-status', authorizeRole(['ADMIN', 'FINANCE_STAFF']), updatePaymentStatus);

export default router;
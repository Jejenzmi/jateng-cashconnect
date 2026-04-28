import { Router } from 'express';
import { 
  getAllInventoryItems, 
  getInventoryItemById, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  updateStock
} from '../controllers/inventoryItemController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Semua endpoint memerlukan autentikasi
router.use(authenticateToken);

// Hanya admin, staff gudang, dan staff keuangan yang dapat mengakses data item inventaris
router.get('/', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF', 'FINANCE_STAFF']), getAllInventoryItems);
router.get('/:id', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF', 'FINANCE_STAFF']), getInventoryItemById);

// Hanya admin dan staff gudang yang dapat mengelola data item inventaris
router.post('/', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF']), createInventoryItem);
router.put('/:id', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF']), updateInventoryItem);
router.delete('/:id', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF']), deleteInventoryItem);

// Endpoint khusus untuk pembaruan stok
router.patch('/:id/stock', authorizeRole(['ADMIN', 'WAREHOUSE_STAFF']), updateStock);

export default router;
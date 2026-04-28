import { Router } from 'express';
import { 
  getAllSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  getAllPurchaseRequests,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequestStatus,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder
} from '../controllers/purchasingController.js';
import { requireRole, ROLES } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Supplier routes
router.get('/suppliers', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT]), 
  asyncHandler(getAllSuppliers)
);

router.get('/suppliers/:id', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT]), 
  asyncHandler(getSupplierById)
);

router.post('/suppliers', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT]), 
  asyncHandler(createSupplier)
);

router.put('/suppliers/:id', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT]), 
  asyncHandler(updateSupplier)
);

router.delete('/suppliers/:id', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT]), 
  asyncHandler(deleteSupplier)
);

// Purchase Request routes
router.get('/purchase-requests', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.DEPARTMENT_HEAD]), 
  asyncHandler(getAllPurchaseRequests)
);

router.get('/purchase-requests/:id', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.DEPARTMENT_HEAD]), 
  asyncHandler(getPurchaseRequestById)
);

router.post('/purchase-requests', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.DEPARTMENT_HEAD]), 
  asyncHandler(createPurchaseRequest)
);

router.patch('/purchase-requests/:id/status', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.DEPARTMENT_HEAD]), 
  asyncHandler(updatePurchaseRequestStatus)
);

// Purchase Order routes
router.get('/purchase-orders', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.FINANCE]), 
  asyncHandler(getAllPurchaseOrders)
);

router.get('/purchase-orders/:id', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.FINANCE]), 
  asyncHandler(getPurchaseOrderById)
);

router.post('/purchase-orders', 
  requireRole([ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.FINANCE]), 
  asyncHandler(createPurchaseOrder)
);

export default router;
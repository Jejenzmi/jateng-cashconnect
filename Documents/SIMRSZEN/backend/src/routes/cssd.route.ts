import express from 'express';
import { 
  getAllInstruments, 
  getInstrumentById, 
  createInstrument, 
  updateInstrument, 
  deleteInstrument,
  getAllProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} from '../controllers/cssdController';
import { requirePermission } from '../middleware/rbac.middleware';
import { Permission } from '../middleware/rbac.middleware';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Routes untuk manajemen instrumen
router.get('/instruments', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getAllInstruments
);
router.get('/instruments/:id', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getInstrumentById
);
router.post('/instruments', 
  authenticateToken,
  requirePermission(Permission.CREATE_CSSD), 
  createInstrument
);
router.put('/instruments/:id', 
  authenticateToken,
  requirePermission(Permission.UPDATE_CSSD), 
  updateInstrument
);
router.delete('/instruments/:id', 
  authenticateToken,
  requirePermission(Permission.DELETE_CSSD), 
  deleteInstrument
);

// Routes untuk manajemen proses sterilisasi
router.get('/processes', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getAllProcesses
);
router.get('/processes/:id', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getProcessById
);
router.post('/processes', 
  authenticateToken,
  requirePermission(Permission.CREATE_CSSD), 
  createProcess
);
router.put('/processes/:id', 
  authenticateToken,
  requirePermission(Permission.UPDATE_CSSD), 
  updateProcess
);
router.delete('/processes/:id', 
  authenticateToken,
  requirePermission(Permission.DELETE_CSSD), 
  deleteProcess
);

// Routes untuk manajemen persediaan steril
router.get('/inventory', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getAllInventory
);
router.get('/inventory/:id', 
  authenticateToken,
  requirePermission(Permission.READ_CSSD), 
  getInventoryById
);
router.post('/inventory', 
  authenticateToken,
  requirePermission(Permission.CREATE_CSSD), 
  createInventory
);
router.put('/inventory/:id', 
  authenticateToken,
  requirePermission(Permission.UPDATE_CSSD), 
  updateInventory
);
router.delete('/inventory/:id', 
  authenticateToken,
  requirePermission(Permission.DELETE_CSSD), 
  deleteInventory
);

export default router;
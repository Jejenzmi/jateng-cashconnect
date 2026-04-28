import { Router } from 'express';
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

const router = Router();

// Routes untuk manajemen instrumen
router.get('/instruments', getAllInstruments);
router.get('/instruments/:id', getInstrumentById);
router.post('/instruments', createInstrument);
router.put('/instruments/:id', updateInstrument);
router.delete('/instruments/:id', deleteInstrument);

// Routes untuk manajemen proses sterilisasi
router.get('/processes', getAllProcesses);
router.get('/processes/:id', getProcessById);
router.post('/processes', createProcess);
router.put('/processes/:id', updateProcess);
router.delete('/processes/:id', deleteProcess);

// Routes untuk manajemen persediaan steril
router.get('/inventory', getAllInventory);
router.get('/inventory/:id', getInventoryById);
router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventory);
router.delete('/inventory/:id', deleteInventory);

export default router;
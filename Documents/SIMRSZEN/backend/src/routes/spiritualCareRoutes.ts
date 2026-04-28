import { Router } from 'express';
import { 
  getAllSpiritualRequests,
  getSpiritualRequestById,
  createSpiritualRequest,
  updateSpiritualRequest,
  deleteSpiritualRequest,
  getAllClergy,
  getClergyById,
  createClergy,
  updateClergy,
  deleteClergy,
  getAllSpiritualServices,
  getSpiritualServiceById,
  createSpiritualService,
  updateSpiritualService,
  deleteSpiritualService
} from '../controllers/spiritualCareController';

const router = Router();

// Routes untuk manajemen permintaan pelayanan rohani
router.get('/requests', getAllSpiritualRequests);
router.get('/requests/:id', getSpiritualRequestById);
router.post('/requests', createSpiritualRequest);
router.put('/requests/:id', updateSpiritualRequest);
router.delete('/requests/:id', deleteSpiritualRequest);

// Routes untuk manajemen petugas pelayanan rohani
router.get('/clergy', getAllClergy);
router.get('/clergy/:id', getClergyById);
router.post('/clergy', createClergy);
router.put('/clergy/:id', updateClergy);
router.delete('/clergy/:id', deleteClergy);

// Routes untuk manajemen layanan rohani
router.get('/services', getAllSpiritualServices);
router.get('/services/:id', getSpiritualServiceById);
router.post('/services', createSpiritualService);
router.put('/services/:id', updateSpiritualService);
router.delete('/services/:id', deleteSpiritualService);

export default router;
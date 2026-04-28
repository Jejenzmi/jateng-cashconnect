import { Router } from 'express';
import { 
  getAllTherapySessions,
  getTherapySessionById,
  createTherapySession,
  updateTherapySession,
  deleteTherapySession,
  getAllPhysiotherapists,
  getPhysiotherapistById,
  createPhysiotherapist,
  updatePhysiotherapist,
  deletePhysiotherapist,
  getAllTreatmentPlans,
  getTreatmentPlanById,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan
} from '../controllers/rehabilitationController';

const router = Router();

// Routes untuk manajemen sesi terapi
router.get('/therapy-sessions', getAllTherapySessions);
router.get('/therapy-sessions/:id', getTherapySessionById);
router.post('/therapy-sessions', createTherapySession);
router.put('/therapy-sessions/:id', updateTherapySession);
router.delete('/therapy-sessions/:id', deleteTherapySession);

// Routes untuk manajemen fisioterapis
router.get('/physiotherapists', getAllPhysiotherapists);
router.get('/physiotherapists/:id', getPhysiotherapistById);
router.post('/physiotherapists', createPhysiotherapist);
router.put('/physiotherapists/:id', updatePhysiotherapist);
router.delete('/physiotherapists/:id', deletePhysiotherapist);

// Routes untuk manajemen rencana perawatan
router.get('/treatment-plans', getAllTreatmentPlans);
router.get('/treatment-plans/:id', getTreatmentPlanById);
router.post('/treatment-plans', createTreatmentPlan);
router.put('/treatment-plans/:id', updateTreatmentPlan);
router.delete('/treatment-plans/:id', deleteTreatmentPlan);

export default router;
import { Router } from 'express';
import { 
  getAllPsychologySessions,
  getPsychologySessionById,
  createPsychologySession,
  updatePsychologySession,
  deletePsychologySession,
  getAllPsychologists,
  getPsychologistById,
  createPsychologist,
  updatePsychologist,
  deletePsychologist,
  getAllPsychologyReports,
  getPsychologyReportById,
  createPsychologyReport,
  updatePsychologyReport,
  deletePsychologyReport
} from '../controllers/psychologyController';

const router = Router();

// Routes untuk manajemen sesi terapi psikologi
router.get('/sessions', getAllPsychologySessions);
router.get('/sessions/:id', getPsychologySessionById);
router.post('/sessions', createPsychologySession);
router.put('/sessions/:id', updatePsychologySession);
router.delete('/sessions/:id', deletePsychologySession);

// Routes untuk manajemen psikolog
router.get('/psychologists', getAllPsychologists);
router.get('/psychologists/:id', getPsychologistById);
router.post('/psychologists', createPsychologist);
router.put('/psychologists/:id', updatePsychologist);
router.delete('/psychologists/:id', deletePsychologist);

// Routes untuk manajemen laporan psikologi
router.get('/reports', getAllPsychologyReports);
router.get('/reports/:id', getPsychologyReportById);
router.post('/reports', createPsychologyReport);
router.put('/reports/:id', updatePsychologyReport);
router.delete('/reports/:id', deletePsychologyReport);

export default router;
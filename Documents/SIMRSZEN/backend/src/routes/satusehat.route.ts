import express from 'express';
import { SatuSehatController } from '../controllers/satusehat.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen integrasi SATU SEHAT
router.post('/patient/send/:patientId', validateApiKey, SatuSehatController.sendPatient);
router.post('/visit/send/:visitId', validateApiKey, SatuSehatController.sendVisit);
router.post('/batch/sync', validateApiKey, SatuSehatController.syncBatch);

export default router;
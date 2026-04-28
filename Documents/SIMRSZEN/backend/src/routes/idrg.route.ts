import express from 'express';
import { IdrgController } from '../controllers/idrg.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen integrasi IDRG
router.post('/classify/:visitId', validateApiKey, IdrgController.classify);
router.post('/submit/:visitId', validateApiKey, IdrgController.submitClaim);
router.get('/status/:noKlaim', validateApiKey, IdrgController.getClaimStatus);
router.get('/history/:patientId', validateApiKey, IdrgController.getPatientHistory);

export default router;
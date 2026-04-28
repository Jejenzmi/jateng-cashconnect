import express from 'express';
import { EClaimController } from '../controllers/eclaim.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen integrasi E-Claim
router.post('/sep/create/:visitId', validateApiKey, EClaimController.createSEP);
router.post('/submit/:visitId', validateApiKey, EClaimController.submitClaim);
router.put('/update/:noKlaim', validateApiKey, EClaimController.updateClaim);
router.get('/status/:noKlaim', validateApiKey, EClaimController.getClaimStatus);
router.get('/eligibility', validateApiKey, EClaimController.checkEligibility);

export default router;
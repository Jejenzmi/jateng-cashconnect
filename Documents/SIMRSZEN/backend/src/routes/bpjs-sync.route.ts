import express from 'express';
import { BpjsSyncController } from '../controllers/bpjs-sync.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen sinkronisasi BPJS
router.post('/sync/visit/:visitId', validateApiKey, BpjsSyncController.syncVisit);
router.post('/sync/registration/:visitId', validateApiKey, BpjsSyncController.syncRegistration);
router.post('/sync/treatment/:visitId', validateApiKey, BpjsSyncController.syncTreatment);
router.get('/sync/history/:visitId', validateApiKey, BpjsSyncController.getSyncHistory);
router.put('/sync/status/:syncRecordId', validateApiKey, BpjsSyncController.updateSyncStatus);

export default router;
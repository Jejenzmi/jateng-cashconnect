import express from 'express';
import { BpjsLogController } from '../controllers/bpjs-log.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen log BPJS
router.get('/logs', validateApiKey, BpjsLogController.getLogs);
router.get('/logs/error', validateApiKey, BpjsLogController.getErrorLogs);
router.delete('/logs/cleanup/:days', validateApiKey, BpjsLogController.cleanupOldLogs);
router.get('/logs/stats', validateApiKey, BpjsLogController.getErrorStats);

export default router;
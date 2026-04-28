import express from 'express';
import { BpjsQueueController } from '../controllers/bpjs-queue.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen queue BPJS
router.get('/queue', validateApiKey, BpjsQueueController.getQueue);
router.get('/queue/:id', validateApiKey, BpjsQueueController.getQueueById);
router.post('/queue/:id/retry', validateApiKey, BpjsQueueController.retryJob);
router.delete('/queue/:id', validateApiKey, BpjsQueueController.removeJob);
router.delete('/queue/cleanup', validateApiKey, BpjsQueueController.cleanupCompletedJobs);
router.delete('/queue/cleanup/failed', validateApiKey, BpjsQueueController.cleanupFailedJobs);

export default router;
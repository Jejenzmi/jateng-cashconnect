import express from 'express';
import { BpjsCacheController } from '../controllers/bpjs-cache.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();

// Route untuk manajemen cache BPJS
router.get('/cache', validateApiKey, BpjsCacheController.getCache);
router.get('/cache/:cacheKey', validateApiKey, BpjsCacheController.getCacheByKey);
router.delete('/cache/:cacheKey', validateApiKey, BpjsCacheController.deleteCache);
router.delete('/cache/all', validateApiKey, BpjsCacheController.clearAllCache);
router.post('/cache/cleanup', validateApiKey, BpjsCacheController.cleanupExpired);

export default router;
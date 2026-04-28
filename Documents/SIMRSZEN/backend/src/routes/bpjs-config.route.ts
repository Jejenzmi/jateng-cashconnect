import express from 'express';
import { BpjsConfigController } from '../controllers/bpjs-config.controller';

const router = express.Router();

// Route untuk manajemen konfigurasi BPJS
router.post('/configs', BpjsConfigController.createConfig);
router.get('/configs/:name', BpjsConfigController.getConfigByName);
router.get('/configs', BpjsConfigController.getAllConfigs);
router.put('/configs/:name', BpjsConfigController.updateConfig);
router.delete('/configs/:name', BpjsConfigController.deleteConfig);
router.patch('/configs/:name/toggle', BpjsConfigController.toggleConfigStatus);

export default router;
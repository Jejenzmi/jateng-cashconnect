import express from 'express';
import { IDRGLController } from '../controllers/idrgController';

const router = express.Router();

// Route untuk aturan iDRG
router.post('/idrg-rule', IDRGLController.createIDRGRule);
router.get('/idrg-rules', IDRGLController.getIDRGRules);
router.get('/idrg-rule/:id', IDRGLController.getIDRGRuleById);
router.put('/idrg-rule/:id', IDRGLController.updateIDRGRule);
router.delete('/idrg-rule/:id', IDRGLController.deleteIDRGRule);

// Route untuk kasus pasien iDRG
router.post('/idrg-case', IDRGLController.createIDRGPatientCase);
router.get('/idrg-cases', IDRGLController.getIDRGPatientCases);
router.get('/idrg-case/:id', IDRGLController.getIDRGPatientCaseById);
router.put('/idrg-case/:id/status', IDRGLController.updateIDRGPatientCaseStatus);
router.put('/idrg-case/:id/recalculate', IDRGLController.recalculateIDRGCost);

export default router;
import express from 'express';
import { ICDWHOController } from '../controllers/icdWHOController';

const router = express.Router();

// Route untuk mengatur kredensial
router.post('/credentials', ICDWHOController.setCredentials);

// Route untuk mencari kode ICD
router.get('/search', ICDWHOController.searchICDCodes);

// Route untuk mendapatkan detail kode ICD
router.get('/details/:codeId', ICDWHOController.getICDDetails);

// Route untuk mendapatkan chapter ICD
router.get('/chapters', ICDWHOController.getICDChapters);

export default router;
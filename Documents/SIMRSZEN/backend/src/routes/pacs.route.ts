import express from 'express';
import multer from 'multer';
import { PacsController } from '../controllers/pacs.controller';
import { validateApiKey } from '../middleware/bpjs-auth.middleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage, will be handled in service

// Route untuk manajemen PACS
router.post('/dicom/upload', validateApiKey, upload.single('dicomFile'), PacsController.uploadDicom);
router.get('/dicom/file/:instanceId', validateApiKey, PacsController.getDicomFile);
router.get('/dicom/patient/:patientId/files', validateApiKey, PacsController.getPatientDicomFiles);
router.delete('/dicom/file/:instanceId', validateApiKey, PacsController.deleteDicomFile);
router.post('/study/create', validateApiKey, PacsController.createStudy);

export default router;
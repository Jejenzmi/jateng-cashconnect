import express from 'express';
import { KYCDicomController } from '../controllers/kycDicomController';

const router = express.Router();

// Route untuk KYC Documents
router.post('/kyc-document', KYCDicomController.createKYCDocument);
router.get('/kyc-documents/:faskesProfileId', KYCDicomController.getKYCDocuments);
router.put('/kyc-document/:documentId', KYCDicomController.updateKYCStatus);
router.delete('/kyc-document/:documentId', KYCDicomController.deleteKYCDocument);

// Route untuk DICOM Config
router.post('/dicom-config', KYCDicomController.createOrUpdateDICOMConfig);
router.get('/dicom-config/:faskesProfileId', KYCDicomController.getDICOMConfig);
router.put('/dicom-config/:configId', KYCDicomController.toggleDICOMConfig);
router.delete('/dicom-config/:configId', KYCDicomController.deleteDICOMConfig);

export default router;
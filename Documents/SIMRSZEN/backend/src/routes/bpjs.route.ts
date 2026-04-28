import { Router } from 'express';
import { BpjsController } from '../controllers/bpjsController';

const router = Router();

// Set BPJS credentials
router.post('/credentials', BpjsController.setCredentials);

// VClaim - Get participant by noKartu
router.get('/vclaim/peserta/:noKartu/tglSEP/:tglSEP?', BpjsController.getVClaimParticipantByNoKartu);

// VClaim - Get participant by NIK
router.get('/vclaim/peserta/nik/:nik/tglSEP/:tglSEP?', BpjsController.getVClaimParticipantByNIK);

// VClaim - Insert SEP
router.post('/vclaim/sep', BpjsController.insertSEP);

// VClaim - Get SEP by noSEP
router.get('/vclaim/sep/:noSEP', BpjsController.getSEPByNoSEP);

// VClaim - Get SEP for Inacbg
router.get('/vclaim/inacbg/sep/:noSep', BpjsController.getSEPForInacbg);

export default router;
import express from 'express';
import { SatuSehatMasterDataController } from '../controllers/satusehatMasterDataController';

const router = express.Router();

// Route untuk sinkronisasi master wilayah
router.post('/sync-provinces', SatuSehatMasterDataController.syncProvinces);
router.post('/sync-cities', SatuSehatMasterDataController.syncCities);
router.post('/sync-districts', SatuSehatMasterDataController.syncDistricts);
router.post('/sync-villages', SatuSehatMasterDataController.syncVillages);

// Route untuk sinkronisasi praktisi
router.post('/sync-practitioners', SatuSehatMasterDataController.syncPractitioners);

// Route untuk sinkronisasi KFA
router.post('/sync-kfa', SatuSehatMasterDataController.syncKFA);

// Route untuk sinkronisasi KPTL
router.post('/sync-kptl', SatuSehatMasterDataController.syncKPTL);

// Route untuk mendapatkan data
router.get('/provinces', SatuSehatMasterDataController.getProvinces);
router.get('/cities/:provinceCode', SatuSehatMasterDataController.getCitiesByProvince);
router.get('/districts/:cityCode', SatuSehatMasterDataController.getDistrictsByCity);
router.get('/villages/:districtCode', SatuSehatMasterDataController.getVillagesByDistrict);
router.get('/practitioners', SatuSehatMasterDataController.getPractitioners);
router.get('/kfa-components', SatuSehatMasterDataController.getKFAComponents);
router.get('/kptl-products', SatuSehatMasterDataController.getKPTLProducts);

export default router;
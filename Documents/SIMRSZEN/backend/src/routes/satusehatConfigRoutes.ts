import express from 'express';
import { SatuSehatConfigController } from '../controllers/satusehatConfigController';

const router = express.Router();

// Route untuk membuat atau memperbarui konfigurasi Satu Sehat
router.post('/', SatuSehatConfigController.createOrUpdate);

// Route untuk mendapatkan konfigurasi Satu Sehat
router.get('/', SatuSehatConfigController.getConfig);

// Route untuk menghapus konfigurasi Satu Sehat
router.delete('/', SatuSehatConfigController.deleteConfig);

export default router;
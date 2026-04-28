import express from 'express';
import { SatuSehatController } from '../controllers/satusehatController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Endpoint untuk menyimpan pengaturan Satu Sehat - memerlukan otentikasi admin
router.post('/settings', authenticateToken, SatuSehatController.saveSettings);

// Endpoint untuk mendapatkan pengaturan Satu Sehat - memerlukan otentikasi
router.get('/settings', authenticateToken, SatuSehatController.getSettings);

// Endpoint untuk menguji koneksi ke layanan Satu Sehat - memerlukan otentikasi
router.post('/test-connection', authenticateToken, SatuSehatController.testConnection);

// Route untuk manajemen integrasi SATU SEHAT (menggunakan authenticateToken untuk admin UI)
router.post('/patient/send/:patientId', authenticateToken, SatuSehatController.syncPatient);
router.post('/batch/sync', authenticateToken, SatuSehatController.batchSync);

router.get('/stats', authenticateToken, SatuSehatController.getStats);
router.get('/logs', authenticateToken, SatuSehatController.getLogs);

export default router;
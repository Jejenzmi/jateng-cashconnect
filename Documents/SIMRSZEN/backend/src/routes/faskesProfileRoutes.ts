import express from 'express';
import { FaskesProfileController } from '../controllers/faskesProfileController';
import { authenticateToken } from '../middleware/auth'; // Import the auth middleware

const router = express.Router();

// Route untuk membuat atau memperbarui profil faskes - memerlukan otentikasi
router.post('/', authenticateToken, FaskesProfileController.createOrUpdate);

// Route untuk mendapatkan profil faskes - memerlukan otentikasi
router.get('/', authenticateToken, FaskesProfileController.getProfile);

// Route untuk memperbarui profil faskes - memerlukan otentikasi
router.put('/', authenticateToken, FaskesProfileController.createOrUpdate);

// Route untuk mengecek apakah profil faskes sudah ada - TIDAK PERLU otentikasi
router.get('/check-profile', FaskesProfileController.checkProfile);

export default router;
import { Router } from 'express';
import { setupSystem, checkSetupStatus } from '../controllers/setupController';

const router = Router();

/**
 * @route POST /api/setup
 * @desc Initialize the system with hospital info and admin account
 * @access Public (only before setup is completed)
 */
router.post('/', setupSystem);

/**
 * @route GET /api/setup/status
 * @desc Check if the system has been set up
 * @access Public
 */
router.get('/status', checkSetupStatus);

export default router;
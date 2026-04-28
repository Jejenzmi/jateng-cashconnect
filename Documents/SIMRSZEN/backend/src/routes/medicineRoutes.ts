import { Router } from 'express';

const router = Router();

// Placeholder routes untuk medicine
router.get('/', (_req, res) => {
  res.json({ message: 'Medicine routes are working!' });
});

export default router;
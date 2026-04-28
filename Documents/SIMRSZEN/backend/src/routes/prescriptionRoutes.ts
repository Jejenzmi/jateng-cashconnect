import { Router } from 'express';

const router = Router();

// Placeholder routes untuk prescription
router.get('/', (_req, res) => {
  res.json({ message: 'Prescription routes are working!' });
});

export default router;
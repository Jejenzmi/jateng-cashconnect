import { Router } from 'express';

const router = Router();

// Placeholder routes untuk medical record
router.get('/', (_req, res) => {
  res.json({ message: 'Medical Record routes are working!' });
});

export default router;
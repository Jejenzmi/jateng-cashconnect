import { Router } from 'express';

const router = Router();

// Placeholder routes untuk department
router.get('/', (_req, res) => {
  res.json({ message: 'Department routes are working!' });
});

export default router;
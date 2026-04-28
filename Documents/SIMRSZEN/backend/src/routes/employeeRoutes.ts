import { Router } from 'express';

const router = Router();

// Placeholder routes untuk employee
router.get('/', (_req, res) => {
  res.json({ message: 'Employee routes are working!' });
});

export default router;
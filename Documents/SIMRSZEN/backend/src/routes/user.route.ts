import { Router } from 'express';
const router = Router();

// Placeholder for user routes
router.get('/', (_, res) => {
  res.status(200).json({ message: 'Get users endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get user by ID endpoint: ${req.params.id}` });
});

export { router as userRoutes };
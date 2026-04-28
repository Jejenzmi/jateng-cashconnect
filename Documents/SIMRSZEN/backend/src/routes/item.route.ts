import { Router } from 'express';
const router = Router();

// Placeholder for item routes
router.get('/', (_, res) => {
  res.status(200).json({ message: 'Get items endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get item by ID endpoint: ${req.params.id}` });
});

export { router as itemRoutes };
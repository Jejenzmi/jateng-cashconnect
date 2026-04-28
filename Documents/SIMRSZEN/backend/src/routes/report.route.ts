import { Router } from 'express';
const router = Router();

// Placeholder for report routes
router.get('/', (_, res) => {
  res.status(200).json({ message: 'Get reports endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get report by ID endpoint: ${req.params.id}` });
});

export { router as reportRoutes };
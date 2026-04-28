import { Router } from 'express';
const router = Router();

// Placeholder for patient routes
router.get('/', (_, res) => {
  res.status(200).json({ message: 'Get patients endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get patient by ID endpoint: ${req.params.id}` });
});

export { router as patientRoutes };
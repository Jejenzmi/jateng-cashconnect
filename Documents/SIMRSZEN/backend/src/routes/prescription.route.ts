import { Router } from 'express';
const router = Router();

// Placeholder for prescription routes
router.get('/', (_, res) => {
  res.status(200).json({ message: 'Get prescriptions endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get prescription by ID endpoint: ${req.params.id}` });
});

export { router as prescriptionRoutes };
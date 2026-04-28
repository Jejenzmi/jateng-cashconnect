import express from 'express';
import { ShiftController } from '../controllers/shiftController';
import { requirePermission } from '../middleware/rbac.middleware';
import { Permission } from '../middleware/rbac.middleware';

const router = express.Router();

// Routes for basic shifts
router.get('/', 
  requirePermission(Permission.READ_SHIFT), 
  ShiftController.getAllShifts
);
router.get('/:id', 
  requirePermission(Permission.READ_SHIFT), 
  ShiftController.getShiftById
);
router.post('/', 
  requirePermission(Permission.CREATE_SHIFT), 
  ShiftController.createShift
);
router.put('/:id', 
  requirePermission(Permission.UPDATE_SHIFT), 
  ShiftController.updateShift
);
router.delete('/:id', 
  requirePermission(Permission.DELETE_SHIFT), 
  ShiftController.deleteShift
);

export default router;
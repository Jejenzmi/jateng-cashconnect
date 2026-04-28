import { Router } from 'express';
import authRoutes from './auth';
import patientRoutes from './patients';
import visitRoutes from './visits';
import doctorRoutes from './doctors';
import faskesProfileRoutes from './faskes-profile';
import moduleRoutes from './modules';
import scheduleRoutes from './schedules';
import medicineRoutes from './medicines';
import prescriptionRoutes from './prescriptions';
import billingRoutes from './billing';
import inventoryRoutes from './inventory';
import laboratoryRoutes from './laboratory';
import inpatientRoutes from './inpatient';
import emergencyRoutes from './emergency';
import icuRoutes from './icu';
import radiologyRoutes from './radiology';
import hrRoutes from './hr';
import departmentRoutes from './departments';
import medicalRecordRoutes from './medical-records';
import appointmentRoutes from './appointments';
import satusehatRoutes from './satusehatRoutes';
import billItemRoutes from './billItems';
import billRoutes from './bills';
import setupRoutes from './setup';

const router = Router();

// Public routes
router.use('/setup', setupRoutes);
router.use('/auth', authRoutes);
router.use('/faskes-profile', faskesProfileRoutes);

// Protected routes
router.use('/patients', patientRoutes);
router.use('/visits', visitRoutes);
router.use('/doctors', doctorRoutes);
router.use('/modules', moduleRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/medicines', medicineRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/billing', billingRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/laboratory', laboratoryRoutes);
router.use('/inpatient', inpatientRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/icu', icuRoutes);
router.use('/radiology', radiologyRoutes);
router.use('/hr', hrRoutes);
router.use('/departments', departmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/satusehat', satusehatRoutes);
router.use('/bill-items', billItemRoutes);
router.use('/bills', billRoutes);

export const commonRoutes = router;
export default router;
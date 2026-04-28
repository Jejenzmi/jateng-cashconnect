import { Router } from 'express';
import { 
  getAllPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient,
  searchPatients 
} from '../controllers/patientController';

const router = Router();

router.route('/')
  .get(getAllPatients)
  .post(createPatient);

router.route('/search')
  .get(searchPatients);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default router;
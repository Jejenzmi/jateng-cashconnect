import { Router } from 'express';
import { 
  getAllPatientAssessments,
  getPatientAssessmentById,
  createPatientAssessment,
  updatePatientAssessment,
  deletePatientAssessment,
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getAllNutritionists,
  getNutritionistById,
  createNutritionist,
  updateNutritionist,
  deleteNutritionist
} from '../controllers/nutritionController';

const router = Router();

// Routes untuk manajemen asesmen gizi pasien
router.get('/assessments', getAllPatientAssessments);
router.get('/assessments/:id', getPatientAssessmentById);
router.post('/assessments', createPatientAssessment);
router.put('/assessments/:id', updatePatientAssessment);
router.delete('/assessments/:id', deletePatientAssessment);

// Routes untuk manajemen rencana makanan
router.get('/meal-plans', getAllMealPlans);
router.get('/meal-plans/:id', getMealPlanById);
router.post('/meal-plans', createMealPlan);
router.put('/meal-plans/:id', updateMealPlan);
router.delete('/meal-plans/:id', deleteMealPlan);

// Routes untuk manajemen ahli gizi
router.get('/nutritionists', getAllNutritionists);
router.get('/nutritionists/:id', getNutritionistById);
router.post('/nutritionists', createNutritionist);
router.put('/nutritionists/:id', updateNutritionist);
router.delete('/nutritionists/:id', deleteNutritionist);

export default router;
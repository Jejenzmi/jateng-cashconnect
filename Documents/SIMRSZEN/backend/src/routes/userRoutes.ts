import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserActive,
  loginUser
} from '../controllers/userController';

const router = Router();

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/login')
  .post(loginUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/toggle-status')
  .patch(toggleUserActive);

export default router;
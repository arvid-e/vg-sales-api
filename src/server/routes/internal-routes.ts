import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import UserModel from '../models/UserModel.js';
import { UserRepo } from '../repositories/user-repo.js';
import { UserService } from '../services/user-service.js';
import { internal } from '../middlewares/auth-middleware.js';

const userRepo = new UserRepo(UserModel);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = Router();

router.post('/sync-user', internal, userController.syncUser);
router.post('/test-setup', internal, userController.createTestUser);
router.post('/test-teardown', internal, userController.delete);

export default router;

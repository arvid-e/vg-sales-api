import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import UserModel from '../models/UserModel.js';
import { UserRepo } from '../repositories/user-repo.js';
import { UserService } from '../services/user-service.js';

const userRepo = new UserRepo(UserModel);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.delete('/delete', userController.deleteUser);

export default router;

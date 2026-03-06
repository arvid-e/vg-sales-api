import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import UserModel from '../models/UserModel.js';
import { UserRepo } from '../repositories/user-repo.js';
import { UserService } from '../services/user-service.js';

const userRepo = new UserRepo(UserModel);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = Router();

router.get('/', userController.createUser);

export default router;

import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import UserModel from '../models/UserModel.js';
import { UserRepo } from '../repositories/user-repo.js';
import { UserService } from '../services/user-service.js';
import { identify } from '../middlewares/auth-middleware.js';


const userRepo = new UserRepo(UserModel);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('logout', userController.logout);
router.get('/me', identify, userController.getMe);

export default router;

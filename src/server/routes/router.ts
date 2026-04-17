import { Router } from 'express';
import authRoutes from './auth-routes.js';
import gameRoutes from './game-routes.js';
import internalRoutes from './internal-routes.js';
import platformRoutes from './platform-routes.js';
import publisherRoutes from './publisher-routes.js';
import userRoutes from './user-routes.js';

const router = Router();

router.use('/games', gameRoutes);
router.use('/platforms', platformRoutes);
router.use('/publishers', publisherRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/internal', internalRoutes);

export default router;

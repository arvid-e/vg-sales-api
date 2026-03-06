import { Router } from 'express';
import gameRoutes from './game-routes.js';
import platformRoutes from './platform-routes.js';
import publisherRoutes from './publisher-routes.js';
import userRoutes from './user-routes.js';

const router = Router();

router.use('/games', gameRoutes);
router.use('/platforms', platformRoutes);
router.use('/publishers', publisherRoutes);
router.use('/auth', userRoutes);

export default router;

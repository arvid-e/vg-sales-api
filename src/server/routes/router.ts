import { Router } from 'express';
import gameRoutes from './game-routes.js'

const router = Router();

router.use('/games', gameRoutes);


export default router;

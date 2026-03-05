import { Router } from 'express';
import gameSalesRoutes from './game-sales-routes.js';

const router = Router();

router.use('/sales', gameSalesRoutes);


export default router;

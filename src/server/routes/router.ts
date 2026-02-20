import { Router } from 'express';
import salesRoutes from './sales-routes.js';

const router = Router();

router.use('/sales', salesRoutes);


export default router;

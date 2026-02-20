import { Router } from 'express';
import { SalesController } from '../controllers/sales-controller.js';

const controller = new SalesController();
const router = Router();


router.get('/test', controller.testApi);



export default router;
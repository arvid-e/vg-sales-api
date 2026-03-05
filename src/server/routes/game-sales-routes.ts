import { Router } from 'express';
import { GameSalesController } from '../controllers/game-sales-controller.js';

const controller = new GameSalesController();
const router = Router();

router.get('/test', controller.testApi);


export default router;
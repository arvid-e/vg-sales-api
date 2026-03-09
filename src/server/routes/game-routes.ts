import { Router } from 'express';
import { GameController } from '../controllers/game-controller.js';
import GamesModel from '../models/GamesModel.js';
import { GameRepo } from '../repositories/game-repo.js';
import { GameService } from '../services/game-service.js';
import { authorize } from '../middlewares/auth-middleware.js';

const gameRepo = new GameRepo(GamesModel);
const gameService = new GameService(gameRepo);
const gameController = new GameController(gameService);

const router = Router();

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.patch('/:id', authorize, gameController.updateGame);
router.delete('/:id', authorize, gameController.deleteGameById);
router.post('/', authorize, gameController.addGame);

export default router;

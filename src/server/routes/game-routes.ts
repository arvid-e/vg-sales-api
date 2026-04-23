import { Router } from 'express';
import { GameController } from '../controllers/game-controller.js';
import { authorize, identify } from '../middlewares/auth-middleware.js';
import GamesModel from '../models/GamesModel.js';
import PlatformModel from '../models/PlatformModel.js';
import PublisherModel from '../models/PublisherModel.js';
import { GameRepo } from '../repositories/game-repo.js';
import { PlatformRepo } from '../repositories/platform-repo.js';
import { PublisherRepo } from '../repositories/publisher-repo.js';
import { AIService } from '../services/ai-service.js';
import { GameService } from '../services/game-service.js';

const platformRepo = new PlatformRepo(PlatformModel);
const publisherRepo = new PublisherRepo(PublisherModel);
const aiService = new AIService();
const gameRepo = new GameRepo(GamesModel, aiService);
const gameService = new GameService(gameRepo, platformRepo, publisherRepo);
const gameController = new GameController(gameService);

const router = Router();

router.get('/', authorize, gameController.getAllGames);
router.get('/stats', authorize, gameController.getGroupedGameSales);
router.get('/:id', authorize, gameController.getGame);
router.patch('/:id', authorize, gameController.updateGame);
router.delete('/:id', authorize, gameController.deleteGame);
router.post('/', authorize, gameController.createGame);

export default router;

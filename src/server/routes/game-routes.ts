import { Router } from 'express'
import { GameController } from '../controllers/game-controller.js'
import GamesModel from '../models/GamesModel.js'
import { GameRepo } from '../repositories/game-repo.js'
import { GameService } from '../services/game-service.js'

const gameRepo = new GameRepo(GamesModel)
const gameService = new GameService(gameRepo)
const gameController = new GameController(gameService)

const router = Router()

router.get('/', gameController.getAllGames)
router.get('/:id', gameController.getGameById)

export default router

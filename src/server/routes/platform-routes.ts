import { Router } from 'express'
import { PlatformController } from '../controllers/platform-controller.js'
import PlatformsModel from '../models/PlatformModel.js'
import { PlatformRepo } from '../repositories/platform-repo.js'
import { PlatformService } from '../services/platform-service.js'

const platformRepo = new PlatformRepo(PlatformsModel)
const platformService = new PlatformService(platformRepo)
const platformController = new PlatformController(platformService)

const router = Router()

router.get('/', platformController.getAllPlatforms)
router.get('/:id', platformController.getPlatformById)


export default router

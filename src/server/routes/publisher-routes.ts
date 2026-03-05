import { Router } from 'express'
import { PublisherController } from '../controllers/publisher-controller.js'
import PublishersModel from '../models/PublisherModel.js'
import { PublisherRepo } from '../repositories/publisher-repo.js'
import { PublisherService } from '../services/publisher-service.js'

const publisherRepo = new PublisherRepo(PublishersModel)
const publisherService = new PublisherService(publisherRepo)
const publisherController = new PublisherController(publisherService)

const router = Router()

router.get('/', publisherController.getAllpublishers)
router.get('/:id', publisherController.getpublisherById)


export default router

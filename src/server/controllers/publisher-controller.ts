import type { Request, Response } from 'express'
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js'

export class PublisherController {
  constructor(private publisherService: IPublisherService) {}

  public getAllpublishers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const publisher = await this.publisherService.getAllPublishers(page, limit)

    return res.status(200).json({
      status: 'success',
      data: publisher,
    })
  }

  public getpublisherById = async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' })
    }

    const publisher = await this.publisherService.getPublisherById(id)

    return res.status(200).json({
      status: 'success',
      data: publisher,
    })
  }
}

import type { Request, Response } from 'express'
import type { IPlatformService } from '../interfaces/platform/platform-service.js'

export class PlatformController {
  constructor(private platformService: IPlatformService) {}

  public getAllPlatforms = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const platform = await this.platformService.getAllPlatforms(page, limit)

    return res.status(200).json({
      status: 'success',
      data: platform,
    })
  }

  public getPlatformById = async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' })
    }

    const platform = await this.platformService.getPlatformById(id)

    return res.status(200).json({
      status: 'success',
      data: platform,
    })
  }
}

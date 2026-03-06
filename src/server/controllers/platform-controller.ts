import type { Request, Response } from 'express';
import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import { catchAsync } from '../utils/catch-async.js';

interface PlatformParams {
  id: string;
}

export class PlatformController {
  constructor(private platformService: IPlatformService) {}

  public getAllPlatforms = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const platform = await this.platformService.getAllPlatforms(page, limit);

    return res.status(200).json({
      status: 'success',
      data: platform,
    });
  });

  public getPlatformById = catchAsync(
    async (req: Request<PlatformParams>, res: Response) => {
      const { id } = req.params;

      const platform = await this.platformService.getPlatformById(id);

      return res.status(200).json({
        status: 'success',
        data: platform,
      });
    }
  );
}

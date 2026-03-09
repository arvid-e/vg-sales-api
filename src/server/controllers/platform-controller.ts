import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import { catchAsync } from '../utils/catch-async.js';
import type { UserRequest } from '../interfaces/user/user.js';

interface PlatformParams {
  id: string;
}

export class PlatformController {
  constructor(private platformService: IPlatformService) {}

  public getAllPlatforms = catchAsync(async (req: UserRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { platforms, total } = await this.platformService.getAllPlatforms(page, limit);

    const totalPages = Math.ceil(total / limit);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const platformsWithLinks = platforms.map((platform) => ({
      ...platform.toObject(),
      links: this.createLinks(req, platform._id.toString()),
    }));

    const links: any[] = [
      { rel: 'self', href: `${baseUrl}?page=${page}&limit=${limit}` },
      { rel: 'first', href: `${baseUrl}?page=1&limit=${limit}` },
      { rel: 'last', href: `${baseUrl}?page=${totalPages}&limit=${limit}` },
    ];

    if (page < totalPages) {
      links.push({
        rel: 'next',
        href: `${baseUrl}?page=${page + 1}&limit=${limit}`,
      });
    }

    if (page > 1) {
      links.push({
        rel: 'prev',
        href: `${baseUrl}?page=${page - 1}&limit=${limit}`,
      });
    }

    if (req.user) {
      links.push({ rel: 'create', method: 'POST', href: baseUrl });
    }
    
    return res.status(200).json({
      status: 'success',
      count: platformsWithLinks.length,
      total,
      totalPages,
      currentPage: page,
      data: platformsWithLinks,
      links, 
    });
  });

  public getPlatformById = catchAsync(
    async (req: Request<any>, res: Response) => {
      const { id } = req.params as PlatformParams;

      const platform = await this.platformService.getPlatformById(id);

      if (!platform) {
        throw new NotFoundError('Platform');
      }

      return res.status(200).json({
        status: 'success',
        data: {
          ...platform.toObject(),
          links: this.createLinks(req, id),
        },
      });
    }
  );

  private createLinks(req: UserRequest, gameId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${gameId}` },
      { rel: 'all-platforms', method: 'GET', href: `${baseUrl}` },
    ];

    return links;
  }
}

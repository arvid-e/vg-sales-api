import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import type { UserRequest } from '../interfaces/user/user.js';
import { createPaginationLinks } from '../middlewares/create-pagination-links.js';
import { catchAsync } from '../utils/catch-async.js';

interface PlatformParams {
  id: string;
}

export class PlatformController {
  constructor(private platformService: IPlatformService) {}

  public getAllPlatforms = catchAsync(
    async (req: UserRequest, res: Response) => {
      const { page, limit, name } = req.query;

      const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;
      const platformName = typeof name === 'string' ? name : undefined;

      const { platforms, total } = await this.platformService.getAllPlatforms({
        page: parsedPage,
        limit: parsedLimit,
        query: { name: platformName },
      });

      const totalPages = Math.ceil(total / parsedLimit);
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const hasUser = !!req.user;

      const platformsWithLinks = platforms.map((platform) => {
        const platformJson = platform.toJSON();

        return {
          ...platformJson,
          links: this.createLinks(req, platformJson.platformId),
        };
      });

      const paginationLinks = createPaginationLinks({
        baseUrl,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasUser,
      });

      return res.status(200).json({
        status: 'success',
        count: platformsWithLinks.length,
        total,
        totalPages,
        currentPage: parsedPage,
        data: platformsWithLinks,
        links: paginationLinks,
      });
    }
  );

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
          ...platform.toJSON(),
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

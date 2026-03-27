import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import type { UserRequest } from '../interfaces/requests/request-types.js';
import { createPaginationLinks } from '../middlewares/create-pagination-links.js';
import { catchAsync } from '../utils/catch-async.js';

/**
 * Controller handling all Platform related HTTP requests.
 * Orchestrates communication between the client and PlatformService.
 */
export class PlatformController {
  constructor(private platformService: IPlatformService) {}

  /**
   * Retrieves a paginated list of platforms with optional filtering.
   * Supports filtering by platform name.
   */
  public getAllPlatforms = catchAsync(
    async (req: UserRequest, res: Response) => {
      // 1. Extract and normalize query parameters
      const { page, limit, name } = req.query;

      const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;
      const platformName = typeof name === 'string' ? name : undefined;

      // 2. Fetch data from service
      const { platforms, total } = await this.platformService.getAllPlatforms({
        page: parsedPage,
        limit: parsedLimit,
        query: { name: platformName },
      });

      // 3. Prepare response metadata
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

  /**
   * Fetches a single platform by its ID.
   * @throws {NotFoundError} If no platform matches the provided ID.
   */
  public getPlatformById = catchAsync(
    async (req: Request<any>, res: Response) => {
      const { id } = req.params;

      if (id == null || !isValidObjectId(id)) {
        throw new BadRequestError('Invalid ID');
      }

      const platform = await this.platformService.getPlatformById(id);

      if (platform == null) {
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

  /**
   * Generates HATEOAS links based on resource ID.
   */
  private createLinks(req: UserRequest, platformId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${platformId}` },
      { rel: 'all-platforms', method: 'GET', href: `${baseUrl}` },
    ];

    return links;
  }
}

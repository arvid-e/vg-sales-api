import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type { UserRequest } from '../interfaces/user/user.js';
import { createPaginationLinks } from '../middlewares/create-pagination-links.js';
import { catchAsync } from '../utils/catch-async.js';

interface PublisherParams {
  id: string;
}

export class PublisherController {
  constructor(private publisherService: IPublisherService) {}

  public getAllPublishers = catchAsync(
    async (req: UserRequest, res: Response) => {
      const { page, limit, name } = req.query;

      const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;
      const publisherName = typeof name === 'string' ? name : undefined;

      const { publishers, total } = await this.publisherService.getAllPublishers({
        page: parsedPage,
        limit: parsedLimit,
        query: { name: publisherName },
      });

      const totalPages = Math.ceil(total / parsedLimit);
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const hasUser = !!req.user;

      const publishersWithLinks = publishers.map((publisher) => {
        const publisherJson = publisher.toJSON();

        return {
          ...publisherJson,
          links: this.createLinks(req, publisherJson.publisherId),
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
        count: publishersWithLinks.length,
        total,
        totalPages,
        currentPage: parsedPage,
        data: publishersWithLinks,
        links: paginationLinks,
      });
    }
  );

  public getpublisherById = catchAsync(
    async (req: Request<any>, res: Response) => {
      const { id } = req.params as PublisherParams;

      const publisher = await this.publisherService.getPublisherById(id);

      if (!publisher) {
        return new NotFoundError('Publisher');
      }

      return res.status(200).json({
        status: 'success',
        data: {
          ...publisher.toJSON(),
          links: this.createLinks(req, id),
        },
      });
    }
  );

  private createLinks(req: UserRequest, gameId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${gameId}` },
      { rel: 'all-publishers', method: 'GET', href: `${baseUrl}` },
    ];

    return links;
  }
}

import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type { UserRequest } from '../interfaces/user/user.js';
import { catchAsync } from '../utils/catch-async.js';

interface PublisherParams {
  id: string;
}

export class PublisherController {
  constructor(private publisherService: IPublisherService) {}

  public getAllPublishers = catchAsync(
    async (req: UserRequest, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { publishers, total } =
        await this.publisherService.getAllPublishers(page, limit);

      const totalPages = Math.ceil(total / limit);
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

      const publishersWithLinks = publishers.map((publisher) => ({
        ...publisher.toObject(),
        links: this.createLinks(req, publisher._id.toString()),
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
        count: publishersWithLinks.length,
        total,
        totalPages,
        currentPage: page,
        data: publishersWithLinks,
        links,
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
          ...publisher.toObject(),
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

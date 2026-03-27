import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type {
  UserRequest,
  UserRequestWithId,
} from '../interfaces/requests/request-types.js';
import { createPaginationLinks } from '../middlewares/create-pagination-links.js';
import { catchAsync } from '../utils/catch-async.js';
/**
 * Controller handling all Publisher related HTTP requests.
 * Orchestrates communication between the client and PublisherService.
 */
export class PublisherController {
  constructor(private publisherService: IPublisherService) {}

  /**
   * Retrieves a paginated list of publishers with optional filtering.
   * Supports filtering by publisher name.
   */
  public getAllPublishers = catchAsync(
    async (req: UserRequest, res: Response) => {
      // 1. Extract and normalize query parameters
      const { page, limit, name } = req.query;

      const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;
      const publisherName = typeof name === 'string' ? name : undefined;

      // 2. Fetch data from service
      const { publishers, total } =
        await this.publisherService.getAllPublishers({
          page: parsedPage,
          limit: parsedLimit,
          query: { name: publisherName },
        });

      // 3. Prepare response metadata
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

  /**
   * Fetches a single publisher by its ID.
   * @throws {NotFoundError} If no publisher matches the provided ID.
   */
  public getpublisherById = catchAsync(
    async (req: UserRequestWithId, res: Response) => {
      const { id } = req.params;

      if (id == null || !isValidObjectId(id)) {
        throw new BadRequestError('Invalid ID');
      }

      const publisher = await this.publisherService.getPublisherById(id);

      if (publisher == null) {
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

  /**
   * Generates HATEOAS links based on resource ID.
   */
  private createLinks(req: Request, publisherId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${publisherId}` },
      { rel: 'all-publishers', method: 'GET', href: `${baseUrl}` },
    ];

    return links;
  }
}

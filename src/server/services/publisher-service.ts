import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type {
  IPublisherDocument,
  IPublisherQuery,
} from '../interfaces/publisher/publisher.js';

/**
 * Service for managing Publisher resources.
 */
export class PublisherService implements IPublisherService {
  constructor(private publisherRepo: IPublisherRepo) {}

  /**
   * Fetches publishers with pagination and optional name filtering.
   */
  getAllPublishers = async (
    publisherQuery: IPublisherQuery
  ): Promise<{ publishers: IPublisherDocument[]; total: number }> => {
    const { page = 1, limit = 20, query = {} } = publisherQuery;
    const mongoQuery: any = {};

    if (query.name != null) {
      // Escape special regex characters to prevent syntax errors from user input
      const escapedName = query.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      mongoQuery.name = { $regex: new RegExp(escapedName, 'i') };
    }

    return await this.publisherRepo.getAllPublishers({
      page,
      limit,
      query: mongoQuery,
    });
  };

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    const publisher = await this.publisherRepo.getById(id);

    if (publisher == null) {
      throw new NotFoundError('Publisher');
    }

    return publisher;
  };
}

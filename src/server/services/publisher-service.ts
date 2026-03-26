import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type {
  IPublisherDocument,
  IPublisherQuery,
} from '../interfaces/publisher/publisher.js';

export class PublisherService implements IPublisherService {
  constructor(private publisherRepo: IPublisherRepo) {}

  getAllPublishers = async (
    publisherQuery: IPublisherQuery
  ): Promise<{ publishers: IPublisherDocument[]; total: number }> => {
    const { page = 1, limit = 20, query = {} } = publisherQuery;

    if (query.name != null) {
      const escapedName = query.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: new RegExp(escapedName, 'i') };
    }

    return await this.publisherRepo.getAllPublishers({ page, limit, query });
  };

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    const publisher = await this.publisherRepo.getById(id);

    if (publisher == null) {
      throw new NotFoundError('Publisher');
    }

    return publisher;
  };
}

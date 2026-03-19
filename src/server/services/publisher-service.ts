import { NotFoundError } from '../errors/not-found-error.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';
import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js';

export class PublisherService implements IPublisherService {
  constructor(private publisherRepo: IPublisherRepo) {}

  getAllPublishers = async (
    page: number,
    limit: number
  ): Promise<{ publishers: IPublisherDocument[]; total: number }> => {
    return await this.publisherRepo.getAllPublishers(page, limit);
  };

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    const publisher = this.publisherRepo.getById(id);

    if (publisher == null) {
      throw new NotFoundError('Publisher');
    }

    return publisher;
  };
}

import type { IPublisherService } from '../interfaces/publisher/publisher-service.js';
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';

export class PublisherService implements IPublisherService {
  constructor(private publisherRepo: IPublisherRepo) {}

  getAllPublishers = async (
    page: number,
    limit: number
  ): Promise<{ publishers: IPublisherDocument[]; total: number }> => {
    return await this.publisherRepo.getAllPublishers(page, limit);
  };

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    return await this.publisherRepo.getById(id);
  };
}

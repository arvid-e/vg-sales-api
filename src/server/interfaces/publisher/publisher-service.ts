import type { IPublisherDocument, IPublisherQuery } from './publisher.js';

export interface IPublisherService {
  getAllPublishers(
    query: IPublisherQuery
  ): Promise<{ publishers: IPublisherDocument[]; total: number }>;
  getPublisherById(id: string): Promise<IPublisherDocument | null>;
}

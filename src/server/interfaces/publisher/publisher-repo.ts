import type { IPublisherDocument, IPublisherQuery } from './publisher.js';

export interface IPublisherRepo {
  getAllPublishers(
    query: IPublisherQuery
  ): Promise<{ publishers: IPublisherDocument[]; total: number }>;
  getById(id: string): Promise<IPublisherDocument | null>;
  getIdByName(name: string): Promise<string | null>;
}

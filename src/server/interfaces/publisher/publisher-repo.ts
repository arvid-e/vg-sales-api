import type { IPublisherDocument } from './publisher.js';

export interface IPublisherRepo {
  getAllPublishers(
    page: number,
    limit: number
  ): Promise<{ publishers: IPublisherDocument[]; total: number }>;
  getById(id: string): Promise<IPublisherDocument | null>;
  getIdByName(name: string): Promise<string | null>;
}

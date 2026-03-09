import type { IPublisherDocument } from './publisher.js';

export interface IPublisherService {
  getAllPublishers(page: number, limit: number): Promise<{ publishers: IPublisherDocument[]; total: number }>;
  getPublisherById(id: string): Promise<IPublisherDocument | null>;
}

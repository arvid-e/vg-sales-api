import type { IPublisherDocument } from './publisher.js';

export interface IPublisherService {
  getAllPublishers(page: number, limit: number): Promise<IPublisherDocument[]>;
  getPublisherById(id: string): Promise<IPublisherDocument | null>;
}

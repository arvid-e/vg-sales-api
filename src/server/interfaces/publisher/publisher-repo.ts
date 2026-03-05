import type { IPublisherDocument } from './publisher.js'

export interface IPublisherRepo {
  getAllPublishers(page: number, limit: number): Promise<IPublisherDocument[]>
  getPublisherById(id: string): Promise<IPublisherDocument | null>
}

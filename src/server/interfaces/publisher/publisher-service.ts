import type { IPublisherDocument } from './publisher.js'

export interface IPublisherService {
  getAllPublishers(): IPublisherDocument[]
  getPublisherById(): IPublisherDocument | null
}

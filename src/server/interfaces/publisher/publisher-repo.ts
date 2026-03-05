import type { IPublisher } from "./publisher.js" 

export interface IPublisherRepo {
  getAllPublishers(): Promise<IPublisher[]>
  getPublisherById(id: string): Promise<IPublisher | null>
}

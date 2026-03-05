import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js'
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js'
import PublisherModel from '../models/PublisherModel.js'

export class PublisherRepo implements IPublisherRepo {
  constructor(private publisherModel: typeof PublisherModel) {}

  getAllPublishers = async (
    page: number = 1,
    limit: number = 20
  ): Promise<IPublisherDocument[]> => {
    const skip = (page - 1) * limit

    return await this.publisherModel.find().sort({ rank: 1 }).skip(skip).limit(limit)
  }

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    return await this.publisherModel.findById(id);
  }
}

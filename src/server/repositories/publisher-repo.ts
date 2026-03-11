import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js';
import PublisherModel from '../models/PublisherModel.js';

export class PublisherRepo implements IPublisherRepo {
  constructor(private publisherModel: typeof PublisherModel) {}

  getAllPublishers = async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ publishers: IPublisherDocument[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [publishers, total] = await Promise.all([
      this.publisherModel.find().sort({ rank: 1 }).skip(skip).limit(limit),
      this.publisherModel.countDocuments(),
    ]);

    return { publishers, total };
  };

  getPublisherById = async (id: string): Promise<IPublisherDocument | null> => {
    return await this.publisherModel.findById(id);
  };
}

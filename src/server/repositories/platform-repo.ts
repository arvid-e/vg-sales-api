import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';
import type { IPlatformDocument } from '../interfaces/platform/platform.js';
import PlatformModel from '../models/PlatformModel.js';

export class PlatformRepo implements IPlatFormRepo {
  constructor(private platformModel: typeof PlatformModel) {}

  getAllPlatforms = async ({
    page = 1,
    limit = 20,
    query = {},
  }): Promise<{ platforms: IPlatformDocument[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [platforms, total] = await Promise.all([
      this.platformModel.find(query).sort({ rank: 1 }).skip(skip).limit(limit),
      this.platformModel.countDocuments(query),
    ]);

    return { platforms, total };
  };

  getById = async (id: string): Promise<IPlatformDocument | null> => {
    return await this.platformModel.findById(id);
  };

  getIdByName = async (name: string): Promise<string | null> => {
    const platform = await this.platformModel
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      .select('_id')
      .exec();

    return platform ? platform._id.toString() : null;
  };
}

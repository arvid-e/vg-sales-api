import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';
import type { IPlatformDocument } from '../interfaces/platform/platform.js';
import PlatformModel from '../models/PlatformModel.js';

export class PlatformRepo implements IPlatFormRepo {
  constructor(private platformModel: typeof PlatformModel) {}

  getAllPlatforms = async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ platforms: IPlatformDocument[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [platforms, total] = await Promise.all([
      this.platformModel.find().sort({ rank: 1 }).skip(skip).limit(limit),
      this.platformModel.countDocuments(),
    ]);

    return { platforms, total };
  };

  getPlatformById = async (id: string): Promise<IPlatformDocument | null> => {
    return await this.platformModel.findById(id);
  };
}

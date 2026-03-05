import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js'
import type { IPlatformDocument } from '../interfaces/platform/platform.js'
import PlatformModel from '../models/PlatformModel.js'

export class PlatformRepo implements IPlatFormRepo {
  constructor(private platformModel: typeof PlatformModel) {}

  getAllPlatforms = async (
    page: number = 1,
    limit: number = 20
  ): Promise<IPlatformDocument[]> => {
    const skip = (page - 1) * limit

    return await this.platformModel.find().sort({ rank: 1 }).skip(skip).limit(limit)
  }

  getPlatformById = async (id: string): Promise<IPlatformDocument | null> => {
    return await this.platformModel.findById(id);
  }
}

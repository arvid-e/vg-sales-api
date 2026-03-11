import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import type { IPlatformDocument } from '../interfaces/platform/platform.js';
import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';

export class PlatformService implements IPlatformService {
  constructor(private platformRepo: IPlatFormRepo) {}

  getAllPlatforms = async (
    page: number,
    limit: number
  ): Promise<{ platforms: IPlatformDocument[]; total: number }> => {
    return await this.platformRepo.getAllPlatforms(page, limit);
  };

  getPlatformById = async (id: string): Promise<IPlatformDocument | null> => {
    return await this.platformRepo.getPlatformById(id);
  };
}

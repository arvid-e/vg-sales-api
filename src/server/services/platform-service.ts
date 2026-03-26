import { NotFoundError } from '../errors/not-found-error.js';
import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';
import type { IPlatformService } from '../interfaces/platform/platform-service.js';
import type {
  IPlatformDocument,
  IPlatformQuery,
} from '../interfaces/platform/platform.js';

export class PlatformService implements IPlatformService {
  constructor(private platformRepo: IPlatFormRepo) {}

  getAllPlatforms = async (
    platformQuery: IPlatformQuery
  ): Promise<{ platforms: IPlatformDocument[]; total: number }> => {
    const { page = 1, limit = 20, query = {} } = platformQuery;
    const mongoQuery: any = {};

    if (query.name != null) {
      const escapedName = query.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      mongoQuery.name = { $regex: new RegExp(escapedName, 'i') };
    }

    return await this.platformRepo.getAllPlatforms({ page, limit, query: mongoQuery });
  };

  getPlatformById = async (id: string): Promise<IPlatformDocument | null> => {
    const platform = await this.platformRepo.getById(id);

    if (platform == null) {
      throw new NotFoundError('Platform');
    }

    return platform;
  };
}

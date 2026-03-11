import type { IPlatformDocument } from './platform.js';

export interface IPlatformService {
  getAllPlatforms(
    page: number,
    limit: number
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getPlatformById(id: string): Promise<IPlatformDocument | null>;
}

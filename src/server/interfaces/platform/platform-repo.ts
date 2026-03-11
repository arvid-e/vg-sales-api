import type { IPlatformDocument } from './platform.js';

export interface IPlatFormRepo {
  getAllPlatforms(
    page: number,
    limit: number
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getPlatformById(id: string): Promise<IPlatformDocument | null>;
}

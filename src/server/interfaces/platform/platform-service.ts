import type { IPlatformDocument, IPlatformQuery } from './platform.js';

export interface IPlatformService {
  getAllPlatforms(
    query: IPlatformQuery
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getPlatformById(id: string): Promise<IPlatformDocument | null>;
}

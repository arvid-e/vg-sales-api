import type { IPlatformDocument, IPlatformQuery } from './platform.js';

export interface IPlatformService {
  getAllPlatforms(
    platformQuery: IPlatformQuery
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getPlatformById(id: string): Promise<IPlatformDocument | null>;
}

import type { IPlatformDocument, IPlatformQuery } from './platform.js';

export interface IPlatFormRepo {
  getAllPlatforms(
    query: IPlatformQuery
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getById(id: string): Promise<IPlatformDocument | null>;
  getIdByName(name: string): Promise<string | null>;
}

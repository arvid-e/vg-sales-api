import type { IPlatformDocument } from './platform.js';

export interface IPlatFormRepo {
  getAllPlatforms(
    page: number,
    limit: number
  ): Promise<{ platforms: IPlatformDocument[]; total: number }>;
  getById(id: string): Promise<IPlatformDocument | null>;
  getIdByName(name: string): Promise<string | null>;
}

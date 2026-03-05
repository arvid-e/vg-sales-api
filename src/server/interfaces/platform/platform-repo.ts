import type { IPlatformDocument } from './platform.js'

export interface IPlatFormRepo {
  getAllPlatforms(page: number, limit: number): Promise<IPlatformDocument[]>
  getPlatformById(id: string): Promise<IPlatformDocument | null>
}

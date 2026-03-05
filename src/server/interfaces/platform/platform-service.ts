import type { IPlatformDocument } from './platform.js'

export interface IPlatformService {
  getAllPlatforms(page: number, limit: number): Promise<IPlatformDocument[]>
  getPlatformById(id: string): Promise<IPlatformDocument | null>
}

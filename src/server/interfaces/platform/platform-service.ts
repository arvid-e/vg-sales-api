import type { IPlatformDocument } from './platform.js'

export interface IPlatformService {
  getAllPlatforms(): IPlatformDocument[]
  getPlatformById(): IPlatformDocument | null
}

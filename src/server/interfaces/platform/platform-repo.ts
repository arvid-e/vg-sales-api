import type { IPlatformDocument } from "./platform.js" 

export interface IPlatFormRepo {
  getAllPlatforms(): Promise<IPlatformDocument[]>
  getPlatformById(id: string): Promise<IPlatformDocument | null>
}

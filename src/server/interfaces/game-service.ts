import type { IGameDocument } from './game.js'

export interface IGameService {
  getAllGames(page: number, limit: number): Promise<IGameDocument[]>
  getGameById(id: string): Promise<IGameDocument | null>
  deleteGameById(id: string): Promise<boolean>;
}

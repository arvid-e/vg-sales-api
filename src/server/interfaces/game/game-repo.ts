import type { IGameDocument, IGame } from './game.js'

export interface IGameRepo {
  getAllGames(page: number, limit: number): Promise<IGameDocument[]>
  getGameById(id: string): Promise<IGameDocument | null>
  deleteGameById(id: string): Promise<boolean>
  addGame(game: IGame): Promise<IGameDocument | null>
}

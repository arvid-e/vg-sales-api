import type { IGameDocument, IGame } from './game.js';

export interface IGameService {
  getAllGames(page: number, limit: number): Promise<IGameDocument[]>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  addGame(game: IGame): Promise<IGameDocument | null>;
}

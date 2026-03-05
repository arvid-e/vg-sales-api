import type { IGameDocument, IGame, IUpdateGamePayload } from './game.js';

export interface IGameService {
  getAllGames(page: number, limit: number): Promise<IGameDocument[]>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(updateGamePayload: IUpdateGamePayload): Promise<boolean>;
  addGame(game: IGame): Promise<IGameDocument | null>;
}

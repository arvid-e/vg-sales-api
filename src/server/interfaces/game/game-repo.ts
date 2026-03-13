import type { IGame, IGameDocument, IUpdateGamePayload } from './game.js';

export interface IGameRepo {
  getAllGames(
    page: number,
    limit: number,
    query: any
  ): Promise<{ games: IGameDocument[]; total: number }>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null>;
  createGame(game: IGame): Promise<IGameDocument | null>;
}

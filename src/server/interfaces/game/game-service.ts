import type {
  IGame,
  IGameDocument,
  IGameFilter,
  IUpdateGamePayload,
} from './game.js';

export interface IGameService {
  getAllGames(
    page: number,
    limit: number,
    filter: IGameFilter
  ): Promise<{ games: IGameDocument[]; total: number }>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null>;
  createGame(game: IGame): Promise<IGameDocument | null>;
}

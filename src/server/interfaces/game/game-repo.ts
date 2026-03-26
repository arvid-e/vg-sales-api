import type {
  IGame,
  IGameDocument,
  IGameQuery,
  IUpdateGamePayload,
} from './game.js';

export interface IGameRepo {
  getAllGames(
    gameQuery: IGameQuery
  ): Promise<{ games: IGameDocument[]; total: number }>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null>;
  createGame(game: IGame): Promise<IGameDocument | null>;
}

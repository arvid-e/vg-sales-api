import type {
  IGame,
  IGameDocument,
  IGameQuery,
  IGroupedGameSales,
  IUpdateGamePayload,
} from './game.js';

export interface IGameService {
  getAllGames(
    gameQuery: IGameQuery
  ): Promise<{ games: IGameDocument[]; total: number }>;
  getGameById(id: string): Promise<IGameDocument | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null>;
  createGame(game: IGame): Promise<IGameDocument | null>;
  getGroupedGameSales(field: string): Promise<IGroupedGameSales[]>;
}

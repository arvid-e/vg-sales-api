import type {
  IGame,
  IGameDocument,
  IGameMongoFilter,
  IGroupedGameSales,
  IUpdateGamePayload,
} from './game.js';

export interface IGameRepo {
  getAllGames(
    filter: IGameMongoFilter,
    page: number,
    limit: number
  ): Promise<{ games: IGame[]; total: number }>;
  getGameById(id: string): Promise<IGame | null>;
  deleteGameById(id: string): Promise<boolean>;
  updateGame(
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null>;
  createGame(game: IGame): Promise<IGameDocument | null>;
  getStats(groupBy: string): Promise<IGroupedGameSales[]>;
  searchGamesLocally(query: string): Promise<IGame[]>;
}

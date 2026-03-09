import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type {
  IGame,
  IGameDocument,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';

export class GameService implements IGameService {
  constructor(private gameRepo: IGameRepo) {}

  public getAllGames = async (
    page: number,
    limit: number
  ): Promise<{ games: IGameDocument[]; total: number }> => {
    const { games, total } = await this.gameRepo.getAllGames(page, limit);

    return { games, total };
  };

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.getGameById(id);

    if (!game) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  public updateGame = async (
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.updateGame(updateGamePayload);

    if (!game) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  public deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameRepo.deleteGameById(id);

    if (!deleted) {
      throw new NotFoundError('Game');
    }

    return deleted;
  };

  public createGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameRepo.createGame(game);
  };
}

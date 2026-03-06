import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IGame, IGameDocument, IUpdateGamePayload } from '../interfaces/game/game.js';
import { NotFoundError } from '../errors/not-found-error.js';

export class GameService implements IGameService {
  constructor(private gameRepo: IGameRepo) {}

  public getAllGames = async (
    page: number,
    limit: number
  ): Promise<IGameDocument[]> => {
    return this.gameRepo.getAllGames(page, limit);
  };

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.getGameById(id);

    if (!game) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  public updateGame = async (updateGamePayload: IUpdateGamePayload): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.updateGame(updateGamePayload);

    if (!game) {
      throw new NotFoundError('Game');
    }

    return game;
  }

  public deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameRepo.deleteGameById(id);

    if (!deleted) {
      throw new NotFoundError('Game');
    }

    return deleted;
  };

  public addGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameRepo.addGame(game);
  };
}

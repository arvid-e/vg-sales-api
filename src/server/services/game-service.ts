import mongoose from 'mongoose';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type {
  IGame,
  IGameDocument,
  IGameFilter,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';

export class GameService implements IGameService {
  constructor(
    private gameRepo: IGameRepo,
    private platformRepo: IPlatFormRepo,
    private publisherRepo: IPublisherRepo
  ) {}

  public getAllGames = async (
    page: number,
    limit: number,
    filter: IGameFilter
  ): Promise<{ games: IGameDocument[]; total: number }> => {
    const query: any = {};

    if (filter.genre) {
      query.genre = { $regex: new RegExp(filter.genre, 'i') };
    }

    if (filter.platform) {
      const platformId = await this.platformRepo.getIdByName(filter.platform);
      query.platform = platformId || new mongoose.Types.ObjectId();
    }

    if (filter.publisher) {
      const publisherId = await this.publisherRepo.getIdByName(
        filter.publisher
      );
      query.publisher = publisherId || new mongoose.Types.ObjectId();
    }

    return await this.gameRepo.getAllGames(page, limit, query);
  };

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.getGameById(id);

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  public updateGame = async (
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.updateGame(updateGamePayload);

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  public deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameRepo.deleteGameById(id);

    if (deleted == null) {
      throw new NotFoundError('Game');
    }

    return deleted;
  };

  public createGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameRepo.createGame(game);
  };
}

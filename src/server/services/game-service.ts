import mongoose from 'mongoose';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type {
  IGame,
  IGameDocument,
  IGameQuery,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import type { IPlatFormRepo } from '../interfaces/platform/platform-repo.js';
import type { IPublisherRepo } from '../interfaces/publisher/publisher-repo.js';

/**
 * Handles complex business logic for Game management.
 * Interfaces with multiple repositories to ensure data integrity across the domain.
 */
export class GameService implements IGameService {
  constructor(
    private gameRepo: IGameRepo,
    private platformRepo: IPlatFormRepo,
    private publisherRepo: IPublisherRepo
  ) {}

  /**
   * Fetches games with pagination and optional filtering by genre, platform and publisher.
   */
  public getAllGames = async (
    gameQuery: IGameQuery
  ): Promise<{ games: IGameDocument[]; total: number }> => {
    const { page = 1, limit = 20, query = {} } = gameQuery;
    const mongoQuery: any = {};

    if (query.genre) {
      // Escape special regex characters to prevent syntax errors from user input
      const escapedGenre = query.genre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      mongoQuery.genre = { $regex: new RegExp(escapedGenre, 'i') };
    }

    if (query.platform) {
      const platformId = await this.platformRepo.getIdByName(query.platform);
      // If the platform name doesn't exist, use a dummy ID to ensure 0 results are returned
      mongoQuery.platform = platformId || new mongoose.Types.ObjectId();
    }

    if (query.publisher) {
      const publisherId = await this.publisherRepo.getIdByName(query.publisher);
      mongoQuery.publisher = publisherId || new mongoose.Types.ObjectId();
    }

    return await this.gameRepo.getAllGames({ page, limit, query: mongoQuery });
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

    if (!deleted) {
      throw new NotFoundError('Game');
    }

    return deleted;
  };

  /**
   * Orchestrates the creation of a game by validating that related
   * Platform and Publisher records exist first.
   */
  public createGame = async (game: IGame): Promise<IGameDocument | null> => {
    // Validate both relationships in parallel to minimize database round-trip time
    const [platform, publisher] = await Promise.all([
      game.platform
        ? this.platformRepo.getById(game.platform.toString())
        : Promise.resolve(true),
      game.publisher
        ? this.publisherRepo.getById(game.publisher.toString())
        : Promise.resolve(true),
    ]);

    if (!platform) {
      throw new NotFoundError('Platform');
    }

    if (!publisher) {
      throw new NotFoundError('Publisher');
    }

    return await this.gameRepo.createGame(game);
  };
}

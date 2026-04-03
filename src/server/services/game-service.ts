import mongoose from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type {
  IGame,
  IGameDocument,
  IGameQuery,
  IGameSalesGroups,
  IGroupedGameSales,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import { VALID_GROUPS } from '../interfaces/game/game.js';
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
   * Fetches games with pagination and optional filtering.
   */
  getAllGames = async (
    gameQuery: IGameQuery
  ): Promise<{ games: IGame[]; total: number }> => {
    const { page = 1, limit = 20, ...filters } = gameQuery;

    if (filters.search) {
      const semanticResults = await this.gameRepo.searchGamesLocally(
        filters.search
      );

      return {
        games: semanticResults,
        total: semanticResults.length,
      };
    }

    const query = await this.buildMongoQuery(filters);

    return await this.gameRepo.getAllGames(query, page, limit);
  };

  getGameById = async (id: string): Promise<IGame | null> => {
    const game = await this.gameRepo.getGameById(id);

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  updateGame = async (
    updateGamePayload: IUpdateGamePayload
  ): Promise<IGameDocument | null> => {
    const game = await this.gameRepo.updateGame(updateGamePayload);

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return game;
  };

  deleteGameById = async (id: string): Promise<boolean> => {
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
  createGame = async (game: IGame): Promise<IGameDocument | null> => {
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

  /**
   * Get the top 15 sales by genre, platform or publisher.
   */
  getGroupedGameSales = async (field: string): Promise<IGroupedGameSales[]> => {
    if (!VALID_GROUPS.includes(field as keyof IGameSalesGroups)) {
      throw new BadRequestError(`Invalid grouping field: ${field}`);
    }

    return await this.gameRepo.getStats(field);
  };

  private buildMongoQuery = async (filters: IGameQuery) => {
    const mongoQuery: any = {};

    if (filters.genre) {
      // Escape special regex characters to prevent syntax errors from user input
      const escapedGenre = filters.genre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      mongoQuery.genre = { $regex: new RegExp(escapedGenre, 'i') };
    }

    if (filters.platform) {
      const platformId = await this.platformRepo.getIdByName(filters.platform);
      // If the platform name doesn't exist, use a dummy ID to ensure 0 results are returned
      mongoQuery.platform = platformId || new mongoose.Types.ObjectId();
    }

    if (filters.publisher) {
      const publisherId = await this.publisherRepo.getIdByName(
        filters.publisher
      );
      mongoQuery.publisher = publisherId || new mongoose.Types.ObjectId();
    }

    return mongoQuery;
  };
}

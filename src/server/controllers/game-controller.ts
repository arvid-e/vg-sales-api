import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IUpdateGamePayload } from '../interfaces/game/game.js';
import type { UserRequest } from '../interfaces/user/user.js';
import { createPaginationLinks } from '../middlewares/create-pagination-links.js';
import { catchAsync } from '../utils/catch-async.js';

interface GameParams {
  id: string;
}

/**
 * Controller handling all Game-related HTTP requests.
 * Orchestrates communication between the client and GameService.
 */
export class GameController {
  constructor(private gameService: IGameService) {}

  /**
   * Retrieves a paginated list of games with optional filtering.
   * Supports filtering by platform, publisher, and genre.
   */
  public getAllGames = catchAsync(async (req: UserRequest, res: Response) => {
    // 1. Extract and normalize query parameters
    const { page, limit, platform, publisher, genre } = req.query;

    const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;

    const platformName = typeof platform === 'string' ? platform : undefined;
    const publisherName = typeof publisher === 'string' ? publisher : undefined;
    const genreName = typeof genre === 'string' ? genre : undefined;

    // 2. Fetch data from service
    const { games, total } = await this.gameService.getAllGames({
      page: parsedPage,
      limit: parsedLimit,
      query: {
        platform: platformName,
        publisher: publisherName,
        genre: genreName,
      },
    });

    // 3. Prepare response metadata
    const totalPages = Math.ceil(total / parsedLimit);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const hasUser = !!req.user;

    const gamesWithLinks = games.map((game) => {
      const gameJson = game.toJSON();
      return {
        ...gameJson,
        links: this.createLinks(req, gameJson.gameId),
      };
    });

    const paginationLinks = createPaginationLinks({
      baseUrl,
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      hasUser,
    });

    return res.status(200).json({
      status: 'success',
      count: gamesWithLinks.length,
      total,
      totalPages,
      currentPage: parsedPage,
      data: gamesWithLinks,
      links: paginationLinks,
    });
  });

  /**
   * Fetches a single game by its ID.
   * @throws {NotFoundError} If no game matches the provided ID.
   */
  public getGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;
    const game = await this.gameService.getGameById(id);

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...game.toJSON(),
        links: this.createLinks(req, id),
      },
    });
  });

  /**
   * Updates an existing game record.
   * @throws {NotFoundError} If the game to update does not exist.
   */
  public updateGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;
    const updateFields: IUpdateGamePayload = req.body;

    const game = await this.gameService.updateGame({
      ...updateFields,
      _id: id,
    });

    if (game == null) {
      throw new NotFoundError('Game');
    }

    return res.status(200).json({
      status: 'success',
      message: 'Game updated successfully',
      data: {
        ...game.toJSON(),
        links: this.createLinks(req, id),
      },
    });
  });

  /**
   * Deletes a game record from the database.
   */
  public deleteGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;
    await this.gameService.deleteGameById(id);

    return res.status(200).json({
      status: 'success',
      message: 'Game deleted successfully',
      data: {
        links: this.createLinks(req, id),
      },
    });
  });

  /**
   * Creates a new game resource.
   */
  public createGame = catchAsync(async (req: UserRequest, res: Response) => {
    const game = await this.gameService.createGame(req.body);

    if (game == null || game._id == null) {
      throw new Error('Internal error');
    }

    return res.status(201).json({
      status: 'success',
      data: {
        ...game.toJSON(),
        links: this.createLinks(req, game._id.toString()),
      },
    });
  });

  /**
   * Generates HATEOAS links based on resource ID and user authorization status.
   */
  private createLinks(req: UserRequest, gameId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${gameId}` },
      { rel: 'all-games', method: 'GET', href: `${baseUrl}` },
    ];

    // Only expose mutation links if the user is authenticated
    if (req.user) {
      links.push(
        { rel: 'update', method: 'PUT', href: `${baseUrl}/${gameId}` },
        { rel: 'delete', method: 'DELETE', href: `${baseUrl}/${gameId}` }
      );
    }

    return links;
  }
}

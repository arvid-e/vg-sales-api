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

export class GameController {
  constructor(private gameService: IGameService) {}

  public getAllGames = catchAsync(async (req: UserRequest, res: Response) => {
    const { page, limit, platform, publisher, genre } = req.query;

    const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;
    const platformName = typeof platform === 'string' ? platform : undefined;
    const publisherName = typeof publisher === 'string' ? publisher : undefined;
    const genreName = typeof genre === 'string' ? genre : undefined;

    const { games, total } = await this.gameService.getAllGames({
      page: parsedPage,
      limit: parsedLimit,
      query: {
        platform: platformName,
        publisher: publisherName,
        genre: genreName,
      },
    });

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

  public updateGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;

    const updateFields: IUpdateGamePayload = req.body;
    const gameUpdatePayload: IUpdateGamePayload = {
      ...updateFields,
      _id: id,
    };

    const game = await this.gameService.updateGame(gameUpdatePayload);

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

  private createLinks(req: UserRequest, gameId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const links = [
      { rel: 'self', method: 'GET', href: `${baseUrl}/${gameId}` },
      { rel: 'all-games', method: 'GET', href: `${baseUrl}` },
    ];

    if (req.user) {
      links.push(
        { rel: 'update', method: 'PUT', href: `${baseUrl}/${gameId}` },
        { rel: 'delete', method: 'DELETE', href: `${baseUrl}/${gameId}` }
      );
    }

    return links;
  }
}

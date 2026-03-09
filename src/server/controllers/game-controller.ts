import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IUpdateGamePayload } from '../interfaces/game/game.js';
import type { UserRequest } from '../interfaces/user/user.js';
import { catchAsync } from '../utils/catch-async.js';

interface GameParams {
  id: string;
}

export class GameController {
  constructor(private gameService: IGameService) {}

  public getAllGames = catchAsync(async (req: UserRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { games, total } = await this.gameService.getAllGames(page, limit);

    const totalPages = Math.ceil(total / limit);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

    const gamesWithLinks = games.map((game) => ({
      ...game.toObject(),
      links: this.createLinks(req, game._id.toString()),
    }));

    const links: any[] = [
      { rel: 'self', href: `${baseUrl}?page=${page}&limit=${limit}` },
      { rel: 'first', href: `${baseUrl}?page=1&limit=${limit}` },
      { rel: 'last', href: `${baseUrl}?page=${totalPages}&limit=${limit}` },
    ];

    if (page < totalPages) {
      links.push({
        rel: 'next',
        href: `${baseUrl}?page=${page + 1}&limit=${limit}`,
      });
    }

    if (page > 1) {
      links.push({
        rel: 'prev',
        href: `${baseUrl}?page=${page - 1}&limit=${limit}`,
      });
    }

    if (req.user) {
      links.push({ rel: 'create', method: 'POST', href: baseUrl });
    }

    return res.status(200).json({
      status: 'success',
      count: gamesWithLinks.length,
      total,
      totalPages,
      currentPage: page,
      data: gamesWithLinks,
      links, 
    });
  });

  public getGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;

    const game = await this.gameService.getGameById(id);

    if (!game) {
      throw new NotFoundError('Game');
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...game.toObject(),
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

    if (!game) {
      throw new NotFoundError('Game');
    }

    return res.status(200).json({
      status: 'success',
      message: 'Game updated successfully',
      data: {
        ...game.toObject(),
        links: this.createLinks(req, id),
      },
    });
  });

  public deleteGame = catchAsync(async (req: Request<any>, res: Response) => {
    const { id } = req.params as GameParams;

    await this.gameService.deleteGameById(id);

    return res.status(200).json({
      status: 'success',
      data: {
        links: this.createLinks(req, id),
      },
    });
  });

  public createGame = catchAsync(async (req: UserRequest, res: Response) => {
    const game = await this.gameService.createGame(req.body);

    if (!game || !game._id) {
      throw new Error('Internal error');
    }

    return res.status(201).json({
      status: 'success',
      data: {
        ...game.toObject(),
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

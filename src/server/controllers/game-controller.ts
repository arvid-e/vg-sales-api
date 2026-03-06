import type { Request, Response } from 'express';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IGame, IUpdateGamePayload } from '../interfaces/game/game.js';
import { catchAsync } from '../utils/catch-async.js';

export class GameController {
  constructor(private gameService: IGameService) {}

  public getAllGames = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const game = await this.gameService.getAllGames(page, limit);

    return res.status(200).json({
      status: 'success',
      data: game,
    });
  };

  public getGameById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
    }

    const game = await this.gameService.getGameById(id);

    return res.status(200).json({
      status: 'success',
      data: game,
    });
  });

  public updateGame = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
    }

    const updateFields: IUpdateGamePayload = req.body;

    const gameUpdatePayload: IUpdateGamePayload = {
      ...updateFields,
      _id: id,
    };

    const wasUpdated = await this.gameService.updateGame(gameUpdatePayload);

    if (wasUpdated) {
      return res.status(200).json({
        status: 'success',
        message: 'Game updated successfully',
      });
    }

    return res.status(404).json({
      status: 'failed',
      message: 'Game was not found or could not be updated',
    });
  };

  public deleteGameById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' });
    }

    const game = await this.gameService.deleteGameById(id);

    if (!game) {
      return res.status(404).json({
        status: 'failed',
        message: 'Game not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Game deleted',
    });
  };

  public addGame = async (req: Request, res: Response) => {
    const { rank, name, platform, publisher, year, genre, sales } = req.body;

    const gameProps: IGame = {
      rank,
      name,
      platform,
      publisher,
      year,
      genre,
      sales,
    };

    const game = await this.gameService.addGame(gameProps);

    return res.status(200).json({
      status: 'success',
      message: 'Game added',
      data: game,
    });
  };
}

import type { Request, Response } from 'express';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IGame, IUpdateGamePayload } from '../interfaces/game/game.js';
import { catchAsync } from '../utils/catch-async.js';

interface GameParams {
  id: string;
}

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

  public getGameById = catchAsync(
    async (req: Request<GameParams>, res: Response) => {
      const { id } = req.params;

      const game = await this.gameService.getGameById(id);

      return res.status(200).json({
        status: 'success',
        data: game,
      });
    }
  );

  public updateGame = catchAsync(
    async (req: Request<GameParams>, res: Response) => {
      const { id } = req.params;

      const updateFields: IUpdateGamePayload = req.body;
      const gameUpdatePayload: IUpdateGamePayload = {
        ...updateFields,
        _id: id,
      };

      const updatedGame = await this.gameService.updateGame(gameUpdatePayload);

      return res.status(200).json({
        status: 'success',
        message: 'Game updated successfully',
        data: updatedGame,
      });
    }
  );

  public deleteGameById = catchAsync(
    async (req: Request<GameParams>, res: Response) => {
      const { id } = req.params;

      await this.gameService.deleteGameById(id);

      return res.status(204).json({
        status: 'success',
        message: 'Game deleted successfully',
      });
    }
  );

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

import type { Request, Response } from 'express'
import type { IGameService } from '../interfaces/game-service.js'

export class GameController {
  constructor(private gameService: IGameService) {}

  public getAllGames = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const game = await this.gameService.getAllGames(page, limit)

    return res.status(200).json({
      status: 'success',
      data: game,
    })
  }

  public getGameById = async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' })
    }

    const game = await this.gameService.getGameById(id)

    return res.status(200).json({
      status: 'success',
      data: game,
    })
  }

  public deleteGameById = async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string') {
      return res.status(400).json({ status: 'failed', message: 'Invalid ID' })
    }

    const game = await this.gameService.deleteGameById(id)

    if (!game) {
      return res.status(404).json({
        status: 'failed',
        message: "Game not found",
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Game deleted',
    })
  }
}

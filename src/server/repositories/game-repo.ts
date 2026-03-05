import type { IGameRepo } from '../interfaces/game-repo.js'
import type { IGameDocument } from '../interfaces/game.js'
import GamesModel from '../models/GamesModel.js'

export class GameRepo implements IGameRepo {
  constructor(private gameModel: typeof GamesModel) {}

  public getAllGames = async (
    page: number = 1,
    limit: number = 20
  ): Promise<IGameDocument[]> => {
    const skip = (page - 1) * limit

    return await GamesModel.find().sort({ rank: 1 }).skip(skip).limit(limit)
  }

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    const game = await this.gameModel.findById(id)

    return game
  }
}

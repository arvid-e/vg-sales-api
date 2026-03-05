import type { IGameRepo } from '../interfaces/game/game-repo.js'
import type { IGame, IGameDocument } from '../interfaces/game/game.js'
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

  public deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameModel.deleteOne({ _id: id })
    return deleted.deletedCount > 0
  }

  public addGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameModel.create(game);
  }
}

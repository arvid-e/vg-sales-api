import type { IGameRepo } from '../interfaces/game-repo.js'
import type { IGameService } from '../interfaces/game-service.js'
import type { IGameDocument } from '../interfaces/game.js'

export class GameService implements IGameService {
  constructor(private gameRepo: IGameRepo) {}

  public getAllGames = async (
    page: number,
    limit: number
  ): Promise<IGameDocument[]> => {
    return this.gameRepo.getAllGames(page, limit)
  }

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    return this.gameRepo.getGameById(id)
  }

  public deleteGameById = async (id: string): Promise<boolean> => {
    return this.gameRepo.deleteGameById(id)
  }
}

import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type { IGameService } from '../interfaces/game/game-service.js';
import type { IGame, IGameDocument, IUpdateGamePayload } from '../interfaces/game/game.js';

export class GameService implements IGameService {
  constructor(private gameRepo: IGameRepo) {}

  public getAllGames = async (
    page: number,
    limit: number
  ): Promise<IGameDocument[]> => {
    return this.gameRepo.getAllGames(page, limit);
  };

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    return this.gameRepo.getGameById(id);
  };

  public updateGame = async (updateGamePayload: IUpdateGamePayload): Promise<boolean> => {
    return this.gameRepo.updateGame(updateGamePayload);
  }

  public deleteGameById = async (id: string): Promise<boolean> => {
    return this.gameRepo.deleteGameById(id);
  };

  public addGame = async (game: IGame): Promise<IGameDocument | null> => {
    return this.gameRepo.addGame(game);
  };
}

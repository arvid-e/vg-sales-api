import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type {
  IGame,
  IGameDocument,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import GamesModel from '../models/GamesModel.js';

export class GameRepo implements IGameRepo {
  constructor(private gameModel: typeof GamesModel) {}

  public getAllGames = async (
    page: number = 1,
    limit: number = 20,
    query: any
  ): Promise<{ games: IGameDocument[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      this.gameModel
        .find(query)
        .populate('platform')
        .populate('publisher')
        .sort({ rank: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.gameModel.countDocuments(),
    ]);

    return { games, total };
  };

  public getGameById = async (id: string): Promise<IGameDocument | null> => {
    return await this.gameModel.findById(id);
  };

  public updateGame = async (
    updatedGameData: IUpdateGamePayload
  ): Promise<IGameDocument | null> => {
    const { _id, ...updateFields } = updatedGameData;

    return await this.gameModel.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
  };

  public deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameModel.deleteOne({ _id: id });
    return deleted.deletedCount > 0;
  };

  public createGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameModel.create(game);
  };
}

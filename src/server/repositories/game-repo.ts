import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type {
  IGame,
  IGameDocument,
  IGameSalesGroups,
  IGroupedGameSales,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import GamesModel from '../models/GamesModel.js';

export class GameRepo implements IGameRepo {
  constructor(private gameModel: typeof GamesModel) {}

  getAllGames = async ({
    page = 1,
    limit = 20,
    query = {},
  }): Promise<{ games: IGameDocument[]; total: number }> => {
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
      this.gameModel.countDocuments(query),
    ]);

    return { games, total };
  };

  getGameById = async (id: string): Promise<IGameDocument | null> => {
    return await this.gameModel
      .findById(id)
      .populate('platform')
      .populate('publisher')
      .exec();
  };

  updateGame = async (
    updatedGameData: IUpdateGamePayload
  ): Promise<IGameDocument | null> => {
    const { _id, ...updateFields } = updatedGameData;

    return await this.gameModel
      .findOneAndUpdate(
        { _id },
        { $set: updateFields },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      )
      .populate('platform')
      .populate('publisher')
      .exec();
  };

  deleteGameById = async (id: string): Promise<boolean> => {
    const deleted = await this.gameModel.deleteOne({ _id: id });
    return deleted.deletedCount > 0;
  };

  createGame = async (game: IGame): Promise<IGameDocument | null> => {
    return await this.gameModel.create(game);
  };

  getStats = async (
    groupBy: keyof IGameSalesGroups
  ): Promise<IGroupedGameSales[]> => {
    const collectionMap: Record<string, string> = {
      publisher: 'publishers',
      platform: 'platforms',
    };

    const targetCollection = collectionMap[groupBy];

    // Initial Grouping 
    const pipeline: any[] = [
      {
        $group: {
          _id: `$${groupBy}`,
          totalGlobalSales: { $sum: '$sales.global' },
          gameCount: { $sum: 1 },
        },
      },
      { $sort: { totalGlobalSales: -1 } },
      { $limit: 15 },
    ];

    // Join only if it's a reference ID
    if (targetCollection) {
      pipeline.push(
        {
          $lookup: {
            from: targetCollection,
            localField: '_id',
            foreignField: '_id',
            as: 'details',
          },
        },
        { $unwind: '$details' },
        {
          $project: {
            _id: 0,
            name: '$details.name',
            sales: { $round: ['$totalGlobalSales', 2] },
            count: '$gameCount',
          },
        }
      );
    } else {
      // Simple projection for plain strings like genre
      pipeline.push({
        $project: {
          _id: 0,
          name: '$_id',
          sales: { $round: ['$totalGlobalSales', 2] },
          count: '$gameCount',
        },
      });
    }

    return await this.gameModel.aggregate<IGroupedGameSales>(pipeline);
  };
}

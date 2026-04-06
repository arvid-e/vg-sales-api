import cosineSimilarity from 'compute-cosine-similarity';
import type { IAIService } from '../interfaces/ai/ai-service.js';
import type { IGameRepo } from '../interfaces/game/game-repo.js';
import type {
  IGame,
  IGameDocument,
  IGameMongoFilter,
  IGameSalesGroups,
  IGroupedGameSales,
  IUpdateGamePayload,
} from '../interfaces/game/game.js';
import GamesModel from '../models/GamesModel.js';

export class GameRepo implements IGameRepo {
  constructor(
    private gameModel: typeof GamesModel,
    private readonly aiService: IAIService
  ) {}

  getAllGames = async (
    filter: IGameMongoFilter = {},
    page: number = 1,
    limit: number = 1
  ): Promise<{ games: IGame[]; total: number }> => {
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      this.gameModel
        .find(filter as any)
        .populate('platform')
        .populate('publisher')
        .lean()
        .sort({ rank: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.gameModel.countDocuments(filter as any),
    ]);

    return { games, total };
  };

  getGameById = async (id: string): Promise<IGame | null> => {
    return await this.gameModel
      .findById(id)
      .populate('platform')
      .populate('publisher')
      .lean()
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

  /**
   * Aggregates the top 15 sales by specified grouping. (Genre, platform, publisher)
   */
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
          na_sales: { $sum: '$sales.na' },
          eu_sales: { $sum: '$sales.eu' },
          jp_sales: { $sum: '$sales.jp' },
          other_sales: { $sum: '$sales.other' },
          total_sales: { $sum: '$sales.global' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total_sales: -1 } },
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
            na: { $round: ['$na_sales', 2] },
            eu: { $round: ['$eu_sales', 2] },
            jp: { $round: ['$jp_sales', 2] },
            other: { $round: ['$other_sales', 2] },
            total: { $round: ['$total_sales', 2] },
            count: '$count',
          },
        }
      );
    } else {
      // Simple projection for plain strings like genre
      pipeline.push({
        $project: {
          _id: 0,
          name: '$_id',
          na: { $round: ['$na_sales', 2] },
          eu: { $round: ['$eu_sales', 2] },
          jp: { $round: ['$jp_sales', 2] },
          other: { $round: ['$other_sales', 2] },
          total: { $round: ['$total_sales', 2] },
          count: '$count',
        },
      });
    }

    return await this.gameModel.aggregate<IGroupedGameSales>(pipeline);
  };

  /**
   * Search all games using semantic search and gives results based on a similarity score.
   */
  async searchGamesLocally(query: string): Promise<IGame[]> {
    // Turn the user's string into a vector
    const queryVector = await this.aiService.generateVector(query);

    // Get all games that have an embedding
    const games = await this.gameModel
      .find({
        title_embedding: { $exists: true, $not: { $size: 0 } },
      })
      .lean();

    // Map through and calculate similarity score
    const scoredGames = games.map((game) => ({
      ...game,
      // Compare the Query Vector to the Game's Vector
      score: cosineSimilarity(queryVector, game.title_embedding) || 0,
    }));

    // Sort by highest score and take the top 10
    return scoredGames.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}

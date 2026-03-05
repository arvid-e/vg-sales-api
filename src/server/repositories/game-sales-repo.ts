import type { IGameRepo } from "../interfaces/game-repo.js";
import type { IGameDocument } from "../interfaces/game.js";
import GamesModel from "../models/GamesModel.js";

export class GameSalesRepo implements IGameRepo {
  public getGameById = async (
    id: string,
  ): Promise<IGameDocument | null> => {
    const game = await GamesModel.findById(id);

    return game;
  };
}

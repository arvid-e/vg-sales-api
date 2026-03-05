import type { IGameRepo } from "../interfaces/game-repo.js";
import type { IGameDocument } from "../interfaces/game.js";
import GamesModel from "../models/GamesModel.js";

export class GameRepo implements IGameRepo {
  constructor(private gameModel: typeof GamesModel){}

  public getGameById = async (
    id: string,
  ): Promise<IGameDocument | null> => {
    const game = await this.gameModel.findById(id);

    return game;
  };
}

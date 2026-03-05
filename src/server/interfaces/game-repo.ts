import type { IGameDocument } from "./game.js";

export interface IGameRepo {
  getAllGames(page: number, limit: number): Promise<IGameDocument[]>;
  getGameById(id: string): Promise<IGameDocument | null>;
}

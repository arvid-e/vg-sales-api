import type { IGameDocument } from "./game.js";

export interface IGameRepo {
  getGameById(id: string): Promise<IGameDocument | null>;
}

import type { IGameDocument } from "./game.js";

export interface IGameService {
    getGameById(id: string): Promise<IGameDocument | null>;
}
import type { Request, Response } from "express";
import type { IGameService } from "../interfaces/game-service.js";

export class GameController {
  constructor(private gameService: IGameService) {}

  public getGameById = async (req: Request, res: Response) => {

    const id = req.body.id;

    const game = this.gameService.getGameById(id);
    
    res.status(200).json({
      status: "success",
      data: game,
    });
  };
}

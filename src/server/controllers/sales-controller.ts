import type { Request, Response } from 'express';


export class SalesController {
    public testApi = async (req: Request, res: Response) => {

    res.status(200).json({
      status: 'success',
      message: 'API route successfull!',
    });
  };
}
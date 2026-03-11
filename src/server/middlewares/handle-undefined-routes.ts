import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/not-found-error.js';

export const handleUndefinedRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(req.originalUrl));
};

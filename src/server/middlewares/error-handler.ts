import type { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 500;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid path ${err.path}: ${err.value}. This ID is not a valid MongoDB ObjectId.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;

    const messages = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data: ${messages.join('. ')}`;
  }

  return res.status(statusCode).json({
    error: message,
  });
};

import type { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose Bad ID
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Mongoose Schema Validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data: ${messages.join('. ')}`;
  }

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Username is already taken';
  }

  if (statusCode === 500) console.error('ERROR:', err);

  return res.status(statusCode).json({
    status: 'error',
    error: message, 
  });
};

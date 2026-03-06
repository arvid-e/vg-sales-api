import type { Request, Response, NextFunction } from 'express'

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (err.name === 'CastError') {
    err.statusCode = 400
    err.status = 'fail'
    err.message = `Invalid path ${err.path}: ${err.value}. This ID is not a valid MongoDB ObjectId.`
  }

  if (err.name === 'ValidationError') {
    err.statusCode = 400
    err.status = 'fail'
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
}
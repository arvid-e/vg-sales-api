import type { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Checks if the server is running with a DB connection.
 */
export const getHealth = (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;

  if (isConnected) {
    return res.status(200).send('OK');
  }

  return res.status(503).send('Database Disconnected');
};

/**
 * Message for API root.
 */
export const getRoot = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Video Game Sales API',
    version: 'v1.0.0',
    documentation: 'https://cu3040.camp.lnu.se/api-docs',
    status: 'Running',
  });
};

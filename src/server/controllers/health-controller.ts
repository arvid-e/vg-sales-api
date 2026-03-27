import type { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getHealth = (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;

  if (isConnected) {
    return res.status(200).send('OK');
  }

  return res.status(503).send('Database Disconnected');
};

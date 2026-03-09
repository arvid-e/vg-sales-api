import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRequest } from '../interfaces/user/user.js';

export const authorize = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'No authorization token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};

export const identify = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = decoded;

    next();
  } catch (error) {
    next();
  }
};

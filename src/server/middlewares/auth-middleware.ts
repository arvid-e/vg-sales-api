import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { UserRequest } from '../interfaces/user/user.js';
import { AuthError } from '../errors/auth-error.js';

export const authorize = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.JWT_SECRET) {
      return next(
        new Error('JWT configuration is missing in environment variables')
      );
    }

    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AuthError('No authorization token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    return next(new AuthError('Invalid or expired authorization token'));
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

export const generateToken = async (userId: string): Promise<string> => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN;

    if (secret == null || expires == null) {
      throw new Error('JWT configuration is missing in environment variables');
    }

    const jwtOptions: SignOptions = {
      expiresIn: expires as any,
    };

    return jwt.sign({ id: userId }, secret, jwtOptions);
  };

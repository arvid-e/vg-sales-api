import type { NextFunction, Response } from 'express';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/auth-error.js';
import type { UserRequest } from '../interfaces/requests/request-types.js';

/**
 * Mandatory Authentication.
 * Blocks requests that do not provide a valid JWT.
 * @throws {AuthError} If token is missing, invalid, or expired.
 */
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

/**
 * Optional Identification.
 * Attempts to identify a user if a token is present, but allows the request
 * to proceed even if the user is unauthenticated (Anonymous Access).
 */
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

/**
 * Generates a signed JWT for a specific user ID.
 * Uses environment configurations for secret key and expiration duration.
 */
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

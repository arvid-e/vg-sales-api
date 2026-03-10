import { BaseError } from './base-error.js';

export class AuthError extends BaseError {
  constructor(message: string) {
    super(`${message}`, 401);
  }
}

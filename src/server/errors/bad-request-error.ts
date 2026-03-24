import { BaseError } from './base-error.js';

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(`Invalid input data: ${message}`, 400);
  }
}

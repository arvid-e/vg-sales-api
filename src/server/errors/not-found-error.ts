import { BaseError } from './base-error.js';

export class NotFoundError extends BaseError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

import { AppError } from "./app-error.js";

export class NotFoundError extends AppError {  
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}
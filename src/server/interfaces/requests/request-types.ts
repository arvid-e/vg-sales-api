import type { Request } from 'express';

export interface IdParam {
  id: string;
}

export interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

export type UserRequestWithId = UserRequest & { params: IdParam };

import type { IAuthResponse, ICredentials, IUserDocument } from './user.js';

export interface IUserService {
  create(credentials: ICredentials): Promise<IAuthResponse>;
  delete(id: string): Promise<boolean>;
  login(credentials: ICredentials): Promise<IAuthResponse>;
  getUser(id: string): Promise<IUserDocument | null>;
}

import type { IAuthResponse, ICredentials } from './user.js';

export interface IUserService {
  createUser(credentials: ICredentials): Promise<IAuthResponse>;
  deleteUser(id: string): Promise<boolean>;
  loginUser(credentials: ICredentials): Promise<IAuthResponse>;
}

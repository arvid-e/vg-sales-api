import type { IAuthResponse, IUser, IUserDocument } from './user.js';

export interface IUserService {
  createUser(user: IUser): Promise<IUserDocument | null>;
  deleteUser(id: string): Promise<boolean>;
  loginUser(authPayload: IUser): Promise<IAuthResponse>;
}

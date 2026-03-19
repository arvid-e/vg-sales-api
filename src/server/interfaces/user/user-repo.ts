import type { IUser, IUserDocument } from './user.js';

export interface IUserRepo {
  createUser(userPayload: IUser): Promise<IUserDocument | null>;
  deleteUserById(id: string): Promise<boolean>;
  findUserByUsername(username: string): Promise<IUserDocument | null>;
}

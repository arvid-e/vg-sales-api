import type { IUser, IUserDocument } from './user.js';

export interface IUserRepo {
  create(userPayload: IUser): Promise<IUserDocument | null>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<IUserDocument | null>;
  findByUsername(username: string): Promise<IUserDocument | null>;
}

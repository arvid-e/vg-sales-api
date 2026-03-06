import type { IUser, IUserDocument } from "./user.js";

export interface IUserService {
  createUser(user: IUser): Promise<IUserDocument | null>;
}
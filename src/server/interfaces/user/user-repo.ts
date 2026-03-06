import type { IUser, IUserDocument } from "./user.js";

export interface IUserRepo {
  createUser(userPayload: IUser): Promise<IUserDocument | null>;
}
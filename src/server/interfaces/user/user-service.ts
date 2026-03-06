import type { IAuthResponse, IUser, IUserDocument } from "./user.js";

export interface IUserService {
  createUser(user: IUser): Promise<IUserDocument | null>;
  loginUser(authPayload: IUser): Promise<IAuthResponse>;
}
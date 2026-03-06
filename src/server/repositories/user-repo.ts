import type { IUserRepo } from "../interfaces/user/user-repo.js";
import type { IUser, IUserDocument } from "../interfaces/user/user.js";
import UserModel from "../models/UserModel.js";

export class UserRepo implements IUserRepo{
  constructor(private userModel: typeof UserModel) {}

  public createUser = async (user: IUser): Promise<IUserDocument | null> => {
      return await this.userModel.create(user);
  }
}
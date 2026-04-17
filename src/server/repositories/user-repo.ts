import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUser, IUserDocument } from '../interfaces/user/user.js';
import UserModel from '../models/UserModel.js';

export class UserRepo implements IUserRepo {
  constructor(private userModel: typeof UserModel) {}

  create = async (user: IUser): Promise<IUserDocument | null> => {
    return await this.userModel.create(user);
  };

  update = async (user: IUser): Promise<IUserDocument | null> => {
    return await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true, runValidators: true })
      .exec();
  };

  deleteById = async (id: string): Promise<boolean> => {
    const deleted = await this.userModel.deleteOne({ _id: id });
    return deleted.deletedCount > 0;
  };

  findById = async (id: string): Promise<IUserDocument | null> => {
    return await this.userModel.findById(id);
  };

  findByGithubId = async (githubId: number): Promise<IUserDocument | null> => {
    return await this.userModel.findOne({ githubId }).exec();
  };
}

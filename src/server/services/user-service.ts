import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import type { IUser, IUserDocument } from '../interfaces/user/user.js';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepo) {}

  createUser = async (user: IUser): Promise<IUserDocument | null> => {
    return await this.userRepo.createUser(user);
  };
}

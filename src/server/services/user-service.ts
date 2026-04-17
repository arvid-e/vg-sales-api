import { NotFoundError } from '../errors/not-found-error.js';
import type { IGitHubProfile } from '../interfaces/user/profile.js';
import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import type {
  IUser,
  IUserDocument,
} from '../interfaces/user/user.js';

/**
 * Service for managing User authentication and account lifecycle.
 * Handles sensitive data processing including password hashing and JWT generation.
 */
export class UserService implements IUserService {
  constructor(private userRepo: IUserRepo) {}

  async syncWithProvider(profile: IGitHubProfile): Promise<IUserDocument> {
    const existingUser = await this.userRepo.findByGithubId(profile.id);

    const userPayload: IUser = {
      githubId: profile.id,
      username: profile.username,
      avatarUrl: profile.avatar_url,
      role: 'user',
    };

    let user: IUserDocument | null;

    if (existingUser) {
      user = await this.userRepo.update({
        ...userPayload,
        _id: existingUser._id,
      });
    } else {
      user = await this.userRepo.create(userPayload);
    }

    if (!user) {
      throw new Error(`Failed to sync user with GitHub ID: ${profile.id}`);
    }

    return user;
  }

  /**
   * Permanently removes a user account.
   * A user can only delete their own account.
   * @throws {NotFoundError} If the user ID does not exist.
   */
  delete = async (userId: string): Promise<boolean> => {
    const userDeleted = await this.userRepo.deleteById(userId);

    if (!userDeleted) {
      throw new NotFoundError('User');
    }

    return userDeleted;
  };

  /**
   * Get single user by userId.
   */
  getById = async (id: string): Promise<IUserDocument | null> => {
    const user = this.userRepo.findById(id);

    if (user == null) {
      throw new NotFoundError('User');
    }

    return user;
  };
}

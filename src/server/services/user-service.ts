import bcrypt from 'bcryptjs';
import { AuthError } from '../errors/auth-error.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import type { IAuthResponse, ICredentials } from '../interfaces/user/user.js';
import { generateToken } from '../middlewares/auth-middleware.js';

/**
 * Service for managing User authentication and account lifecycle.
 * Handles sensitive data processing including password hashing and JWT generation.
 */
export class UserService implements IUserService {
  constructor(private userRepo: IUserRepo) {}

  /**
   * Registers a new user after validating password strength and hashing credentials.
   * @throws {BadRequestError} If the password does not meet requirements.
   * @throws {BadRequestError} If the username does not meet requirements.
   */
  createUser = async (credentials: ICredentials): Promise<IAuthResponse> => {
    if (credentials.password == null || credentials.password.length < 10) {
      throw new BadRequestError('Password must be at least 10 characters long');
    }

    if (credentials.username == null || credentials.password.length < 3) {
      throw new BadRequestError('Username must be at least 3 characters long');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 12);
    const userPayload = { ...credentials, password: hashedPassword };

    const user = await this.userRepo.createUser(userPayload);

    if (user == null) {
      throw new Error('User could not be created');
    }
    const userId = user._id.toString();
    const token = await generateToken(user._id.toString());

    return { user, token, userId };
  };

  /**
   * Permanently removes a user account.
   * A user can only delete their own account.
   * @throws {NotFoundError} If the user ID does not exist.
   */
  deleteUser = async (userId: string): Promise<boolean> => {
    const userDeleted = await this.userRepo.deleteUserById(userId);

    if (!userDeleted) {
      throw new NotFoundError('User');
    }

    return userDeleted;
  };

  /**
   * Validates user credentials and issues an authentication token.
   * @throws {AuthError} For any failure to prevent account enumeration attacks.
   */
  loginUser = async (credentials: ICredentials): Promise<IAuthResponse> => {
    const { username, password } = credentials;

    const user = await this.userRepo.findUserByUsername(username);

    if (user == null) {
      throw new AuthError('Invalid username or password');
    }

    const savedPassword = user.password;
    const match = await bcrypt.compare(password, savedPassword);

    if (!match) {
      throw new AuthError('Invalid username or password');
    }
    const userId = user._id.toString();
    const token = await generateToken(user._id.toString());

    return { user, token, userId };
  };
}

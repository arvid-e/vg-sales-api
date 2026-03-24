import bcrypt from 'bcryptjs';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/auth-error.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import type { IAuthResponse, ICredentials } from '../interfaces/user/user.js';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepo) {}

  createUser = async (credentials: ICredentials): Promise<IAuthResponse> => {
    if (credentials.password == null || credentials.password.length < 10) {
      throw new BadRequestError('Password must be at least 10 characters long');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 12);
    const userPayload = { ...credentials, password: hashedPassword };

    const user = await this.userRepo.createUser(userPayload);

    if (user == null) {
      throw new Error('User could not be created');
    }

    const token = await this.generateToken(user._id.toString());

    return { user, token };
  };

  deleteUser = async (userId: string): Promise<boolean> => {
    const userDeleted = await this.userRepo.deleteUserById(userId);

    if (!userDeleted) {
      throw new NotFoundError('User');
    }

    return userDeleted;
  };

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

    const token = await this.generateToken(user._id.toString());

    return { user, token };
  };

  private generateToken = async (userId: string): Promise<string> => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN;

    if (secret == null || expires == null) {
      throw new Error('JWT configuration is missing in environment variables');
    }

    const jwtOptions: SignOptions = {
      expiresIn: expires as any,
    };

    return jwt.sign({ id: userId }, secret, jwtOptions);
  };
}

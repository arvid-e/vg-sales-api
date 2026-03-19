import bcrypt from 'bcryptjs';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/auth-error.js';
import type { IUserRepo } from '../interfaces/user/user-repo.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import type {
  IAuthResponse,
  IUser,
  IUserDocument,
} from '../interfaces/user/user.js';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepo) {}

  createUser = async (user: IUser): Promise<IUserDocument | null> => {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = { ...user, password: hashedPassword };

    return await this.userRepo.createUser(newUser);
  };

  loginUser = async (authPayload: IUser): Promise<IAuthResponse> => {
    const { username, password } = authPayload;

    const user = await this.userRepo.findUserByUsername(username);

    if (!user) {
      throw new AuthError('Invalid username or password');
    }

    const savedPassword = user.password;
    const match = await bcrypt.compare(password, savedPassword);

    if (!match) {
      throw new AuthError('Invalid username or password');
    }

    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN;

    if (!secret || !expires) {
      throw new Error('JWT configuration is missing in environment variables');
    }

    const jwtOptions: SignOptions = {
      expiresIn: expires as any,
    };
    const token = jwt.sign({ id: user._id }, secret, jwtOptions);

    return {
      user,
      token,
    };
  };
}

import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AuthError } from '../errors/auth-error.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import type {
  UserRequest,
  UserRequestWithId,
} from '../interfaces/requests/request-types.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import { catchAsync } from '../utils/catch-async.js';
import { generateToken } from '../middlewares/auth-middleware.js';

/**
 * Controller handling all User related HTTP requests.
 * Orchestrates communication between the client and UserService.
 */
export class UserController {
  constructor(private userService: IUserService) {}

  syncUser = catchAsync(async (req: Request, res: Response) => {
    const { id, login, avatar_url, email } = req.body;

    if (!id) {
      throw new BadRequestError('GitHub ID is required for syncing.');
    }

    const user = await this.userService.syncWithProvider({
      id,
      login,
      avatar_url,
      email,
    });

    res.status(200).json(user);
  });

  /**
   * Creates a test user used in testing the api.
   */
  createTestUser = catchAsync(async (req: Request, res: Response) => {
    const { id, login, avatar_url, email } = req.body;

    if (!id) {
      throw new BadRequestError('ID is required for test user.');
    }

    const testUser = await this.userService.create({
      id,
      login,
      avatar_url,
      email,
    });

    const token = await generateToken(testUser._id.toString());

    return res.status(200).json({
      testUser,
      token,
    });
  });

  /**
   * Deletes the users account under a protected route.
   */
  delete = catchAsync(async (req: UserRequestWithId, res: Response) => {
    const { id } = req.body;

    if (id == null || !isValidObjectId(id)) {
      throw new BadRequestError('Invalid ID');
    }

    await this.userService.delete(id);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = [
      { rel: 'all-games', method: 'GET', href: `${baseUrl}/games` },
    ];

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      links,
    });
  });

  /**
   * Logs out the user by clearing the session cookie.
   */
  logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('app_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  });

  /**
   * Checks if the user is authenticated.
   */
  getMe = catchAsync(async (req: UserRequest, res: Response) => {
    if (!req.user) {
      throw new AuthError('Not authenticated');
    }

    const id = req.user?.id;
    const user = await this.userService.getById(id);

    if (!user) {
      throw new NotFoundError('User');
    }
    return res.status(200).json({
      id: user._id,
      username: user.username,
    });
  });

  /**
   * Generates HATEOAS links based on user ID.
   */
  private createLinks(req: Request, userId: string) {
    const host = `${req.protocol}://${req.get('host')}`;

    return [
      {
        rel: 'delete-user',
        method: 'DELETE',
        href: `${host}/users/${userId}`,
      },
      {
        rel: 'all-games',
        method: 'GET',
        href: `${host}/games`,
      },
      {
        rel: 'all-platforms',
        method: 'GET',
        href: `${host}/platforms`,
      },
      {
        rel: 'all-publishers',
        method: 'GET',
        href: `${host}/publishers`,
      },
    ];
  }
}

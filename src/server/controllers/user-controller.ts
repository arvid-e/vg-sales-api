import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/bad-request-error.js';
import type { UserRequestWithId } from '../interfaces/requests/request-types.js';
import type { IUserService } from '../interfaces/user/user-service.js';
import { catchAsync } from '../utils/catch-async.js';
import { NotFoundError } from '../errors/not-found-error.js';

/**
 * Controller handling all User related HTTP requests.
 * Orchestrates communication between the client and UserService.
 */
export class UserController {
  constructor(private userService: IUserService) {}

  /**
   * Registers a new user, saves it to the database and respons with a authentication token.
   */
  createUser = catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const { user, token } = await this.userService.createUser({
      username,
      password,
    });
    const userId = user._id.toString();

    return res.status(201).json({
      status: 'success',
      data: user,
      token,
      links: this.createLinks(req, userId),
    });
  });

  /**
   * Deletes the users account. A user can only delete their own account.
   * @throws {BadRequestError} If provided ID is invalid.
   * @throws {NotFoundError} If provided user ID is not their own, 404 in order to hide the existance of other users.
   */
  deleteUser = catchAsync(async (req: UserRequestWithId, res: Response) => {
    const { id } = req.params;

    if (id == null || !isValidObjectId(id)) {
      throw new BadRequestError('Invalid ID');
    }

    if (req.user?.id !== id) {
      throw new NotFoundError('User');
    }

    await this.userService.deleteUser(id);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = [
      { rel: 'register', method: 'POST', href: `${baseUrl}/users` },
      { rel: 'all-games', method: 'GET', href: `${baseUrl}/games` },
    ];

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      links,
    });
  });

  /**
   * Logs in the user and responds with an authentication token.
   */
  loginUser = catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const { user, token } = await this.userService.loginUser({
      username,
      password,
    });
    const userId = user._id.toString();

    return res.status(200).json({
      status: 'success',
      data: user,
      token,
      links: this.createLinks(req, userId),
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

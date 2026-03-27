import type { Request, Response } from 'express';
import type { IUserService } from '../interfaces/user/user-service.js';
import { catchAsync } from '../utils/catch-async.js';

interface UserParams {
  id: string;
}

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

    const { user, token, userId } = await this.userService.createUser({
      username,
      password,
    });

    return res.status(201).json({
      status: 'success',
      data: user,
      token,
      links: this.createLinks(req, userId),
    });
  });

  /**
   * Deletes the users account. A user can only delete their own account.
   */
  deleteUser = catchAsync(async (req: Request<UserParams>, res: Response) => {
    const { id } = req.params;

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

    const { user, token, userId } = await this.userService.loginUser({
      username,
      password,
    });

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

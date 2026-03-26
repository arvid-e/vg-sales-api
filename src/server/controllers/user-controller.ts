import type { Request, Response } from 'express';
import type { IUserService } from '../interfaces/user/user-service.js';
import { catchAsync } from '../utils/catch-async.js';

interface UserParams {
  id: string;
}

export class UserController {
  constructor(private userService: IUserService) {}

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

  deleteUser = catchAsync(async (req: Request<UserParams>, res: Response) => {
    const { id } = req.params;

    await this.userService.deleteUser(id);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = [
      { rel: 'register', method: 'POST', href: `${baseUrl}/users` },
      { rel: 'all-games', method: 'GET', href: `${baseUrl}/games` }
    ];

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      links
    });
  });

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

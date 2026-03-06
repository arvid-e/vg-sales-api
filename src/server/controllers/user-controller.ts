import type { Request, Response } from 'express';
import type { IUserService } from '../interfaces/user/user-service.js';
import { catchAsync } from '../utils/catch-async.js';

export class UserController {
  constructor(private userService: IUserService) {}

  createUser = catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userService.createUser({ username, password });

    return res.status(201).json({
      status: 'success',
      data: user,
    });
  });
}

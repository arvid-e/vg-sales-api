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

    const user = await this.userService.createUser({ username, password });

    return res.status(201).json({
      status: 'success',
      data: user?.toJSON(),
    });
  });

  deleteUser = catchAsync(async (req: Request<UserParams>, res: Response) => {
    const { id } = req.params;

    await this.userService.deleteUser(id);

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  });

  loginUser = catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userService.loginUser({ username, password });

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  });
}

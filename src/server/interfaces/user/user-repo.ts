  import type { IUser, IUserDocument } from './user.js';

  export interface IUserRepo {
    create(userPayload: IUser): Promise<IUserDocument | null>;
    update(user: IUser): Promise<IUserDocument | null>;
    deleteById(id: string): Promise<boolean>;
    findById(id: string): Promise<IUserDocument | null>;
    findByGithubId(githubId: number): Promise<IUserDocument | null>;
  }

import type { IGitHubProfile } from './profile.js';
import type { IUserDocument } from './user.js';

export interface IUserService {
  syncWithProvider(profile: IGitHubProfile): Promise<IUserDocument>;
  create(profile: IGitHubProfile): Promise<IUserDocument>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<IUserDocument | null>;
}

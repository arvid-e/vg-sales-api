import type { Document } from "mongoose";

export interface IUser {
  username: string;
  password: string;
}

export interface IUserDocument extends IUser, Document{}; 
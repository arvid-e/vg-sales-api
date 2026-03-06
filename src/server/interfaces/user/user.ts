import type { Document } from "mongoose";

export interface IUser {
  username: string;
  password: string;
}

export interface IUserDocument extends IUser, Document{}; 

export interface IAuthResponse {
  user: IUserDocument;
  token: string;
}
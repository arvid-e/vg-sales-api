import type { Document } from "mongoose";
import type { Request } from "express";

export interface IUser {
  username: string;
  password: string;
}

export interface IUserDocument extends IUser, Document{}; 

export interface IAuthResponse {
  user: IUserDocument;
  token: string;
}

export interface UserRequest extends Request {
  user?: {
    id: string;
  };
}
import type { Document, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  githubId: number;      
  username: string;        
  avatarUrl?: string;    
  email?: string;         
  role: 'user' | 'admin'; 
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; 
}

export interface IAuthResponse {
  user: IUser;
  token: string; 
}

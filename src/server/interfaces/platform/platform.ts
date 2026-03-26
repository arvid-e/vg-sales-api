import { Document, Types } from 'mongoose';

export interface IPlatform {
  name: string;
}

export interface IPlatformDocument extends IPlatform, Document {
  _id: Types.ObjectId;
  platformId: string;
}

export interface IPlatformQuery {
  page?: number;
  limit?: number;
  query?: any;
}
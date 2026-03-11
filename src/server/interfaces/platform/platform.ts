import { Document } from 'mongoose';

export interface IPlatform {
  platformId: string,
  name: string;
}

export interface IPlatformDocument extends IPlatform, Document {}

import mongoose, { Document } from 'mongoose';

export interface IGame {
  _id: mongoose.Types.ObjectId;
  rank: number;
  name: string;
  platform: mongoose.Schema.Types.ObjectId;
  year: number;
  genre: string;
  publisher: mongoose.Schema.Types.ObjectId;
  sales: {
    na: number;
    eu: number;
    jp: number;
    other: number;
    global: number;
  };
  title_embedding: number[];
}

export interface IGameDocument extends IGame, Document {}

export interface IUpdateGamePayload {
  _id: string;
  rank?: number;
  name?: string;
  platform?: mongoose.Schema.Types.ObjectId;
  year?: number;
  genre?: string;
  publisher?: mongoose.Schema.Types.ObjectId;
  sales?: {
    na?: number;
    eu?: number;
    jp?: number;
    other?: number;
    global?: number;
  };
}

export interface IGameQuery {
  limit?: number | undefined;
  page?: number | undefined;
  search?: string | undefined;
  genre?: string | undefined;
  platform?: string | undefined;
  publisher?: string | undefined;
}

export interface IGameMongoFilter {
  [key: string]: any;

  name?: { $regex: RegExp } | undefined;
  genre?: { $regex: RegExp } | undefined;
  platform?: mongoose.Types.ObjectId | undefined;
  publisher?: mongoose.Types.ObjectId | undefined;
}

export interface IGroupedGameSales {
  name: string;
  na: number;
  eu: number;
  jp: number;
  other: number;
  total: number;
  count: number;
}

export interface IGameSalesGroups {
  genre: string;
  platform: string;
  publisher: string;
}

export const VALID_GROUPS: (keyof IGameSalesGroups)[] = [
  'genre',
  'platform',
  'publisher',
];

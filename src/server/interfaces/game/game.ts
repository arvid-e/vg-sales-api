import mongoose, { Document } from 'mongoose';

export interface IGame {
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
  limit?: number;
  page?: number;
  query: any;
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

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

export interface IGameFilter {
  platform?: string;
  publisher?: string;
  genre?: string;
}

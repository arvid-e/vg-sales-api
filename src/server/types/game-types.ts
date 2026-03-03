import mongoose, { Document } from "mongoose";

export interface GameSalesDocument extends Document {
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

export interface PublisherDocument extends Document {
  publisher: string;
}

export interface PlatformDocument extends Document {
  platform: string;
}



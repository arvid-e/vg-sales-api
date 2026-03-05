import mongoose, { Document } from 'mongoose'

export interface IGameDocument extends Document {
  rank: number
  name: string
  platform: mongoose.Schema.Types.ObjectId
  year: number
  genre: string
  publisher: mongoose.Schema.Types.ObjectId
  sales: {
    na: number
    eu: number
    jp: number
    other: number
    global: number
  }
}

export interface IPublisherDocument extends Document {
  publisher: string
}

export interface IPlatformDocument extends Document {
  platform: string
}

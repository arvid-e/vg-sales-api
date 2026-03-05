import mongoose, { Schema, model } from 'mongoose'
import type { IGameDocument } from '../interfaces/game.js'

const gamesSchema = new Schema<IGameDocument>(
  {
    rank: Number,
    name: {
      type: String,
      required: true,
    },
    year: Number,
    genre: String,
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform',
      required: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publisher',
      required: true,
    },
    sales: {
      na: Number,
      eu: Number,
      jp: Number,
      other: Number,
      global: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const GamesModel = model<IGameDocument>('Game', gamesSchema)
export default GamesModel

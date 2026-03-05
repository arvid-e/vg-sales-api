import { Schema, model } from 'mongoose'
import type { IPublisherDocument } from '../interfaces/game.js'

const publisherSchema = new Schema<IPublisherDocument>(
  {
    publisher: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

const PublisherModel = model<IPublisherDocument>('Publisher', publisherSchema)
export default PublisherModel

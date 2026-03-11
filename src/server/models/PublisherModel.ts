import { Schema, model } from 'mongoose';
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js';

const publisherSchema = new Schema<IPublisherDocument>(
  {
    publisherId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const PublisherModel = model<IPublisherDocument>('Publisher', publisherSchema);
export default PublisherModel;

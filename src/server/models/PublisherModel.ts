import { Schema, model } from 'mongoose';
import type { IPublisherDocument } from '../interfaces/publisher/publisher.js';

const publisherSchema = new Schema<IPublisherDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret: any) => {
        ret.publisherId = ret._id.toString();

        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

const PublisherModel = model<IPublisherDocument>('Publisher', publisherSchema);
export default PublisherModel;

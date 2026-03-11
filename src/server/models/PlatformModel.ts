import { Schema, model } from 'mongoose';
import type { IPlatformDocument } from '../interfaces/platform/platform.js';

const platformSchema = new Schema<IPlatformDocument>(
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
        ret.platformId = ret._id.toString();

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

const PlatformModel = model<IPlatformDocument>('Platform', platformSchema);
export default PlatformModel;

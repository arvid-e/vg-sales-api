import { Schema, model } from 'mongoose';
import type { IPlatformDocument } from '../interfaces/platform/platform.js';

const platformSchema = new Schema<IPlatformDocument>(
  {
    platformId: {
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

const PlatformModel = model<IPlatformDocument>('Platform', platformSchema);
export default PlatformModel;

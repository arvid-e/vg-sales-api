import { Schema, model } from 'mongoose';
import type { IUserDocument } from '../interfaces/user/user.js';

const userSchema = new Schema<IUserDocument>(
  {
    githubId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: { virtuals: true },
  }
);

const UserModel = model<IUserDocument>('User', userSchema);
export default UserModel;

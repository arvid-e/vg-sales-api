import { Schema, model } from 'mongoose';
import type { IUserDocument } from '../interfaces/user/user.js';

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUserDocument>('User', userSchema);
export default UserModel;

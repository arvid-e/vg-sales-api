import { Schema, model } from 'mongoose';
import type { IUserDocument } from '../interfaces/user/user.js';

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: true,
      minlength: [10, 'Password must be at least 10 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret: any) => {
        ret.userId = ret._id.toString();

        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const UserModel = model<IUserDocument>('User', userSchema);
export default UserModel;

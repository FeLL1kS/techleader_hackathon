import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  created: number;
  username: string;
  name: string;
  lastActivity: number;
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    created: Number,
    username: String,
    name: String,
    lastActivity: Number,
  },
  { _id: false },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

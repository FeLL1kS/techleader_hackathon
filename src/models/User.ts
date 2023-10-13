import mongoose, { Document } from 'mongoose';
import { INews } from './News';

export interface IUser extends Document {
  _id: string;
  created: number;
  username: string;
  name: string;
  lastActivity: number;
  news: INews[];
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    chatId: String,
    created: Number,
    username: String,
    name: String,
    lastActivity: Number,
    news: [{ type: String, ref: 'News' }],
  },
  { _id: false },
);

UserSchema.pre('find', function () {
  this.populate('news');
}).pre('findOne', function () {
  this.populate('news');
});

const User = mongoose.model('User', UserSchema);

export default User;

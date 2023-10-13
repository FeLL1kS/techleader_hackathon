import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

export interface INews extends Document {
  _id: string;
  user: IUser;
  created: number;
  text: string | null;
  fileLink: string | null;
  rating: number | null;
  fileId: string | null;
  type: 'text' | 'photo' | 'video';
  isApproved: boolean;
}

export const NewsSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, ref: 'User' },
    created: Number,
    text: String,
    fileLink: String,
    rating: { type: Number, default: null },
    fileId: String,
    type: {
      type: String,
      enum: ['text', 'photo', 'video'],
      default: 'text',
    },
    isApproved: { type: Boolean, default: false },
  },
  { _id: false },
);

NewsSchema.pre('find', function () {
  this.populate('user');
}).pre('findOne', function () {
  this.populate('user');
});

const News = mongoose.model<INews>('News', NewsSchema);

export default News;

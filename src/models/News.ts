import mongoose, { Document } from 'mongoose';

export interface INews extends Document {
  _id: string;
  created: number;
  text: string | null;
  fileLink: string | null;
  fileId: string | null;
  type: 'text' | 'photo' | 'video';
}

export const NewsSchema = new mongoose.Schema(
  {
    _id: String,
    created: Number,
    text: String,
    fileLink: String,
    fileId: String,
    type: {
      type: String,
      enum: ['text', 'photo', 'video'],
      default: 'text',
    },
  },
  { _id: false },
);

const News = mongoose.model<INews>('News', NewsSchema);

export default News;

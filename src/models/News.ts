import mongoose, { Document } from 'mongoose';

export interface INews extends Document {
  _id: string;
  created: number;
  text: string | null;
  fileLink: string | null;
}

export const NewsSchema = new mongoose.Schema(
  {
    _id: String,
    created: Number,
    text: String,
    // eslint-disable-next-line camelcase
    fileLink: String,
  },
  { _id: false },
);

const News = mongoose.model<INews>('News', NewsSchema);

export default News;

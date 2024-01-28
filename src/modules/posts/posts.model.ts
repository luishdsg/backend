import * as mongoose from 'mongoose';
import { CommentPost } from '../../shared/interface/post.interface'
export const PostsSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
  photo: { type: String, required: false, default: "" },
  tag: { type: String, required: true, default: "" },
  saves: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  reposts: { type: Number, default: 0 },
  comments: { type: [{ userId: String, content: String }], required: true, default: 0 },
  likes: [
    {
      type: Object,
      default: 0
    },
  ],
  hated: [
    {
      type: Object,
      default: 0
    },
  ],
});

export interface PostsModel extends mongoose.Document {
  userId: String;
  createdAt: Date;
  content: string;
  photo: string;
  tag: string;
  likes?: Object[],
  hated?: Object[],
  views: number;
  comments: CommentPost[];
  reposts: number;
}

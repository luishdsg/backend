import * as mongoose from 'mongoose';
import { Comment } from '../../shared/interface/post.interface'
export const PostsSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
  photo: { type: String, required: false, default: "" },
  tag: { type: String, required: true, default: "" },
  saves: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  hates: { type: Number, default: 0 },
  reposts: { type: Number, default: 0 },
  comments: { type: [{ id: String, content: String }], required: true, default: [] },
});

export interface PostsModel extends mongoose.Document {
  userId: String;
  createdAt: Date;
  content: string;
  photo: string;
  tag: string;
  views: number;
  saves: number;
  likes: number;
  hates: number;
  comments: Comment[];
  reposts: number;
}

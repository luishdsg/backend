// posts/post.model.ts

import * as mongoose from 'mongoose';

export const PostsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
  tag: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  hates: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  reposts: { type: Number, default: 0 },
});

export interface PostsModel extends mongoose.Document {
  userId: string;
  createdAt: Date;
  content: string;
  tag: string;
  views: number;
  likes: number;
  hates: number;
  comments: number;
  reposts: number;
}

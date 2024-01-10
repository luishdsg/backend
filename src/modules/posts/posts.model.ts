// posts/post.model.ts

import * as mongoose from 'mongoose';

export const PostsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: false },
  photo: { type: String, required: false, default: ""},
  tag: { type: String, required: true,  default: ""},
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
  photo: string;
  tag: string;
  views: number;
  likes: number;
  hates: number;
  comments: number;
  reposts: number;
}

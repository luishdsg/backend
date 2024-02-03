export interface CommentPost {
  _id: string;
  likes: Object[];
  createdAt: Date,
  userId: string;
  content: string;
}
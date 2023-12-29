import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export interface UserModel extends mongoose.Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  gender: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}



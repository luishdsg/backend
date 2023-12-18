import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export interface UserModel extends mongoose.Document {
  username: string;
  password: string;
  gender: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}



import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  gender: String,
});
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export interface User extends mongoose.Document {
  username: string;
  password: string;
  gender: string;
  comparePassword(password: string): Promise<boolean>;
}



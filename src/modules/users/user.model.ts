import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { Gender } from 'src/shared/enum/user.enum';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: {type: String, enum: Object.values(Gender), default: Gender.OTHER  ,required: false},
  photo: { type: String ,required: false},
  email: { type: String ,required: false},
  birth: { type: String ,required: false},
  local: { type: String ,required: false},
  lang: { type: String ,required: false},
  posts: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  saved: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  favorites: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  trash: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export interface UserModel extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  gender?: Gender,
  photo?: string,
  email?: string,
  birth?: string,
  local?: string,
  lang?: string,
  posts?: Object[];
  saved?: Object[];
  favorites?: Object[];
  trash?: Object[];
  comparePassword(password: string): Promise<boolean>;
}



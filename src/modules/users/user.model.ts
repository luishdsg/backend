import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { Gender } from 'src/shared/enum/user.enum';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: {type: String, enum: Object.values(Gender), default: Gender.OTHER  ,required: false},
  photo: { type: String ,required: false, default: 'https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png'},
  email: { type: String ,required: false , default: ""},
  birth: { type: Date ,required: false , default: ""},
  verified: { type: Boolean ,required: false , default: false},
  local: { type: String ,required: false , default: ""},
  lang: { type: String ,required: false , default: ""},
  following: [
    {
      type: Object,
      default: 0
    },
  ],
  followers: [
    {
      type: Object,
      default: 0
    },
  ],
  posts: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  block: [
    {
      type: Object,
      required: false
    },
  ],
  saved: [
    {
      type: Object,
      ref: 'Post',
    },
  ],
  hates: [
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
  birth?: Date,
  verified?: boolean,
  local?: string,
  following?: Object[],
  followers?: Object[],
  lang?: string,
  block?:  Object[],
  posts?: Object[];
  saved?: Object[];
  hates?: Object[];
  favorites?: Object[];
  trash?: Object[];
  comparePassword(password: string): Promise<boolean>;
}



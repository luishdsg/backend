import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { UserModel } from './user.model';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';
import { PostsModel } from '../posts/posts.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly _userModel: Model<UserModel>,
    @InjectModel('Post')
    private readonly _postModel: Model<PostsModel>
  ) { }
  private readonly logger = new Logger(UsersService.name);

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this._userModel({ ...createUserDto, password: hashedPassword, });
    return newUser.save();
  }
  async findByUsername(username: string): Promise<UserModel> {
    try {
      const user = await this._userModel.findOne({ username }).exec();
      if (!user) {
        throw new NotFoundException(`User with username '${username}' not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error in findByUsername: ${error.message}`);
      throw error;
    }
  }



  async findAllUsers() {
    return await this._userModel.find().exec();
  }



  async findUserById(id: string): Promise<UserModel> {
    console.log(`Trying to find user with ID: ${id}`);
    try {
      const userId = await this._userModel.findById(id).exec();
      if (!userId) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }
      return userId;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }


  async updateUses(id: string, newUser: GetUsersDto) {
    return await this._userModel.findByIdAndUpdate(id, newUser, { new: true });
  }


  async followUser(followerId: string, followingId: string): Promise<UserModel> {
    try {
      const follower = await this._userModel.findById(followerId);
      const following = await this._userModel.findById(followingId);

      if (!follower || !following) {
        throw new NotFoundException('Usuário não encontrado');
      }
      following.followers.push(followerId);
      await following.save();
      follower.following.push(followingId);
      await follower.save();
      return;
    } catch (error) {
      this.logger.debug(`follow todo deu ruim`);
    }
  }



  async findAllUserPerPage(page: number): Promise<UserModel[]> {
    try {
      const skipAmount = (page - 1) * 10;
      const usersPerPage = await this._userModel.find().skip(skipAmount).limit(10).exec();
      if (!usersPerPage) {
        console.error(`Error in paginate usersPerPage: ${usersPerPage}`);
      }
      return usersPerPage;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }


  async deleteUser(userId: string): Promise<void> {
    const user = await this._userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this._postModel.deleteMany({ userId: userId }).exec();
    await this._userModel.findByIdAndDelete(userId);
  }


  async addPostToUser(userId: String, postId: Types.ObjectId): Promise<UserModel | null> {
    try {
      const user = await this._userModel.findById(userId).exec();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      user.posts.push(postId);
      const done = await user.save();
      if (!done) {
        this.logger.debug(`não salvou o id post`);
      }
      return user;
    } catch (error) {
      console.error(`Erro ao adicionar post ao usuário: ${error.message}`);
      throw error;
    }
  }

  async updatePostsArray(userId: String, postId: String): Promise<void> {
    await this._userModel.updateOne(
      { _id: userId },
      { $pull: { posts: postId } }
    );
  }
}

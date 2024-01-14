// posts/posts.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { PostsModel } from './posts.model';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<PostsModel>,
    private readonly usersService: UsersService,
    ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostsModel> {
    try {
      const createdPost = new this.postModel(createPostDto);
      console.error(` post: ${createdPost}`);
      try {
        const savedPost = await createdPost.save();
        await this.usersService.addPostToUser(createdPost.userId, savedPost._id);
        return savedPost;
      } catch (error) {
        console.error(`Erro ao criar o post: ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.error(`Error creating post: ${error.message}`);
      throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findAllPosts(): Promise<PostsModel[]> {
    return await this.postModel.find().exec();
  }

  async findPostById(id: string): Promise<PostsModel> {
    return await this.postModel.findById(id).exec();
  }

  async findAllPostById(finduserId: String, page: number,): Promise<any[]> {
    console.log(`Trying to find user with ID: ${finduserId}`);
    try {
      const skipAmount = (page - 1) * 10;
      const userId = await this.postModel.find({userId: finduserId}).skip(skipAmount).limit(10).exec();
      if (!userId) {
        console.error(`Error: ${userId}`);
      }
      return userId;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }

  async updatePost(id:string, newPost: GetPostDto) {
    return await this.postModel.findByIdAndUpdate(id, newPost, { new: true });
  }

  async deletePostById(postId: String) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      console.error(`Post with ID ${typeof post} not found`);
    }
    await post.deleteOne();
    await this.usersService.updatePostsArray(post.userId ,postId);
  }
}

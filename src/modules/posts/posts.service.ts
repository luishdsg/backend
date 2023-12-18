// posts/posts.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { PostsModel } from './posts.model';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<PostsModel>) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostsModel> {
    const createdPost = new this.postModel(createPostDto);
    return await createdPost.save();
  }

  async findAllPosts(): Promise<PostsModel[]> {
    return await this.postModel.find().exec();
  }

  async findPostById(id: string): Promise<PostsModel> {
    return await this.postModel.findById(id).exec();
  }

  async updatePost(id:string, newPost: GetPostDto) {
    return await this.postModel.findByIdAndUpdate(id, newPost, { new: true });
  }

  async deletePostById(id) {
    return await this.postModel.findByIdAndDelete(id);
  }
}

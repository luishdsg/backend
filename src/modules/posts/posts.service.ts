// posts/posts.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { PostsModel } from './posts.model';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from 'src/shared/interface/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post')
    private readonly _postModel: Model<PostsModel>,
    private readonly _usersService: UsersService,
  ) { }


  async createPost(createPostDto: CreatePostDto): Promise<PostsModel> {
    try {
      const createdPost = new this._postModel(createPostDto);
      console.error(` post: ${createdPost}`);
      try {
        const savedPost = await createdPost.save();
        await this._usersService.addPostToUser(createdPost.userId, savedPost._id);
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

  async addLikeAndFavorite(postId: string, userId: string): Promise<PostsModel> {
    try {
      const postAddLikeAndFavorite = await this._postModel.findById(postId);
      if (!postAddLikeAndFavorite) throw new NotFoundException('Post não encontrado');
      postAddLikeAndFavorite.likes.push(userId);
      await this._usersService.addToFavorites(userId, postAddLikeAndFavorite._id.toString());
      return await postAddLikeAndFavorite.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar like e favorite');
    }
  }

  async removeLikeAndFavorite(postId: string, userId: string): Promise<PostsModel> {
    try {
      const postRemoveLikeAndFavorite = await this._postModel.findById(postId);
      if (!postRemoveLikeAndFavorite) throw new NotFoundException('Post não encontrado');
      postRemoveLikeAndFavorite.likes = postRemoveLikeAndFavorite.likes.filter((id) => id !== userId);
      await this._usersService.removeFromFavorites(userId, postId);
      return await postRemoveLikeAndFavorite.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover like e favorite');
    }
  }


  async addHated(postId: string, userId: string): Promise<PostsModel> {
    try {
      const postHated = await this._postModel.findById(postId);
      if (!postHated) throw new NotFoundException('Post não encontrado');
      postHated.hated.push(userId);
      const saveHated = await postHated.save();
      await this._usersService.addToHated(userId, postId);
      return saveHated
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar like e favorite');
    }
  }

  async removeHated(postId: string, userId: string): Promise<PostsModel> {
    try {
      const postRemoveHated = await this._postModel.findById(postId);
      if (!postRemoveHated) throw new NotFoundException('Post não encontrado');
      postRemoveHated.hated = postRemoveHated.hated.filter((id) => id !== userId);
      const saveRemoveHated = await postRemoveHated.save();
      await this._usersService.removeFromHated(userId, postId);
      return saveRemoveHated
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover like e favorite');
    }
  }

  async addComment(postId: string, userId: string, comment: CreateCommentDto): Promise<PostsModel> {
    try {
      const postAddComment = await this._postModel.findById(postId);
      if (!postAddComment) throw new NotFoundException('Post não encontrado');
      const comments = {userId: comment.userId, content: comment.content };
      postAddComment.comments.push(comments);
      const savePostAddComment = await postAddComment.save();
      await this._usersService.addToComments(userId, postId);
      return savePostAddComment
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar comentário');
    }
  }

  async removeComment(postId: string, userId: string, commentId: string): Promise<PostsModel> {
    try {
      const postRemoveComment = await this._postModel.findById(postId);
      if (!postRemoveComment) throw new NotFoundException('Post não encontrado');
      const userCommentIndex = postRemoveComment.comments.findIndex(comment => comment.userId === userId);
      if (userCommentIndex === -1) throw new UnauthorizedException('Usuário não autorizado a remover este comentário');
      const removedComment = postRemoveComment.comments.splice(userCommentIndex, 1)[0];
      const saveRemoveComment = await postRemoveComment.save();
      await this._usersService.removeFromComments(userId, postId);
      console.log('ID do comentário removido:', removedComment);
      return saveRemoveComment
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover comentário');
    }
  }


  async getPostComments(postId: string): Promise<CreateCommentDto[]> {
    try {
      const postGetPostComments = await this._postModel.findById(postId);
      if (!postGetPostComments) throw new NotFoundException('Post não encontrado');
      return postGetPostComments.comments;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao obter comentários do post');
    }
  }


  async findAllPosts(): Promise<PostsModel[]> {
    return await this._postModel.find().exec();
  }


  async findAllPostPerPage(page: number): Promise<PostsModel[]> {
    try {
      const skipAmount = (page - 1) * 10;
      const postsPerPage = await this._postModel.find().skip(skipAmount).limit(10).exec();
      if (!postsPerPage) {
        console.error(`Error in paginate postsPerPage: ${postsPerPage}`);
      }
      return postsPerPage;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }


  async findPostById(id: string): Promise<PostsModel> {
    return await this._postModel.findById(id).exec();
  }

  async findAllPostById(finduserId: String, page: number,): Promise<any[]> {
    console.log(`Trying to find user with ID: ${finduserId}`);
    try {
      const skipAmount = (page - 1) * 10;
      const userId = await this._postModel.find({ userId: finduserId }).skip(skipAmount).limit(10).exec();
      if (!userId) {
        console.error(`Error: ${userId}`);
      }
      return userId;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }

  async updatePost(id: string, newPost: GetPostDto) {
    return await this._postModel.findByIdAndUpdate(id, newPost, { new: true });
  }

  async deletePostById(postId: String) {
    const post = await this._postModel.findById(postId);

    if (!post) {
      console.error(`Post with ID ${typeof post} not found`);
    }
    await post.deleteOne();
    await this._usersService.updatePostsArray(post.userId, postId);
  }
}

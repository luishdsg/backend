// posts/posts.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { PostsModel } from './posts.model';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from 'src/shared/interface/create-comment.dto';
import { CommentPost } from 'src/shared/interface/post.interface';

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
      const newComment = { userId: comment.userId, content: comment.content };
      postAddComment.comments.push(newComment as any);
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

  async addLikeToComment(postId: string, commentId: string, userId: string,  ): Promise<PostsModel> {
    try {
      const postAddLikeToComment = await this._postModel.findById(postId);
      if (!postAddLikeToComment) throw new NotFoundException('Post não encontrado');
      const comment = postAddLikeToComment.comments.find((comment) => comment._id.toString() === commentId);
      if (!comment) throw new NotFoundException('Comentário não encontrado');
      if (!comment.likes.includes(userId)) comment.likes.push(userId);
      const updatedPost = await postAddLikeToComment.save();
      return updatedPost;
    } catch (error) {
      console.error(`Error in addLikeToComment service: ${error.message}`);
      throw new Error('Erro ao adicionar like ao comentário do post');
    }
  }


  async removeLikeFromComment(postId: string, commentId: string, userId: string): Promise<PostsModel> {
    try {
      const postRemoveLikeFromComment = await this._postModel.findById(postId);
      if (!postRemoveLikeFromComment) throw new NotFoundException('Post não encontrado');
      const comment = postRemoveLikeFromComment.comments.find(comment => comment._id.toString()  === commentId);
      if (!comment) throw new NotFoundException('Comentário não encontrado');
      comment.likes = comment.likes.filter((likeUserId) => likeUserId !== userId);
      const updatedPost = await postRemoveLikeFromComment.save();
      return updatedPost;
    } catch (error) {
      console.error(`Error in removeLikeFromComment service: ${error.message}`);
      throw new Error('Erro ao remover like do comentário do post');
    }
  }


  async getPostCommentsPerPage(page: number, postId: string): Promise<CreateCommentDto[]> {
    try {
      const skipAmount = (page - 1) * 10;
      const PostCommentsPerPage = await this._postModel.findById(postId);
      if (!PostCommentsPerPage) {
        console.error(`Error in paginate PostCommentsPerPage: ${PostCommentsPerPage}`);
      }
      const paginatedComments = PostCommentsPerPage.comments.slice(skipAmount, skipAmount + 10);
      return paginatedComments;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
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

  async updateViews(postId: string): Promise<PostsModel> {
    try {
      const post = await this._postModel.findById(postId);
      if (!post) throw new NotFoundException('Post não encontrado');
      post.views = (post.views || 0) + 1;
      const updatedPost = await post.save();
      return updatedPost;
    } catch (error) {
      console.error(`Error in updateViews service: ${error.message}`);
      throw new Error('Erro ao atualizar a contagem de views do post');
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

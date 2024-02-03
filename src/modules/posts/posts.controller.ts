// posts/posts.controller.ts

import { Body, Controller, Delete, Get, HttpException, Post, HttpStatus, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { PostsModel } from './posts.model';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import mongoose from 'mongoose';
import { CreateCommentDto } from 'src/shared/interface/create-comment.dto';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly _postsService: PostsService
  ) { }




  @ApiResponse({ status: 200, description: 'Create Post' })
  @ApiOperation({ summary: 'Create Post' })
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostsModel> {
    try {
      const post = await this._postsService.createPost(createPostDto);
      return post;
    } catch (error) {
      console.error(`Error in create post controller: ${error.message}`);
      throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({ status: 200, description: 'Like and favorite post' })
  @ApiOperation({ summary: 'Like and favorite post' })
  @Post(':postId/addLikeAndFavorite/:userId')
  async addLikeAndFavorite(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ): Promise<PostsModel> {
    try {
      const postaddLikeAndFavorite = await this._postsService.addLikeAndFavorite(postId, userId);
      return postaddLikeAndFavorite;
    } catch (error) {
      console.error(`Error in addLikeAndFavorite post controller: ${error.message}`);
      throw new HttpException('Error addLikeAndFavorite post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Hated post' })
  @ApiOperation({ summary: 'Hated post' })
  @Post(':postId/addHated/:userId')
  async addHated(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ): Promise<PostsModel> {
    try {
      const postaddHated = await this._postsService.addHated(postId, userId);
      return postaddHated;
    } catch (error) {
      console.error(`Error in addHated post controller: ${error.message}`);
      throw new HttpException('Error addHated post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Add comments in post' })
  @ApiOperation({ summary: 'Add comments in post' })
  @Post(':postId/addComment/:userId')
  async addComment(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Body() commentDto: CreateCommentDto,
  ): Promise<PostsModel> {
    try {
      const comment = { userId: commentDto.userId, content: commentDto.content, };
      const postAddComment = await this._postsService.addComment(postId, userId, comment);
      return postAddComment
    } catch (error) {
      console.error(`Error in addComment post controller: ${error.message}`);
      throw new HttpException('Error addComment post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({ status: 200, description: 'get comments per page' })
  @ApiOperation({ summary: 'get comments per page' })
  @Get(':postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1,
    ): Promise<CreateCommentDto[]> {
    try {
      return this._postsService.getPostCommentsPerPage(page, postId);
    } catch (error) {
      console.error(`Error in getPostComments post controller: ${error.message}`);
      throw new HttpException('Error getPostComments post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({ status: 200, description: 'Contagem de views atualizada com sucesso' })
  @ApiOperation({ summary: 'Atualiza a contagem de views de um post' })
  @Put(':postId/updateViews')
  async updateViews(@Param('postId') postId: string): Promise<PostsModel> {
    try {
      const updatedPost = await this._postsService.updateViews(postId);
      return updatedPost;
    } catch (error) {
      console.error(`Error in updateViews controller: ${error.message}`);
      throw new HttpException('Erro ao atualizar a contagem de views do post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Like adicionado ao comentário do post' })
  @ApiOperation({ summary: 'Adiciona um like ao comentário do post' })
  @Put(':postId/addLikeToComment/:commentId/atUser/:userId')
  async addLikeToComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
    ): Promise<PostsModel> {
    try {
      const updatedPost = await this._postsService.addLikeToComment(postId, commentId, userId);
      return updatedPost;
    } catch (error) {
      console.error(`Error in addLikeToComment controller: ${error.message}`);
      throw new HttpException('Erro ao adicionar like ao comentário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Like removido do comentário do post'})
  @ApiOperation({ summary: 'Remove um like do comentário do post' })
  @Put(':postId/removeLikeFromComment/:commentId/atUser/:userId')
  async removeLikeFromComment(
    @Param('postId') postId: string, 
    @Param('commentId') commentId: string,
   @Param('userId') userId: string,

  ): Promise<PostsModel> {
    try {
      const updatedPost = await this._postsService.removeLikeFromComment(postId ,commentId,userId );
      return updatedPost;
    } catch (error) {
      console.error(`Error in removeLikeFromComment controller: ${error.message}`);
      throw new HttpException('Erro ao remover like do comentário do post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Remove Hated post' })
  @ApiOperation({ summary: 'Remove Hated post' })
  @Delete(':postId/removeHated/:userId')
  async removeHated(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ): Promise<PostsModel> {
    try {
      const postremoveHated = await this._postsService.removeHated(postId, userId);
      return postremoveHated;
    } catch (error) {
      console.error(`Error in removeHated post controller: ${error.message}`);
      throw new HttpException('Error removeHated post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({ status: 200, description: 'DisLike and unFavorite post' })
  @ApiOperation({ summary: 'DisLike and unFavorite post' })
  @Delete(':postId/removeLikeAndFavorite/:userId')
  async removeLikeAndFavorite(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ): Promise<PostsModel> {
    try {
      const postremoveLikeAndFavorite = await this._postsService.removeLikeAndFavorite(postId, userId);
      return postremoveLikeAndFavorite;
    } catch (error) {
      console.error(`Error in removeLikeAndFavorite post controller: ${error.message}`);
      throw new HttpException('Error removeLikeAndFavorite post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiResponse({ status: 200, description: 'Delete comments in post' })
  @ApiOperation({ summary: 'Delete comments in post' })
  @Delete(':postId/removeComment/:userId')
  async removeComment(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Param('commentId') commentId: string,
  ): Promise<PostsModel> {
    try {
      const postRemoveComment = await this._postsService.removeComment(postId, userId, commentId);
      return postRemoveComment
    } catch (error) {
      console.error(`Error in removeComment post controller: ${error.message}`);
      throw new HttpException('Error removeComment post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get()
  async findAll(): Promise<PostsModel[]> {
    return await this._postsService.findAllPosts();
  }

  @ApiResponse({ status: 200, description: 'GEt all users per page' })
  @ApiOperation({ summary: 'GEt all users per page' })
  @Get('per-page')
  async findAllPostPerPage(
    @Query('page') page: number = 1,
  ): Promise<PostsModel[]> {
    return await this._postsService.findAllPostPerPage(page);
  }


  @ApiResponse({ status: 200, description: 'List by Id' })
  @ApiOperation({ summary: 'List by Id' })
  @Get(':id')
  async findPostById(@Param('id') id: string): Promise<PostsModel> {
    return await this._postsService.findPostById(id);
  }


  @ApiResponse({ status: 200, description: 'GEt all posts by id' })
  @ApiOperation({ summary: 'GEt all posts by id' })
  @Get('findByIdUser/:userId')
  async findAllPostById(
    @Param('userId') userId: String,
    @Query('page') page: number = 1,
  ): Promise<PostsModel[]> {
    console.log('userId:', userId);
    return await this._postsService.findAllPostById(userId, page);
  }


  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Delete(':id')
  async delete(@Param('id') id: String) {
    return await this._postsService.deletePostById(id);
  }
}

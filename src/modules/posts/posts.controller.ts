// posts/posts.controller.ts

import { Body, Controller, Delete, Get, HttpException, Post as HttpPost, HttpStatus, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { PostsModel } from './posts.model';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import mongoose from 'mongoose';
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
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostsModel> {
    try {
      const post = await this._postsService.createPost(createPostDto);
      return post;
    } catch (error) {
      console.error(`Error in create post controller: ${error.message}`);
      throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
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
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: GetPostDto) {
    return await this._postsService.updatePost(id, updateUser);
  }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Delete(':id')
  async delete(@Param('id') id: String) {
    return await this._postsService.deletePostById(id);
  }
}

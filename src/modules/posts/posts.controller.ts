// posts/posts.controller.ts

import { Body, Controller, Delete, Get, Post as HttpPost, Param, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { PostsModel } from './posts.model';
import { PostsService } from './posts.service';


@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly _postsService: PostsService
    ) {}

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto , @Request() req): Promise<PostsModel> {
    const userId = req.user.sub;
    createPostDto.userId = userId;
    return await this._postsService.createPost(createPostDto);
  }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get()
  async findAll(): Promise<PostsModel[]> {
    return await this._postsService.findAllPosts();
  }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get(':id')
  async findPostById(@Param('id') id: string): Promise<PostsModel> {
    return await this._postsService.findPostById(id);
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
  async delete(@Param('id') id: string) {
    return await this._postsService.deletePostById(id);
  }
}

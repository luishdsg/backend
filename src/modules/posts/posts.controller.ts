// posts/posts.controller.ts

import { Body, Controller, Delete, Get, HttpException, Post as HttpPost, HttpStatus, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from 'src/shared/interface/create-post.dto';
import { GetPostDto } from 'src/shared/interface/get-posts.dto';
import { PostsModel } from './posts.model';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly _postsService: PostsService
  ) { }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })

  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any): Promise<PostsModel> {
    // Verifica se req.user está definido
    if (!req.user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    // Verifica se req.user.sub está definido
    const userId = req.user.sub;
    // if (!userId) {
    //   throw new HttpException(`User fuck ${userId}`, HttpStatus.UNAUTHORIZED);
    // }
    console.log(userId + '  falahu aknbaaas')

    createPostDto.userId = userId;

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

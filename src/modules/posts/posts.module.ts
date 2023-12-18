import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './posts.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}

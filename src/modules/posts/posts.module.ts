import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './posts.model';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(PostsController);
  }
}

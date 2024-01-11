import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './posts.model';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';
import { UserSchema } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema  }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, UsersService]
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(PostsController);
  }
}

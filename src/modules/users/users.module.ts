import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { PostsSchema } from '../posts/posts.model';
 
@Module({
  imports: [
    PostsModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, AuthService,JwtService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

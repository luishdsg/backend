import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/auth/jwt/jwt.module';
import { PostsModule } from './modules/posts/posts.module';

// const MONGO_API = process.env.MONGO_API + "retryWrites=true&w=majority"

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://adm:462p0h8fJRzMKLSE@adm.6jacvht.mongodb.net/?retryWrites=true&w=majority"),
    AuthModule,
    UsersModule,
    PostsModule,
    JwtModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthMiddleware } from './modules/auth/middleware/auth.middleware';
import { ConfigModule } from '../config/config.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://adm:462p0h8fJRzMKLSE@adm.6jacvht.mongodb.net/?retryWrites=true&w=majority"),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PostsModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(AppController);
  }
}

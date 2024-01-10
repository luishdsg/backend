import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/user.model';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzdmcyeWE0QUAiLCJuYW1lIjoiTG91aXMiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoiNDAwMjg5MjIifQ.ARa3swrAj0QB4tLhRcxkdh6NwNx5wl456S7rilkb0jNlChu7KmHyuGnM34WQJLZAuuJiXxptH8ks_H0HUYgdY8r1AHU_UTWFXQkMc1-kGnd1YYuILFhVwSmLToC8HGfl1q6jcJhP3qbL6_bf_DGSfycR83ajSpnGG-5LWp91qnBv-T8_',
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule],
})
export class AuthModule { }

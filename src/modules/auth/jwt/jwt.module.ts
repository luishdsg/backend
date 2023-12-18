// jwt/jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJwtModule.register({
    secret: 'your-secret-key',
    signOptions: { expiresIn: '1h' },
  })],
  exports: [NestJwtModule], 
})
export class JwtModule {}

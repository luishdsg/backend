// auth/jwt/jwt.strategy.ts

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }
  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: any) {
    this.logger.debug(`Trying to validate user `);
    try {
      const user = await this.authService.validateUserById(payload.sub);
      if (!user) {
        this.logger.debug(`User not found`);
        throw new NotFoundException('User not found');
        return null;
      }
      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }
}

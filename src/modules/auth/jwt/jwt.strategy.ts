// auth/jwt/jwt.strategy.ts

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserPayload } from 'src/shared/interface/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: UserPayload) {
    this.logger.debug(`Trying to validate user ${ process.env.JWT_SECRET} `);
    try {
      const user = await this.authService.validateUserById(payload.sub);
      if (!user) {
        this.logger.debug(`User not found`);
        return null;
      }
      return user.toJSON();
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }
}

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserPayload } from 'src/shared/interface/user-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzdmcyeWE0QUAiLCJuYW1lIjoiTG91aXMiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoiNDAwMjg5MjIifQ.ARa3swrAj0QB4tLhRcxkdh6NwNx5wl456S7rilkb0jNlChu7KmHyuGnM34WQJLZAuuJiXxptH8ks_H0HUYgdY8r1AHU_UTWFXQkMc1-kGnd1YYuILFhVwSmLToC8HGfl1q6jcJhP3qbL6_bf_DGSfycR83ajSpnGG-5LWp91qnBv-T8_',
    }); 
  }

  async validate(payload: UserPayload): Promise<any>  {
    this.logger.debug(`Trying to validate user ${ process.env.JWT_SECRET} `);

    try {
      const user = await this.authService.validateUserById(payload.sub);
      if (!user) {
        this.logger.debug(`User not found for ID: ${payload.sub}`);
        throw new UnauthorizedException('Usuário não autorizado');
      }
      // return user.toJSON();
      return user;
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }
}

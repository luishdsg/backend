import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserPayload } from 'src/shared/interface/user-payload.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private privateKey: Buffer;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    ) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzdmcyeWE0QUAiLCJuYW1lIjoiTG91aXMiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoiNDAwMjg5MjIifQ.ARa3swrAj0QB4tLhRcxkdh6NwNx5wl456S7rilkb0jNlChu7KmHyuGnM34WQJLZAuuJiXxptH8ks_H0HUYgdY8r1AHU_UTWFXQkMc1-kGnd1YYuILFhVwSmLToC8HGfl1q6jcJhP3qbL6_bf_DGSfycR83ajSpnGG-5LWp91qnBv-T8_',
    });
  }
  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: UserPayload) {
    this.logger.debug(`Trying to validate user ${ process.env.JWT_SECRET} `);
    console.log(`JWTs: ${process.env.JWT_SECRET}`)
    console.log(`JWT: ${this.configService.get<string>('PRIVATE_KEY')}`)

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

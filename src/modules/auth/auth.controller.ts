import { Controller, Post, Body, HttpException, HttpStatus,  Logger, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/shared/interface/login.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private  authService: AuthService,
    ) { }
  private readonly logger = new Logger(AuthController.name);

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Post('login')
  async login(@Body() login: LoginUserDto) {
    this.logger.debug(`tentou fazer login`);
    try {
      const token = await this.authService.login(login);
      this.logger.debug(`tentou fazer login${login}`);
      return token;
    } catch (error) {
      this.logger.error(`Error no login: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}


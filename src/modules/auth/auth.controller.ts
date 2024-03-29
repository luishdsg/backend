import { Body, Controller, HttpException, HttpStatus, Logger, Post, Res, } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as cookie from 'cookie';
import { LoginUserDto } from 'src/shared/interface/login.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }
  private readonly logger = new Logger(AuthController.name);

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Post('login')
  async login(@Body() login: LoginUserDto, @Res() response: Response) {
    this.logger.debug(`tentou fazer login`);
    try {
      const token = await this.authService.login(login,response);
      this.logger.debug(`tentou fazer login${login}${response}`);
      return token;
    } catch (error) {
      this.logger.error(`Error no login: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}


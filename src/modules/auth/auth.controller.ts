import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/shared/interface/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Post('login')
  async login(@Body() login: LoginUserDto) {
    this.logger.debug(`Received login request for username: ${login.username}`);

    console.log('Received credentials:', login);
    try {
      const user = await this.authService.validateUser(login.username, login.password);
      return user;
    } catch (error) {
        
      this.logger.error(`Error during login: ${error.message}`);
      console.log("deu ruiom login");
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}


import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Request
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UsersService } from './users.service';



@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }
  private readonly logger = new Logger(JwtStrategy.name);
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      
      const newUser = await this.usersService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Tratar usuário não encontrado
        return { statusCode: 404, message: error.message };
      }
      // Log do erro
      console.error(`Error in findByUsername: ${error.message}`);
      // Retornar resposta de erro genérica
      return { statusCode: 500, message: 'Internal server error' };
    }
  }
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get()
  async findAll() {
    return await this.usersService.findAllUsers();
  }


  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }


  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: GetUsersDto) {
    return await this.usersService.updateUses(id, updateUser);
  }

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get()
  async getProfile(@Request() req) {
    this.logger.debug(`puta q pariu`);
    try {
      const userId = req.user.sub;
      const user = await this.authService.validateUserById(userId);
      if (!user) {
        this.logger.debug(`puta q pariu`);
        throw new NotFoundException('User not found');
      }
      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      this.logger.debug(`puta q pariu`);
      throw error;
    }
  }

  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}

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
  Query,
  Request
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UsersService } from './users.service';
import { UserModel } from './user.model';



@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly authService: AuthService,
  ) { }
  private readonly logger = new Logger(JwtStrategy.name);




  @ApiResponse({ status: 200, description: 'Create User' })
  @ApiOperation({ summary: 'Create User' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this._usersService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }



  @ApiResponse({ status: 200, description: 'List all users by usename' })
  @ApiOperation({ summary: 'List all users by usename' })
  @Get('/username:username')
  async findByUsername(@Param('username') username: string) {
    try {
      const user = await this._usersService.findByUsername(username);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { statusCode: 404, message: error.message };
      }
      console.error(`Error in findByUsername: ${error.message}`);
      return { statusCode: 500, message: 'Internal server error' };
    }
  }


  @ApiResponse({ status: 200, description: 'List all Users' })
  @ApiOperation({ summary: 'List all Users' })
  @Get()
  async findAll() {
    return await this._usersService.findAllUsers();
  }

  @ApiResponse({ status: 200, description: 'GEt all users per page' })
  @ApiOperation({ summary: 'GEt all users per page' })
  @Get('per-page')
  async findAllPostById(
    @Query('page') page: number = 1,
  ): Promise<UserModel[]> {
    return await this._usersService.findAllUserPerPage(page);
  }


  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Get('byId/:id')
  async findUserById(@Param('id') id: string) {
    try {
      const userId = await this._usersService.findUserById(id);
      return userId;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { statusCode: 404, message: error.message };
      }
      console.error(`Error in findByID: ${error.message}`);
      return { statusCode: 500, message: 'Internal server error' };
    }
  }


  @ApiResponse({ status: 200, description: 'Update follow user' })
  @ApiOperation({ summary: 'Update follow user' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: GetUsersDto) {
    return await this._usersService.updateUses(id, updateUser);
  }



  @ApiResponse({ status: 200, description: 'follow user' })
  @ApiOperation({ summary: 'follow user' })
  @Post(':followerId/follow/:followingId')
  async followUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ): Promise<UserModel> {
    try {
      return await this._usersService.followUser(followerId, followingId);
    } catch (err) {
      this.logger.debug(`follow de error`);
      throw err;
    }
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
    return await this._usersService.deleteUser(id);
  }
}

import {
  Get,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
  Logger,
  Request,
  NotFoundException,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';



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
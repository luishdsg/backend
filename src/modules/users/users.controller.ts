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
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UsersService } from './users.service';
import { UserModel } from './user.model';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUserForCommentsDto } from 'src/shared/interface/get-user-for-comments.dto';



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



  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'follow user' })
  @ApiOperation({ summary: 'follow user' })
  @Post(':follower/follow/:followed')
  async followUser(
    @Param('follower') follower: string,
    @Param('followed') followed: string,
  ): Promise<void> {
    try {
      return await this._usersService.followUser(follower, followed);
    } catch (err) {
      this.logger.debug(`follow de error`);
      throw err;
    }
  }

  @ApiResponse({ status: 200, description: 'List all Users' })
  @ApiOperation({ summary: 'List all Users' })
  @Get()
  async findAll() {
    return await this._usersService.findAllUsers();
  }



  @ApiResponse({ status: 200, description: 'List all users by usename' })
  @ApiOperation({ summary: 'List all users by usename' })
  @Get('username:username')
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


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'GEt following by username' })
  @ApiOperation({ summary: 'GEt following by username' })
  @Get('following/:username')
  async findFollowingByUsername(@Param('username') username: string): Promise<Object[]> {
    try {
      const user = await this._usersService.findFollowingByUsername(username);
      return user;
    } catch (error) {
      this.logger.debug(`Followings não encontrados`);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Lista de IDs de usuários bloqueados'})
  @ApiOperation({ summary: 'Obtém a lista de IDs de usuários bloqueados' })
  @Get(':userId/blockedUserIds')
  async getBlockedUserIds(@Param('userId') userId: string): Promise<string[]> {
    try {
      const blockedUserIds = await this._usersService.getBlockedUserIds(userId);
      return blockedUserIds;
    } catch (error) {
      console.error(`Error in getBlockedUserIds controller: ${error.message}`);
      throw new HttpException('Erro ao obter a lista de IDs de usuários bloqueados', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Lista de usuários bloqueados' })
  @ApiOperation({ summary: 'Obtém a lista de usuários bloqueados' })
  @Get(':userId/blockedUsers')
  async getBlockedUsers(@Param('userId') userId: string): Promise<string[]> {
    try {
      const blockedUsers = await this._usersService.getBlockedUsers(userId);
      return blockedUsers;
    } catch (error) {
      console.error(`Error in getBlockedUsers controller: ${error.message}`);
      throw new HttpException('Erro ao obter a lista de usuários bloqueados', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'GEt all users per page' })
  @ApiOperation({ summary: 'GEt all users per page' })
  @Get('per-page')
  async findAllPostById(
    @Query('page') page: number = 1,
  ): Promise<UserModel[]> {
    return await this._usersService.findAllUserPerPage(page);
  }


  @ApiResponse({ status: 200, description: 'List users by id' })
  @ApiOperation({ summary: 'List users by id' })
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


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Find User By Id For Comments' })
  @ApiOperation({ summary: 'Find User By Id For Comments' })
  @Get('forComments/:id')
  async findUserByIdForComments(@Param('id') id: string): Promise<GetUserForCommentsDto> {
    try {
      const userIdForComments = await this._usersService.findUserByIdForComments(id);
      return { _id: userIdForComments._id, username: userIdForComments.username, photo: userIdForComments.photo, };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Post salvo nos favoritos do usuário', })
  @ApiOperation({ summary: 'Salva um post nos favoritos do usuário' })
  @Put(':userId/savePost/:postId')
  async savePostToSaved(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<UserModel> {
    try {
      const updatedUser = await this._usersService.savePostToSaved(userId, postId);
      return updatedUser;
    } catch (error) {
      console.error(`Error in savePostToSaved controller: ${error.message}`);
      throw new HttpException('Erro ao salvar o post nos favoritos do usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Post removido dos favoritos do usuário' })
  @ApiOperation({ summary: 'Remove um post dos favoritos do usuário' })
  @Put(':userId/removePost/:postId')
  async removePostFromSaved(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<UserModel> {
    try {
      const updatedUser = await this._usersService.removePostFromSaved(userId, postId);
      return updatedUser;
    } catch (error) {
      console.error(`Error in removePostFromSaved controller: ${error.message}`);
      throw new HttpException('Erro ao remover o post dos favoritos do usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Usuário adicionado à lista de bloqueados' })
  @ApiOperation({ summary: 'Adiciona um usuário à lista de bloqueados' })
  @Put(':userId/addUserToBlockList/:blockUserId')
  async addUserToBlockList(
    @Param('userId') userId: string,
    @Param('blockUserId') blockUserId: string,
  ): Promise<UserModel> {
    try {
      const updatedUser = await this._usersService.addUserToBlockList(userId, blockUserId);
      return updatedUser;
    } catch (error) {
      console.error(`Error in addUserToBlockList controller: ${error.message}`);
      throw new HttpException('Erro ao adicionar usuário à lista de bloqueados', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Usuário removido da lista de bloqueados' })
  @ApiOperation({ summary: 'Remove um usuário da lista de bloqueados' })
  @Put(':userId/removeUserFromBlockList/:unblockUserId')
  async removeUserFromBlockList(
    @Param('userId') userId: string,
    @Param('unblockUserId') unblockUserId: string,
  ): Promise<UserModel> {
    try {
      const updatedUser = await this._usersService.removeUserFromBlockList(userId, unblockUserId);
      return updatedUser;
    } catch (error) {
      console.error(`Error in removeUserFromBlockList controller: ${error.message}`);
      throw new HttpException('Erro ao remover usuário da lista de bloqueados', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'unfollow user' })
  @ApiOperation({ summary: 'unfollow user' })
  @Delete(':unfollower/unfollow/:unfollowed')
  async unfollowUser(
    @Param('unfollower') unfollower: string,
    @Param('unfollowed') unfollowed: string,
  ): Promise<void> {
    try {
      return await this._usersService.unfollowUser(unfollower, unfollowed);
    } catch (err) {
      this.logger.debug(`unfollow de error`);
      throw err;
    }
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'List all items' })
  @ApiOperation({ summary: 'List all items' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this._usersService.deleteUser(id);
    } catch (err) {
      this.logger.debug(`unfollow de error`);
      throw err;
    }
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { UserModel } from './user.model';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';
import { PostsModel } from '../posts/posts.model';
import { GetUserForCommentsDto } from 'src/shared/interface/get-user-for-comments.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly _userModel: Model<UserModel>,
    @InjectModel('Post')
    private readonly _postModel: Model<PostsModel>
  ) { }
  private readonly logger = new Logger(UsersService.name);

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this._userModel({ ...createUserDto, password: hashedPassword, });
    return newUser.save();
  }


  async findByUsername(username: string): Promise<UserModel> {
    try {
      const user = await this._userModel.findOne({ username }).exec();
      if (!user) {
        throw new NotFoundException(`User with username '${username}' not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error in findByUsername: ${error.message}`);
      throw error;
    }
  }

  async findFollowingByUsername(username: string): Promise<Object[]> {
    const user = await this._userModel.findOne({ username }).exec();
    if (!user) {
      console.error(`Error in findFollowingByUsername`);
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user.following;
  }



  async findAllUsers() {
    return await this._userModel.find().exec();
  }



  async findUserById(id: string): Promise<UserModel> {
    console.log(`Trying to find user with ID: ${id}`);
    try {
      const userId = await this._userModel.findById(id).exec();
      if (!userId) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }
      return userId;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }

  async findUserByIdForComments(id: string): Promise<GetUserForCommentsDto | null> {
    console.log(`Trying to find user with ID: ${id}`);
    try {
      const userIdForComments = await this._userModel.findById(id).exec();
      if (!userIdForComments) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }
      return {_id: userIdForComments._id,username: userIdForComments.username,photo: userIdForComments.photo,}
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }


  async getFavoriteUserIds(userId: string, page: number = 1): Promise<string[]> {
    try {
      const userGetFavoriteUserIds = await this._userModel.findById(userId);
      if (!userGetFavoriteUserIds) throw new NotFoundException('Usuário não encontrado');
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const favoriteUserIds = userGetFavoriteUserIds.favorites.slice(start, end).map(String);
      return favoriteUserIds;
    } catch (error) {
      console.error(`Error in getFavoriteUserIds service: ${error.message}`);
      throw new Error('Erro ao obter a lista de IDs dos usuários favoritos');
    }
  }



  async followUser(follower: string, followed: string): Promise<void> {
    try {
      const userfollower = await this._userModel.findById(follower);
      const userfollowed = await this._userModel.findById(followed);

      if (!userfollower || !userfollowed) {
        throw new NotFoundException('Usuário não encontrado');
      }
      userfollowed.followers.push(follower);
      await userfollowed.save();
      userfollower.following.push(followed);
      await userfollower.save();
      return;
    } catch (error) {
      this.logger.debug(`follow todo deu ruim`);
    }
  }


  async unfollowUser(unfollower: string, unfollowed: string): Promise<void> {
    try {
      const userUnfollower = await this._userModel.findById(unfollower);
      const userUnfollowed = await this._userModel.findById(unfollowed);
      if (!userUnfollower || !userUnfollowed) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Verifica se 'following' é um array antes de tentar acessar
      if (!userUnfollower.following || !Array.isArray(userUnfollower.following)) {
        throw new NotFoundException('Propriedade "following" inválida no usuário atual');
      }

      // Verifica se 'followers' é um array antes de tentar acessar
      if (!userUnfollowed.followers || !Array.isArray(userUnfollowed.followers)) {
        throw new NotFoundException('Propriedade "followers" inválida no usuário alvo');
      }
      // Remove o ID do usuário alvo do array 'following' do usuário atual
      userUnfollower.following = userUnfollower.following.filter((id) => id !== unfollowed);
      await userUnfollower.save();

      // Remove o ID do usuário atual do array 'followers' do usuário alvo
      userUnfollowed.followers = userUnfollowed.followers.filter((id) => id !== unfollower);
      await userUnfollowed.save();

    } catch (err) {
      this.logger.debug(`unfollow todo deu ruim`);

    }
  }

  async addToFavorites(userId: string, postId: string): Promise<void> {
    try {
      const userAddToFavorites = await this._userModel.findById(userId);
      if (!userAddToFavorites) throw new NotFoundException('Usuário não encontrado');
      userAddToFavorites.favorites.push(postId);
      await userAddToFavorites.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar post aos favoritos do usuário');
    }
  }

  async removeFromFavorites(userId: string, postId: string): Promise<void> {
    try {
      const userRemoveFavorites = await this._userModel.findById(userId);
      if (!userRemoveFavorites) throw new NotFoundException('Usuário não encontrado');
      userRemoveFavorites.favorites = userRemoveFavorites.favorites.filter((id) => id !== postId);
      await userRemoveFavorites.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover post dos favoritos do usuário');
    }
  }



  async addToHated(userId: string, postId: string): Promise<void> {
    try {
      const userAddToHated = await this._userModel.findById(userId);
      if (!userAddToHated) throw new NotFoundException('Usuário não encontrado');
      userAddToHated.hated.push(postId);
      await userAddToHated.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar post aos favoritos do usuário');
    }
  }

  async removeFromHated(userId: string, postId: string): Promise<void> {
    try {
      const userRemoveFromHated = await this._userModel.findById(userId);
      if (!userRemoveFromHated) throw new NotFoundException('Usuário não encontrado');
      userRemoveFromHated.hated = userRemoveFromHated.hated.filter((id) => id !== postId);
      await userRemoveFromHated.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover post dos favoritos do usuário');
    }
  }

  async addToComments(userId: string, postId: string): Promise<void> {
    try {
      const userAddToComments = await this._userModel.findById(userId);
      if (!userAddToComments) throw new NotFoundException('Usuário não encontrado');
      userAddToComments.comments.push(postId);
      await userAddToComments.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao adicionar post ao array "comments" do usuário');
    }
  }
  
  async removeFromComments(userId: string, postId: string): Promise<void> {
    try {
      const userRemoveComments = await this._userModel.findById(userId);
      if (!userRemoveComments) throw new NotFoundException('Usuário não encontrado');
      userRemoveComments.comments = userRemoveComments.comments.filter(commentId => commentId !== postId);
      await userRemoveComments.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao remover post do array "comments" do usuário');
    }
  }

  async findAllUserPerPage(page: number): Promise<UserModel[]> {
    try {
      const skipAmount = (page - 1) * 10;
      const usersPerPage = await this._userModel.find().skip(skipAmount).limit(10).exec();
      if (!usersPerPage) {
        console.error(`Error in paginate usersPerPage: ${usersPerPage}`);
      }
      return usersPerPage;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }

  async savePostToSaved(userId: string, postId: string): Promise<UserModel> {
    try {
      const user = await this._userModel.findById(userId);
      if (!user) throw new NotFoundException('Usuário não encontrado');
      if (!user.saved.includes(postId)) user.saved.push(postId);
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      console.error(`Error in savePostToSaved service: ${error.message}`);
      throw new Error('Erro ao salvar o post nos favoritos do usuário');
    }
  }

  async removePostFromSaved(userId: string, postId: string): Promise<UserModel> {
    try {
      const user = await this._userModel.findById(userId);
      if (!user) throw new NotFoundException('Usuário não encontrado');
      user.saved = user.saved.filter(savedPostId => savedPostId !== postId);
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      console.error(`Error in removePostFromSaved service: ${error.message}`);
      throw new Error('Erro ao remover o post dos favoritos do usuário');
    }
  }


  async addUserToBlockList(userId: string, blockUserId: string): Promise<UserModel> {
    try {
      const userAddUserToBlockList = await this._userModel.findById(userId);
      if (!userAddUserToBlockList) throw new NotFoundException('Usuário não encontrado');
      if (!userAddUserToBlockList.block.includes(blockUserId)) userAddUserToBlockList.block.push(blockUserId);
      const updatedUserBlocked = await userAddUserToBlockList.save();
      return updatedUserBlocked;
    } catch (error) {
      console.error(`Error in addUserToBlockList service: ${error.message}`);
      throw new Error('Erro ao adicionar usuário à lista de bloqueados');
    }
  }



  async removeUserFromBlockList(userId: string, unblockUserId: string): Promise<UserModel> {
    try {
      const userRemoveUserFromBlockList = await this._userModel.findById(userId);
      if (!userRemoveUserFromBlockList) throw new NotFoundException('Usuário não encontrado');
      userRemoveUserFromBlockList.block = userRemoveUserFromBlockList.block.filter((blockedUserId) => blockedUserId !== unblockUserId);
      const updatedUserUnBlocked = await userRemoveUserFromBlockList.save();
      return updatedUserUnBlocked;
    } catch (error) {
      console.error(`Error in addUserToBlockList service: ${error.message}`);
      throw new Error('Erro ao adicionar usuário à lista de bloqueados');
    }
  }


  async getBlockedUsers(userId: string): Promise<string[]> {
    try {
      const userGetBlockedUsers = await this._userModel.findById(userId);
      if (!userGetBlockedUsers) throw new NotFoundException('Usuário não encontrado');
      const blockedUserIds = userGetBlockedUsers.block.map(String);
      return blockedUserIds;
    } catch (error) {
      console.error(`Error in getBlockedUsers service: ${error.message}`);
      throw new Error('Erro ao obter a lista de usuários bloqueados');
    }
  }



  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this._userModel.findById(userId).exec();
      if (!user) throw new NotFoundException('User not found');
      await this._postModel.deleteMany({ userId: userId }).exec();
      await this._userModel.findByIdAndDelete(userId);
    } catch (err) {
      console.error(`Error in findById: ${err.message}`);
      throw err;
    }

  }


  async addPostToUser(userId: String, postId: Types.ObjectId): Promise<UserModel | null> {
    try {
      const user = await this._userModel.findById(userId).exec();
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      user.posts.push(postId);
      const done = await user.save();
      if (!done) {
        this.logger.debug(`não salvou o id post`);
      }
      return user;
    } catch (error) {
      console.error(`Erro ao adicionar post ao usuário: ${error.message}`);
      throw error;
    }
  }

  async updatePostsArray(userId: String, postId: String): Promise<void> {
    await this._userModel.updateOne(
      { _id: userId },
      { $pull: { posts: postId } }
    );
  }
}

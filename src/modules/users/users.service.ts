import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from 'src/shared/interface/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') 
    private readonly userModel: Model<UserModel>,
    ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const createdAt = new Date();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ 
      ...createUserDto,
      password: hashedPassword,
      createdAt,
    });
    return newUser.save();
  }

  async findAllUsers() {
    return await this.userModel.find().exec();
  }

  async findUserById(id: string): Promise<UserModel> {
    return await this.userModel.findById(id).exec();
  }

  async updateUses(id: string, newUser: GetUsersDto) {
    return await this.userModel.findByIdAndUpdate(id, newUser, { new: true });
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}

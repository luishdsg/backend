import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDto } from 'src/shared/interface/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

   async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id) {
    return await this.userModel.findById(id).exec();
  }

  async update(id, newUser) {
    return await this.userModel.findByIdAndUpdate(id, newUser, { new: true });
  }

  async delete(id) {
    return await this.userModel.findByIdAndDelete(id);
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  private readonly logger = new Logger(AuthService.name);
 
  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`Trying to validate user with username: ${username}`);

    try {
      const user = await this.userModel.findOne({ username }).exec();

      if (!user) {
        this.logger.debug(`User not found for username: ${username}`);
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.debug(`Invalid password for username: ${username}`);
        throw new NotFoundException('Invalid credentials');
      }

      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }
}

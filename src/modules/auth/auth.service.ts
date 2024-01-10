import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UserModel } from '../users/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/shared/interface/login.dto';
import { Response } from 'express';
import * as cookie from 'cookie';
import { UserPayload } from 'src/shared/interface/user-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) { }

  private readonly logger = new Logger(AuthService.name);
  async login(loginUserDto: LoginUserDto, response: Response): Promise<{ accessToken: string }> {
    const userLogin: UserModel = await this.validateUser(loginUserDto.username, loginUserDto.password);
  
    const payload: UserPayload = { username: userLogin.username, sub: userLogin._id };
    const accessToken = this.jwtService.sign(payload);
  
    const usernamedata = cookie.serialize('usernamedata', payload.username);
    response.setHeader('usernamedata', usernamedata);
    const foi = response.setHeader('Authorization', `Bearer ${accessToken}`);
    const suu = response.json({ success: true, usernamedata, accessToken});
    if(foi || suu){
    this.logger.debug(`BOAVIADO`);
      
    }
    this.logger.debug(`Tokene: ${accessToken}`);
  
    return { accessToken };
  }
  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`Trying to validate user with username: ${username}`);

    try {
      const userValidade = await this.userModel.findOne({ username }).exec();

      if (!userValidade) {
        this.logger.debug(`User not found for username: ${username}`);
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, userValidade.password);

      if (!isPasswordValid) {
        this.logger.debug(`Invalid password for username: ${username}`);
        throw new NotFoundException('Invalid credentials');
      }

      const { password: _, ...result } = userValidade.toObject();
    this.logger.debug(`result: ${result}`);

      return result;
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }
  async validateUserById(userId: string): Promise<UserModel> {
    this.logger.debug(`Trying to validate user with userId: ${userId}`);
    try {
      const userValidateUserById = await this.userModel.findById(userId).exec();
      if (!userValidateUserById) {
        this.logger.debug(`User not found for userId: ${userId}`);
        throw new NotFoundException('User not found');
      }
      return userValidateUserById;
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw error;
    }
  }



}

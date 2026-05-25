import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { User } from './schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({
      email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User Registered',
      user,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  validateToken(token: string): {
    sub: string;
    name: string;
    email: string;
  } {
    return this.jwtService.verify<{
      sub: string;
      name: string;
      email: string;
    }>(token);
  }
}

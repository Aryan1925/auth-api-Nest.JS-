import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(
      body.name,
      body.email,
      body.password,
    );
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('profile')
  profile(
    @Headers('authorization')
    auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('Token Missing');
    }

    const token = auth.split(' ')[1];

    const user = this.authService.validateToken(token);

    return {
      message: 'Protected Data',
      user,
    };
  }
}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User, UserSchema } from './schema/user.schema';

import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from './jwt.strategy';

import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallbackSecret',
      signOptions: {
        expiresIn: '7d',
      },
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy,],

  exports: [AuthService],
})
export class AuthModule {}

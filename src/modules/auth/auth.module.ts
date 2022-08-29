import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Clients } from './../entities/clients.entity';
import { ForgotPassword } from '../entities/forgot-password.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOauthModule } from 'src/modules/auth/google-oauth/google-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, ForgotPassword, Freelancer, Clients]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '7200s' },
    }),
    GoogleOauthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

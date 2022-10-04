import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ForgotPassword } from 'src/modules/entities/forgot-password.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOauthModule } from 'src/modules/auth/google-oauth/google-oauth.module';
import { JwtRefreshTokenStrategy } from 'src/modules/auth/strategies/jwt-refresh-token.strategy';
import { FilesService } from 'src/modules/file/file.service';
import PublicFile from 'src/modules/file/entities/publicFile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, ForgotPassword, Freelancer, PublicFile]),
    JwtModule.register({}),
    forwardRef(() => GoogleOauthModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy, FilesService],
  exports: [AuthService],
})
export class AuthModule {}

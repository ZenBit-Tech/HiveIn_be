import {
  Body,
  Controller,
  Request,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/modules/auth/guards/jwt-refresh.guard';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { AuthRestorePasswordDto } from './dto/restore-password.dto';
import { AuthRequest } from 'src/utils/@types/AuthRequest';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('private')
  privateRoute(@Request() req) {
    return `Your email, ${req.user.email}`;
  }

  @HttpCode(200)
  @Post('sign-up')
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('log-out')
  async logOut(@Req() req: AuthRequest) {
    return await this.authService.removeRefreshToken(req.user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: AuthRequest) {
    return this.authService.getJwtAccessToken(req.user.id);
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @HttpCode(200)
  @Patch('restore-password')
  async restorePassword(@Body() dto: AuthRestorePasswordDto) {
    return this.authService.restorePassword(dto);
  }
}

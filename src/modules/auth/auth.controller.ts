import {
  Body,
  Controller,
  Request,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { AuthRestorePasswordDto } from './dto/restore-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  @UseGuards(AuthGuard('jwt'))
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

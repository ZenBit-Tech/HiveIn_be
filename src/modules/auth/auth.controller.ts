import {
  Body,
  Controller,
  Request,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}

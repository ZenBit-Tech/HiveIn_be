import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOauthService } from 'src/modules/auth/google-oauth/google-oauth.service';
import { GoogleOauthGuard } from 'src/modules/auth/google-oauth/guards/google-oauth.guard';
import { GoogleUser } from 'src/modules/auth/google-oauth/strategies/google-oauth.strategy';

export interface GoogleReq extends Request {
  user: GoogleUser;
}

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private googleOauthService: GoogleOauthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: GoogleReq) {
    return this.googleOauthService.googleSignUp(req);
  }
}

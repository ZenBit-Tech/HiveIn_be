import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleOauthService } from 'src/modules/auth/google-oauth/google-oauth.service';
import { GoogleOauthSessionGuard } from 'src/modules/auth/google-oauth/guards/google-oauth-session.guard';
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

  // @Redirect(process.env.FRONTEND_REDIRECT_URL, 301)
  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: GoogleReq, @Res() res: Response) {
    return this.googleOauthService.googleSignUp(req, res);
  }

  @Get('success')
  @UseGuards(GoogleOauthSessionGuard)
  async sucess(@Req() req: GoogleReq) {
    return this.googleOauthService.googleSignIn(req);
  }
}

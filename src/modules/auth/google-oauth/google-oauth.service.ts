import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { GoogleReq } from 'src/modules/auth/google-oauth/google-oauth.controller';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class GoogleOauthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly authService: AuthService,
  ) {}

  async googleSignUp(req: GoogleReq, res: Response) {
    const { googleId, email, firstName, lastName } = req.user;

    const googleUser = await this.userRepo.findOneBy({ googleId });

    if (!googleUser) {
      await this.userRepo.save({
        email,
        googleId,
        password: '',
        firstName,
        lastName,
        phone: '',
      });

      return res.redirect(301, process.env.FRONTEND_SIGN_UP_REDIRECT_URL);
    }

    return res.redirect(301, process.env.FRONTEND_SIGN_IN_REDIRECT_URL);
  }

  async googleSignIn(req: GoogleReq) {
    const { googleId } = req.user;

    const { id } = await this.userRepo.findOneBy({ googleId });

    const accessToken = await this.authService.getJwtAccessToken(id);
    const refreshToken = await this.authService.getJwtRefreshToken(id);

    await this.authService.setCurrentRefreshToken(refreshToken, id);

    return { accessToken, refreshToken };
  }

  async findUserByGoogleID(googleId: string) {
    return this.userRepo.findOneBy({ googleId });
  }
}

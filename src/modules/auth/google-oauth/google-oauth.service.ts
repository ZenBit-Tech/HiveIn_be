import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { GoogleReq } from 'src/modules/auth/google-oauth/google-oauth.controller';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class GoogleOauthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
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

    const { id, email, role } = await this.userRepo.findOneBy({ googleId });

    return {
      token: this.jwtService.sign({
        sub: id,
        email,
      }),
      email,
      role,
    };
  }

  async findUserByGoogleID(googleId: string) {
    return this.userRepo.findOneBy({ googleId });
  }
}

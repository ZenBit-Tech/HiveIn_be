import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { GoogleReq } from 'src/modules/auth/google-oauth/google-oauth.controller';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleOauthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async googleSignUp(req: GoogleReq) {
    const { googleId, email } = req.user;

    const googleUser = await this.authRepo.findOneBy({ googleId });

    if (!googleUser) {
      const newUser = await this.authRepo.save({
        email,
        googleId,
        password: '',
      });

      return this.googleSignIn(newUser);
    }

    return this.googleSignIn(googleUser);
  }

  async googleSignIn(googleUser: Users) {
    const { id, email } = googleUser;

    return {
      token: this.jwtService.sign({
        sub: id,
        email,
      }),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { GoogleOauthService } from 'src/modules/auth/google-oauth/google-oauth.service';
import { Users } from 'src/modules/entities/users.entity';

@Injectable()
export class GoogleOAuthSerializer extends PassportSerializer {
  constructor(private googleOauthService: GoogleOauthService) {
    super();
  }

  serializeUser(user: Users, done: (err: Error, user: Users) => void) {
    done(null, user);
  }

  async deserializeUser(user: Users, done: (err: Error, user: Users) => void) {
    const userDB = await this.googleOauthService.findUserByGoogleID(
      user.googleId,
    );

    return userDB ? done(null, user) : done(null, null);
  }
}

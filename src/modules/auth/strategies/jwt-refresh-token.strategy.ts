import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPayload } from 'src/modules/auth/auth.service';
import { Users } from 'src/modules/entities/users.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  // Attach the return object to req.user
  async validate(req: Request, payload: TokenPayload): Promise<Users> {
    const authorization = req.headers['authorization'];

    if (!authorization) throw new UnauthorizedException();

    const refreshToken = authorization.replace('Bearer', '').trim();

    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}

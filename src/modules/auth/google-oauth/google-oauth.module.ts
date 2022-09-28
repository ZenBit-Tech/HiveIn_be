import { forwardRef, Module } from '@nestjs/common';
import { GoogleOauthStrategy } from 'src/modules/auth/google-oauth/strategies/google-oauth.strategy';
import { GoogleOauthController } from 'src/modules/auth/google-oauth/google-oauth.controller';
import { GoogleOauthService } from 'src/modules/auth/google-oauth/google-oauth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { GoogleOAuthSerializer } from 'src/modules/auth/google-oauth/serializers/google-oauth.serializer';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({
      session: true,
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthService, GoogleOauthStrategy, GoogleOAuthSerializer],
})
export class GoogleOauthModule {}

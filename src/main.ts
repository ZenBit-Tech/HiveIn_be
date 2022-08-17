import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: 'http://localhost:3000' });
  app.use(
    session({
      name: 'GoogleOAuth',
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 120000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(4000);
}
bootstrap();

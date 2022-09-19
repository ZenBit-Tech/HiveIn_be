import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth = require('express-basic-auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, process.env.DNS_URL],
  });
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
  app.use(
    '/docs',
    expressBasicAuth({
      challenge: true,
      users: { admin: '1234' },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('GetJob backend')
    .setDescription('app')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Auth',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.API_PORT || 4000);
}
bootstrap();

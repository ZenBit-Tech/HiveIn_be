import { ClientModule } from './modules/client/client.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { SettingsInfoModule } from './modules/settings-info/settings-info.module';
import { FreelancerModule } from './modules/freelancer/freelancer.module';
import { CategoryModule } from './modules/category/category.module';
import { SkillModule } from './modules/skill/skill.module';
import { AvatarModule } from './modules/avatar/avatar.module';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { JobPostModule } from './modules/job-post/job-post.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketService } from './services/websocket/websocket.service';
import { NotificationsService } from './modules/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule, ClientModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DB_NAME'),
        entities: [__dirname + '/entities/**/*.entity{.ts, .js}'],
        migrations: [__dirname + '/migrations/*{.ts, .js}'],
        logging: true,
        migrationsRun: false,
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.sendgrid.net',
          auth: {
            user: 'apikey',
            pass: configService.get<string>('SEND_GRID_KEY'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: '/uploads',
    }),
    AuthModule,
    ClientModule,
    SettingsInfoModule,
    FreelancerModule,
    CategoryModule,
    SkillModule,
    JobPostModule,
    AvatarModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketService],
})
export class AppModule {}

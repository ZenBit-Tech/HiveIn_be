import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientModule } from 'src/modules/client/client.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SettingsInfoModule } from 'src/modules/settings-info/settings-info.module';
import { FreelancerModule } from 'src/modules/freelancer/freelancer.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { SkillModule } from 'src/modules/skill/skill.module';
import { AvatarModule } from 'src/modules/avatar/avatar.module';
import { JobPostModule } from 'src/modules/job-post/job-post.module';
import { ProposalModule } from 'src/modules/proposal/proposal.module';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { OfferModule } from 'src/modules/offer/offer.module';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';

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
        timezone: 'Z',
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
    ProposalModule,
    ContractsModule,
    OfferModule,
    ChatRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

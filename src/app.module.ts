import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketService } from 'src/services/websocket/websocket.service';
import { DatabaseModule } from 'src/modules/database/database.module';
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
import { MessageModule } from './modules/message/message.module';
import { ChatConnectModule } from './modules/chat-room-connected/chat-connect.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
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
    DatabaseModule,
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
    NotificationsModule,
    OfferModule,
    ChatRoomModule,
    MessageModule,
    ChatConnectModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketService, JwtService],
})
export class AppModule {}

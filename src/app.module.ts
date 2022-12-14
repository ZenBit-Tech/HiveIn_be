import { TasksService } from 'src/modules/task.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { ClientModule } from 'src/modules/client/client.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SettingsInfoModule } from 'src/modules/settings-info/settings-info.module';
import { FreelancerModule } from 'src/modules/freelancer/freelancer.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { SkillModule } from 'src/modules/skill/skill.module';
import { JobPostModule } from 'src/modules/job-post/job-post.module';
import { ProposalModule } from 'src/modules/proposal/proposal.module';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { OfferModule } from 'src/modules/offer/offer.module';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { MessageModule } from 'src/modules/message/message.module';
import { WebsocketModule } from 'src/modules/websocket/websocket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './modules/chat-room/entities/chat-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
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
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    ClientModule,
    SettingsInfoModule,
    FreelancerModule,
    CategoryModule,
    SkillModule,
    JobPostModule,
    ProposalModule,
    ContractsModule,
    NotificationsModule,
    OfferModule,
    ChatRoomModule,
    MessageModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, TasksService],
})
export class AppModule {}

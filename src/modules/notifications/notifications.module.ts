import { Module } from '@nestjs/common';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsController } from 'src/modules/notifications/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { JwtService } from '@nestjs/jwt';
import { SettingsInfoService } from '../settings-info/settings-info.service';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { MessageService } from '../message/message.service';
import { Users } from '../entities/users.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Message } from '../message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Users,
      Freelancer,
      ChatRoom,
      Message,
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    JwtService,
    SettingsInfoService,
    ChatRoomService,
    MessageService,
  ],
  // exports: [NotificationsService],
})
export class NotificationsModule {}

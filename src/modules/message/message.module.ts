import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/modules/message/message.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/entities/notification.entity';
import { JwtService } from '@nestjs/jwt';
import { SettingsInfoService } from '../settings-info/settings-info.service';
import { Freelancer } from '../freelancer/entities/freelancer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      ChatRoom,
      Users,
      ChatRoom,
      Notification,
      Freelancer,
    ]),
  ],
  providers: [
    MessageService,
    ChatRoomService,
    NotificationsService,
    JwtService,
    SettingsInfoService,
  ],
  exports: [MessageService],
})
export class MessageModule {}

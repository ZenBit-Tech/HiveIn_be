import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsController } from 'src/modules/notifications/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Users } from '../entities/users.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Message } from '../message/entities/message.entity';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { MessageModule } from '../message/message.module';
import { SettingsInfoModule } from '../settings-info/settings-info.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Users,
      Freelancer,
      ChatRoom,
      Message,
    ]),
    ChatRoomModule,
    forwardRef(() => MessageModule),
    forwardRef(() => WebsocketModule),
    SettingsInfoModule,
    ChatRoomModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, ChatRoomService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

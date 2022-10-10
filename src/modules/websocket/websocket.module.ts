import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketService } from './websocket.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/users.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Message } from '../message/entities/message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { SettingsInfoModule } from '../settings-info/settings-info.module';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Freelancer,
      ChatRoom,
      Message,
      Notification,
    ]),
    forwardRef(() => NotificationsModule),
    SettingsInfoModule,
    ChatRoomModule,
    MessageModule,
  ],
  controllers: [],
  providers: [WebsocketService, JwtService],
  exports: [WebsocketService],
})
export class WebsocketModule {}

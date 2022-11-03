import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketService } from './websocket.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { SettingsInfoModule } from 'src/modules/settings-info/settings-info.module';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { MessageModule } from 'src/modules/message/message.module';

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
    forwardRef(() => MessageModule),
    forwardRef(() => ChatRoomModule),
    SettingsInfoModule,
  ],
  controllers: [],
  providers: [WebsocketService, JwtService],
  exports: [WebsocketService],
})
export class WebsocketModule {}

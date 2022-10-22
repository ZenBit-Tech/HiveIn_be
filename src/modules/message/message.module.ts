import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/modules/message/message.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { WebsocketModule } from '../websocket/websocket.module';

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
    forwardRef(() => NotificationsModule),
    forwardRef(() => WebsocketModule),
    forwardRef(() => ChatRoomModule),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

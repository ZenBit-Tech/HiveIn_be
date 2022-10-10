import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/modules/message/message.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { NotificationsModule } from '../notifications/notifications.module';

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
    ChatRoomModule,
    forwardRef(() => NotificationsModule),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

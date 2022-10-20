import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { MessageModule } from 'src/modules/message/message.module';
import { SettingsInfoModule } from 'src/modules/settings-info/settings-info.module';
import { WebsocketModule } from 'src/modules/websocket/websocket.module';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { OfferModule } from '../offer/offer.module';

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
    forwardRef(() => OfferModule),
    SettingsInfoModule,
    ChatRoomModule,
  ],
  controllers: [],
  providers: [NotificationsService, ChatRoomService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

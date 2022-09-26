import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinedRoomService } from 'src/modules/chat-room-connected/connected-room.service';
import { ConnectedUserService } from 'src/modules/chat-room-connected/connected-user.service';
import { ChatRoomConnected } from 'src/modules/chat-room-connected/entities/chat-room-connected.entity';
import { UserConnected } from 'src/modules/chat-room-connected/entities/user-connected.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JoinedRoomService,
      ConnectedUserService,
      ChatRoomConnected,
      UserConnected,
    ]),
  ],
  providers: [JoinedRoomService, ConnectedUserService],
  exports: [JoinedRoomService, ConnectedUserService],
})
export class ChatConnectModule {}

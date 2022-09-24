import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinedRoomService } from './connected-room.service';
import { ConnectedUserService } from './connected-user.service';
import { ChatRoomConnected } from './entities/chat-room-connected.entity';
import { UserConnected } from './entities/user-connected.entity';

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

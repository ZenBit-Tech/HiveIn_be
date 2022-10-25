import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomController } from 'src/modules/chat-room/chat-room.controller';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { OfferModule } from 'src/modules/offer/offer.module';
import { MessageModule } from 'src/modules/message/message.module';
import { WebsocketModule } from 'src/modules/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Users, Message]),
    forwardRef(() => OfferModule),
    forwardRef(() => MessageModule),
    forwardRef(() => WebsocketModule),
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}

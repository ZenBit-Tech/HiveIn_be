import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomController } from 'src/modules/chat-room/chat-room.controller';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Users, Message, ChatRoomService]),
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, Users],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/modules/message/message.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, Users, ChatRoomService]),
  ],
  providers: [MessageService, ChatRoomService],
  exports: [MessageService],
})
export class MessageModule {}

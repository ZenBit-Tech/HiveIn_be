import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Users } from '../entities/users.entity';
import { Message } from './entities/message';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Users, Message, ChatRoomService]),
  ],
  providers: [MessageService, ChatRoomService],
  controllers: [MessageController],
})
export class MessageModule {}

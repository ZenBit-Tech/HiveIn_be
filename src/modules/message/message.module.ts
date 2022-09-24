import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Users } from '../entities/users.entity';
import { Message } from './entities/message.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, Users, ChatRoomService]),
  ],
  providers: [MessageService, ChatRoomService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}

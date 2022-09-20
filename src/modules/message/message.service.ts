import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message';
import { Repository } from 'typeorm';
import { createMessageDto } from './dto/create-message.dto';
import { UserRole, Users } from '../entities/users.entity';
import {
  ChatRoom,
  chatRoomStatus,
} from '../chat-room/entities/chat-room.entity';
// import { ChatRoomService } from '../chat-room/chat-room.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) // private readonly chatRoomService: ChatRoomService,
  {}

  async create(data: createMessageDto): Promise<Message> {
    const user = await this.usersRepository.findOneBy({ id: data.userId });
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: data.chatRoomId,
    });

    if (
      user.role === UserRole.UNDEFINED ||
      (user.role === UserRole.CLIENT &&
        chatRoom.status === chatRoomStatus.FREELANCER_ONLY) ||
      (user.role === UserRole.FREELANCER &&
        chatRoom.status === chatRoomStatus.CLIENT_ONLY)
    )
      throw new ForbiddenException();

    if (
      (user.role === UserRole.CLIENT &&
        chatRoom.status === chatRoomStatus.CLIENT_ONLY) ||
      (user.role === UserRole.FREELANCER &&
        chatRoom.status === chatRoomStatus.FREELANCER_ONLY)
    ) {
    }
    return await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
    });
  }
}

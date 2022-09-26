import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { createMessageDto } from './dto/create-message.dto';
import { UserRole, Users } from '../entities/users.entity';
import {
  ChatRoom,
  chatRoomStatus,
} from '../chat-room/entities/chat-room.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  async create(data: createMessageDto): Promise<Message> {
    const user = await this.usersRepository.findOneBy({ id: data.userId });
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: data.chatRoomId,
    });

    if (user.role === UserRole.UNDEFINED) throw new ForbiddenException();

    if (
      (user.role === UserRole.CLIENT &&
        chatRoom.status === chatRoomStatus.FREELANCER_ONLY) ||
      (user.role === UserRole.FREELANCER &&
        chatRoom.status === chatRoomStatus.CLIENT_ONLY)
    )
      throw new HttpException(
        "This user can't send message to this room yet",
        400,
      );

    if (
      (user.role === UserRole.CLIENT &&
        chatRoom.status === chatRoomStatus.CLIENT_ONLY) ||
      (user.role === UserRole.FREELANCER &&
        chatRoom.status === chatRoomStatus.FREELANCER_ONLY)
    ) {
      await this.chatRoomService.changeStatus(data.chatRoomId);
    }

    return await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
      isSystemMessage: false,
    });
  }

  async createSystemMessage(data: createMessageDto): Promise<Message> {
    return await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
      isSystemMessage: true,
    });
  }

  async getAllByRoomId(id: number) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin(
        'message.chatRoom',
        'chat_room',
        'message.chatRoomId = chat_room.Id',
      )
      .leftJoinAndSelect('message.user', 'user')
      .where(`chat_room.id = ${id}`)
      .orderBy(`message.created_at`, 'ASC')
      .getMany();

    return messages.map((data) => {
      const { user, ...message } = data;
      return { ...message, senderId: user?.id };
    });
  }
}

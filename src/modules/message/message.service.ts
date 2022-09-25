import { ForbiddenException, Injectable } from '@nestjs/common';
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
      await this.chatRoomService.changeStatus(data.chatRoomId);
    }

    return await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
    });
  }

  async getAllByRoomId(id: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'message.chatRoom',
        'chat_room',
        'message.chatRoomId = chat_room.Id',
      )
      .leftJoinAndSelect('chat_room.jobPost', 'job_post')
      .leftJoinAndSelect('chat_room.freelancer', 'freelancer')
      .leftJoinAndSelect('job_post.user', 'client_user_profile')
      .leftJoinAndSelect('freelancer.user', 'freelancer_user_profile')
      .where(`chat_room.id = ${id}`)
      .getMany();
  }
}

import {
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/modules/message/entities/message.entity';
import { createMessageDto } from 'src/modules/message/dto/create-message.dto';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { MessageType, ReturnedMessage } from 'src/modules/message/typesDef';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { ProposalType } from '../proposal/entities/proposal.entity';
import { NotificationsService } from '../notifications/notifications.service';

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
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(data: createMessageDto): Promise<Message> {
    const user = await this.usersRepository.findOneBy({ id: data.userId });
    const chatRoom = await this.chatRoomService.getOneById(data.chatRoomId);

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
    const message = await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
      messageType: MessageType.FROM_USER,
    });

    const receiverUserId =
      chatRoom.freelancer.id === data.userId
        ? chatRoom.client.id
        : chatRoom.freelancer.id;

    await this.chatRoomService.updateAfterReceiveMessage(data.chatRoomId);
    await this.notificationsService.createMessageNotification(
      message.id,
      receiverUserId,
    );
    return message;
  }

  async createInitialMessages(
    chatRoomId: number,
    inviteFrom: number,
    inviteTo: number,
    type: ProposalType,
    message: string,
    bid: number,
  ): Promise<void> {
    await this.createSystemMessage({
      text: `You have received a new ${
        type === ProposalType.PROPOSAL ? 'proposal' : 'invite'
      }`,
      chatRoomId,
      userId: inviteTo,
    });
    const values = [
      {
        chatRoom: { id: chatRoomId },
        user: { id: inviteFrom },
        text: message,
        messageType: MessageType.FROM_USER,
      },
      {
        chatRoom: { id: chatRoomId },
        user: { id: inviteFrom },
        text: `bid: ${bid}`,
        messageType: MessageType.FROM_USER,
      },
    ];

    await this.messageRepository
      .createQueryBuilder('message')
      .insert()
      .into(Message)
      .values(values)
      .execute();

    const messages = await this.getAllByRoomId(chatRoomId);

    messages.map(async (message) => {
      await this.notificationsService.createMessageNotification(
        message.id,
        inviteTo,
      );
    });
  }

  async createSystemMessage(data: createMessageDto): Promise<Message> {
    return await this.messageRepository.save({
      text: data.text,
      chatRoom: { id: data.chatRoomId },
      user: { id: data.userId },
      messageType: MessageType.FROM_SYSTEM,
    });
  }

  async getAllByRoomId(id: number): Promise<ReturnedMessage[]> {
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

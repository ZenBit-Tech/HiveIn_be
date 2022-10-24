import {
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/modules/message/entities/message.entity';
import { createMessageDto } from 'src/modules/message/dto/create-message.dto';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { MessageType, ReturnedMessage } from 'src/modules/message/typesDef';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { ProposalType } from 'src/modules/proposal/entities/proposal.entity';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { constSystemMessages } from 'src/utils/systemMessages.consts';
import { Event, WebsocketService } from '../websocket/websocket.service';
import { Notification } from '../notifications/entities/notification.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => ChatRoomService))
    private chatRoomService: ChatRoomService,
    @Inject(forwardRef(() => WebsocketService))
    private wsService: WebsocketService,
  ) {}

  async create(data: createMessageDto): Promise<Message> {
    try {
      const user = await this.usersRepository.findOneBy({ id: data.userId });
      const chatRoom = await this.chatRoomService.getOneById(data.chatRoomId);

      if (!user || !chatRoom) throw new NotFoundException();

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
    } catch (error) {
      Logger.error('Error occurred while trying to create message.');
      if (error instanceof NotFoundException) {
        Logger.error('Most likely that is wrong chat room id / user id');
        throw new NotFoundException(error);
      } else if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createInitialMessages(
    chatRoomId: number,
    inviteFrom: number,
    inviteTo: number,
    type: ProposalType,
    message: string,
    bid: number,
  ): Promise<ReturnedMessage[]> {
    try {
      await this.createSystemMessage({
        text: `${constSystemMessages.messageToUser} ${
          type === ProposalType.PROPOSAL
            ? constSystemMessages.textProposal
            : constSystemMessages.textInvite
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

      await Promise.all(
        messages.map(async (message) => {
          return await this.notificationsService.createMessageNotification(
            message.id,
            inviteTo,
          );
        }),
      );

      return messages;
    } catch (error) {
      Logger.error('Error occurred while trying to create initial messages');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createSystemMessage(
    data: createMessageDto,
    shouldNotify?: boolean,
    shouldTriggerEvent?: boolean,
  ): Promise<Message> {
    try {
      const message = await this.messageRepository.save({
        text: data.text,
        chatRoom: { id: data.chatRoomId },
        user: { id: data.userId },
        messageType: MessageType.FROM_SYSTEM,
      });

      if (shouldNotify) {
        await this.notificationsService.createMessageNotification(
          message.id,
          data.userId,
        );
      }

      if (shouldTriggerEvent) {
        await this.wsService.triggerEventByUserId(
          data.userId,
          Event.ADD_MESSAGE,
        );
      }

      return message;
    } catch (error) {
      Logger.error('Error occurred while trying to create system message');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createSystemOfferMessage(
    data: createMessageDto,
    shouldNotify?: boolean,
    shouldTriggerEvent?: boolean,
  ): Promise<Message> {
    try {
      const message = await this.messageRepository.save({
        text: data.text,
        chatRoom: { id: data.chatRoomId },
        user: { id: data.userId },
        messageType: MessageType.FROM_SYSTEM_OFFER,
      });

      if (shouldNotify) {
        await this.notificationsService.createMessageNotification(
          message.id,
          data.userId,
        );
      }

      if (shouldTriggerEvent) {
        await this.wsService.triggerEventByUserId(
          data.userId,
          Event.ADD_MESSAGE,
        );
      }

      return message;
    } catch (error) {
      Logger.error(
        'Error occurred while trying to create system offer message',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async getAllByRoomId(id: number): Promise<ReturnedMessage[]> {
    try {
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
    } catch (error) {
      Logger.error('Error occurred while trying to query messages');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }
}

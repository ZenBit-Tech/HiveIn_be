import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import {
  Notification,
  NotificationType,
} from 'src/modules/notifications/entities/notification.entity';
import { ProposalType } from 'src/modules/proposal/entities/proposal.entity';
import { WebsocketService } from 'src/modules/websocket/websocket.service';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import {
  ICountOfNotifications,
  INotificationWithRoomId,
  TColumnToJoin,
  ICountedNotifications,
  ICountedParsedNotifications,
} from 'src/modules/notifications/typesDef';
import { constSystemMessages } from 'src/utils/systemMessages.consts';
import { OfferService } from 'src/modules/offer/offer.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => WebsocketService))
    private wsService: WebsocketService,
    private chatRoomService: ChatRoomService,
    @Inject(forwardRef(() => OfferService))
    private offerService: OfferService,
  ) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    try {
      const { foreignKey, userId, ...rest } = data;
      const foreignTableConnect = this.generateColumn(data.type, foreignKey);
      const notification = await this.notificationRepository.save({
        ...rest,
        ...foreignTableConnect,
        user: { id: userId },
      });

      await this.wsService.onAddNotification(userId);

      return notification;
    } catch (error) {
      Logger.error('Error occurred while trying to create notification');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createNewProposalNotification(
    proposalId: number,
    userId: number,
    type: ProposalType,
  ): Promise<Notification> {
    try {
      return await this.create({
        type: NotificationType.PROPOSAL,
        text: `${constSystemMessages.messageToUser} ${
          type === ProposalType.PROPOSAL
            ? constSystemMessages.textProposal
            : constSystemMessages.textInvite
        }`,
        foreignKey: proposalId,
        userId,
      });
    } catch (error) {
      Logger.error(
        'Error occurred while trying to create proposal notification',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createOfferNotification(
    offerId: number,
    userId: number,
    text: string,
  ): Promise<Notification> {
    try {
      return await this.create({
        type: NotificationType.OFFER,
        foreignKey: offerId,
        userId,
        text,
      });
    } catch (error) {
      Logger.error('Error occurred while trying to create offer notification');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async createMessageNotification(
    messageId: number,
    userId: number,
  ): Promise<Notification> {
    try {
      return await this.create({
        type: NotificationType.MESSAGE,
        foreignKey: messageId,
        userId,
        text: constSystemMessages.newMessage,
      });
    } catch (error) {
      Logger.error(
        'Error occurred while trying to create message notification',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  private generateColumn(type: NotificationType, id: number): TColumnToJoin {
    if (type === NotificationType.MESSAGE) return { message: { id } };
    if (type === NotificationType.OFFER) return { offer: { id } };
    if (type === NotificationType.PROPOSAL) return { proposal: { id } };
    Logger.error(
      'Error occurred while trying to generate column for notification. Wrong notification type passed',
    );
    throw new NotAcceptableException();
  }

  async getAllOwn(id: number): Promise<ICountedNotifications> {
    try {
      const [notifications, count] = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.userId = :id', { id })
        .getManyAndCount();

      return { notifications, count };
    } catch (error) {
      Logger.error('Error occurred while trying to get notifications from db');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async getAllOwnMessageType(
    id: number,
    isRead?: boolean,
  ): Promise<ICountedParsedNotifications> {
    try {
      const [notifications, count] = await this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.message', 'message')
        .where('notification.userId = :id', { id })
        .andWhere('notification.type = :type', {
          type: NotificationType.MESSAGE,
        })
        .andWhere(
          typeof isRead !== 'undefined'
            ? `notification.isRead = ${isRead}`
            : '1 = 1',
        )
        .getManyAndCount();

      const parsed = await this.parseArrayOfNotification(notifications);

      return {
        notifications: parsed,
        count,
      };
    } catch (error) {
      Logger.error(
        'Error occurred while trying to get message notifications from db',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async getAllOwnNotMessageType(
    id: number,
    isRead?: boolean,
  ): Promise<ICountedParsedNotifications> {
    try {
      const [notifications, count] = await this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.message', 'message')
        .leftJoinAndSelect('notification.offer', 'offer')
        .leftJoinAndSelect('notification.proposal', 'proposal')
        .leftJoinAndSelect('offer.jobPost', 'offerJP')
        .leftJoinAndSelect('proposal.jobPost', 'proposalJP')
        .leftJoinAndSelect('proposal.freelancer', 'freelancerOffer')
        .leftJoinAndSelect('offer.freelancer', 'freelancerProposal')
        .where('notification.userId = :id', { id })
        .andWhere('notification.type != :type', {
          type: NotificationType.MESSAGE,
        })
        .andWhere(
          typeof isRead !== 'undefined'
            ? `notification.isRead = ${isRead}`
            : '1 = 1',
        )
        .orderBy('notification.createdAt', 'DESC')
        .getManyAndCount();

      const parsedNotification = await this.parseArrayOfNotification(
        notifications,
      );

      return {
        notifications: parsedNotification,
        count,
      };
    } catch (error) {
      Logger.error(
        'Error occurred while trying to get not message notifications from db',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async getCount(id: number): Promise<ICountOfNotifications> {
    try {
      const { count: message } = await this.getAllOwnMessageType(id, false);
      const { count: other } = await this.getAllOwnNotMessageType(id, false);

      return { message, other };
    } catch (error) {
      Logger.error('Error occurred while trying to get notifications count');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async markAsRead(ids: number[]) {
    try {
      if (ids.length === 0) return;
      return await this.notificationRepository
        .createQueryBuilder('notification')
        .update(Notification)
        .set({ isRead: true })
        .where('notification.id IN (:ids)', { ids })
        .execute();
    } catch (error) {
      Logger.error('Error occurred while trying to mark notifications read');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async parseArrayOfNotification(
    notifications: Notification[],
  ): Promise<INotificationWithRoomId[]> {
    try {
      return await Promise.all(
        notifications.map(async (notification) => this.parseData(notification)),
      );
    } catch (error) {
      Logger.error(
        'Error occurred while trying to parse array of notifications',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  private async parseData(
    notification: Notification,
  ): Promise<INotificationWithRoomId> {
    try {
      if (notification.type === NotificationType.MESSAGE) {
        const roomId = await this.chatRoomService.getRoomIdByMessageId(
          notification.message.id,
        );

        return {
          ...notification,
          roomId,
        };
      }

      if (notification.type === NotificationType.OFFER) {
        const roomId =
          await this.chatRoomService.getRoomIdByJobPostAndFreelancerIds(
            notification.offer.jobPost.id,
            notification.offer.freelancer.id,
          );

        return {
          ...notification,
          roomId,
        };
      }

      if (notification.type === NotificationType.PROPOSAL) {
        const roomId =
          await this.chatRoomService.getRoomIdByJobPostAndFreelancerIds(
            notification.proposal.jobPost.id,
            notification.proposal.freelancer.id,
          );

        return {
          ...notification,
          roomId,
        };
      }
    } catch (error) {
      Logger.error('Error occurred while trying to parse notification object');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }

  async deleteById(id: number): Promise<DeleteResult> {
    try {
      return await this.notificationRepository.delete({ id });
    } catch (error) {
      Logger.error('Error occurred while deleting notification');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      else throw new InternalServerErrorException();
    }
  }
}

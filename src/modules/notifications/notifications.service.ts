import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import {
  Notification,
  NotificationType,
} from 'src/modules/notifications/entities/notification.entity';
import { ProposalType } from '../proposal/entities/proposal.entity';
import { WebsocketService } from '../websocket/websocket.service';
import { MessageService } from '../message/message.service';
import { ChatRoomService } from '../chat-room/chat-room.service';

type TResult =
  | { message: { id: number } }
  | { offer: { id: number } }
  | { proposal: { id: number } };

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    @Inject(forwardRef(() => WebsocketService))
    private wsService: WebsocketService,
    private chatRoomService: ChatRoomService,
  ) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    const { foreignKey, userId, ...rest } = data;
    const foreignTableConnect = this.generateColumn(data.type, foreignKey);
    const notification = await this.notificationRepository.save({
      ...rest,
      ...foreignTableConnect,
      user: { id: userId },
    });

    await this.wsService.onAddNotification(userId);

    return notification;
  }

  async createNewProposalNotification(
    proposalId: number,
    userId: number,
    type: ProposalType,
  ) {
    await this.create({
      type: NotificationType.PROPOSAL,
      text: `You have receive a new ${
        type === ProposalType.PROPOSAL ? 'proposal' : 'invite'
      }`,
      foreignKey: proposalId,
      userId,
    });
  }

  async createOfferNotification(offerId: number, userId: number, text: string) {
    await this.create({
      type: NotificationType.OFFER,
      foreignKey: offerId,
      userId,
      text,
    });
  }

  async createMessageNotification(messageId: number, userId: number) {
    return await this.create({
      type: NotificationType.MESSAGE,
      foreignKey: messageId,
      userId,
      text: 'New message',
    });
  }

  private generateColumn(type: NotificationType, id: number): TResult {
    if (type === NotificationType.MESSAGE) return { message: { id } };
    if (type === NotificationType.OFFER) return { offer: { id } };
    return { proposal: { id } };
  }

  async getAllOwn(
    id: number,
  ): Promise<{ notifications: Notification[]; count: number }> {
    const [notifications, count] = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .getManyAndCount();

    return { notifications, count };
  }

  async getAllOwnMessageType(
    id: number,
    isRead?: boolean,
  ): Promise<{ notifications: any; count: number }> {
    const [notifications, count] = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.message', 'message')
      .where('notification.userId = :id', { id })
      .andWhere('notification.type = :type', { type: NotificationType.MESSAGE })
      .andWhere(
        typeof isRead !== 'undefined'
          ? `notification.isRead = ${isRead}`
          : '1 = 1',
      )
      .getManyAndCount();
    for (let i = 0; i < notifications.length; i++) {
      notifications[i] = await this.parseData(notifications[i]);
    }
    return {
      notifications,
      count,
    };
  }

  async getAllOwnNotMessageType(
    id: number,
    isRead?: boolean,
  ): Promise<{ notifications: any; count: number }> {
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

    for (let i = 0; i < notifications.length; i++) {
      notifications[i] = await this.parseData(notifications[i]);
    }
    return {
      notifications,
      count,
    };
  }

  async getCount(id: number) {
    const { count: message } = await this.getAllOwnMessageType(id, false);
    const { count: other } = await this.getAllOwnNotMessageType(id, false);

    return { message, other };
  }

  async markAsRead(ids: number[]) {
    if (ids.length === 0) return;
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .update(Notification)
      .set({ isRead: true })
      .where('notification.id IN (:ids)', { ids })
      .execute();
  }

  private async parseData(notification: Notification): Promise<any> {
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
  }

  async deleteById(id: number) {
    return await this.notificationRepository.delete({ id });
  }
}

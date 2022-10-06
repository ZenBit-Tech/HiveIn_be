import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import {
  Notification,
  NotificationType,
} from 'src/modules/notifications/entities/notification.entity';

type TResult =
  | { message: { id: number } }
  | { offer: { id: number } }
  | { proposal: { id: number } };

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    const { foreignKey, userId, ...rest } = data;
    const foreignTableConnect = this.generateColumn(data.type, foreignKey);
    return await this.notificationRepository.save({
      ...rest,
      ...foreignTableConnect,
      user: { id: userId },
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
  ): Promise<{ notifications: Notification[]; count: number }> {
    const [notifications, count] = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .andWhere('notification.type = :type', { type: NotificationType.MESSAGE })
      .andWhere(
        typeof isRead !== 'undefined'
          ? `notification.isRead = ${isRead}`
          : '1 = 1',
      )
      .getManyAndCount();

    return { notifications, count };
  }

  async getAllOwnNotMessageType(
    id: number,
    isRead?: boolean,
  ): Promise<{ notifications: Notification[]; count: number }> {
    const [notifications, count] = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .andWhere('notification.type != :type', {
        type: NotificationType.MESSAGE,
      })
      .andWhere(
        typeof isRead !== 'undefined'
          ? `notification.isRead = ${isRead}`
          : '1 = 1',
      )
      .getManyAndCount();

    return { notifications, count };
  }

  async getCount(id: number) {
    const { count: message } = await this.getAllOwnMessageType(id, false);
    const { count: other } = await this.getAllOwnNotMessageType(id, false);

    return { message, other };
  }

  async markAsRead(ids: number[]) {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .update(Notification)
      .set({ isRead: true })
      .where('notification.id IN (:ids)', { ids })
      .execute();
  }

  async deleteById(id: number) {
    return await this.notificationRepository.delete({ id });
  }
}

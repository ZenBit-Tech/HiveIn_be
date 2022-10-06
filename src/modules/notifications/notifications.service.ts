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

  async getAllOwn(id: number): Promise<[Notification[], number]> {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .getManyAndCount();
  }

  async getAllOwnMessageType(id: number): Promise<[Notification[], number]> {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .andWhere('notification.type = :type', { type: NotificationType.MESSAGE })
      .getManyAndCount();
  }

  async getAllOwnNotMessageType(id: number): Promise<[Notification[], number]> {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .andWhere('notification.type != :type', {
        type: NotificationType.MESSAGE,
      })
      .getManyAndCount();
  }

  async getCount(id: number) {
    const [, countOfMessage] = await this.getAllOwnMessageType(id);
    const [, countOfOther] = await this.getAllOwnNotMessageType(id);

    return { message: countOfMessage, other: countOfOther };
  }

  async markAsRead(id: number) {
    return await this.notificationRepository.update({ id }, { isRead: true });
  }

  async deleteById(id: number) {
    return await this.notificationRepository.delete({ id });
  }
}

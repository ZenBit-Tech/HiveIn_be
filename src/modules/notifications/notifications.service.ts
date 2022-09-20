import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import { Notification } from 'src/modules/notifications/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const newNotification = await this.notificationRepository.save(
      createNotificationDto,
    );
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.fromUser', 'fromUser')
      .leftJoinAndSelect('notification.toUser', 'toUser')
      .where(`notification.id = ${newNotification.id}`)
      .getOne();
  }

  findAll(): Promise<Notification[]> {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.fromUser', 'fromUser')
      .leftJoinAndSelect('notification.toUser', 'toUser')
      .getMany();
  }

  async read(id: number): Promise<boolean> {
    await this.notificationRepository.update(id, { read: true });
    return true;
  }

  async remove(id: number): Promise<boolean> {
    await this.notificationRepository.update(id, { deleted: true });
    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

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

  findAll() {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.fromUser', 'fromUser')
      .leftJoinAndSelect('notification.toUser', 'toUser')
      .getMany();
  }

  read(id: number) {
    return this.notificationRepository.update(id, { read: true });
  }

  remove(id: number) {
    return this.notificationRepository.update(id, { deleted: true });
  }
}

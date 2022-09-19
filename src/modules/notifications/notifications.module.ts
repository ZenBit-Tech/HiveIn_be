import { Module } from '@nestjs/common';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsController } from 'src/modules/notifications/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/modules/notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

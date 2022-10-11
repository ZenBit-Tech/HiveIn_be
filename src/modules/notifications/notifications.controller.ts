import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Patch,
} from '@nestjs/common';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import { Notification } from 'src/modules/notifications/entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get(':id')
  findAll(@Param() data: { id: string }) {
    Logger.log(data.id);
    return this.notificationsService.getAllOwn(+data.id);
  }

  @Patch('update')
  read(@Body() ids: { id: number[] }) {
    return this.notificationsService.markAsRead(ids.id);
  }
}

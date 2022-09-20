import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Patch(':id')
  read(@Param('id') id: string): Promise<boolean> {
    return this.notificationsService.read(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.notificationsService.remove(+id);
  }
}

import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NotificationType } from 'src/modules/notifications/entities/notification.entity';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  text: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  foreignKey: number;
}

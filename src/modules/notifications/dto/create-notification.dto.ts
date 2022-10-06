import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

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

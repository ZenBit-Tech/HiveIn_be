import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NotificationType } from 'src/modules/notifications/entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of notification',
    example: NotificationType.MESSAGE,
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Text of notification',
    example: 'Lorem Ipsum',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Id of user that connect with this notification',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Foreign key notification',
    example: 1,
  })
  @IsNumber()
  foreignKey: number;
}

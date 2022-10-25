import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'src/modules/entities/users.entity';

export class CreateSettingsInfoDto {
  @ApiProperty({
    description: 'Email of user',
    example: 'email@gmail.com',
  })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'Role of user',
    example: UserRole.CLIENT,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({
    description: 'First name of user',
    example: 'Lorem',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    example: 'Ipsum',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly lastName: string;

  @ApiProperty({
    description: 'Phone number of user',
    example: '+380999999999',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  readonly phone: string;
}

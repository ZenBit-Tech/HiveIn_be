import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ConfidentialSettings,
  UserRole,
} from 'src/modules/entities/users.entity';
import { CreateSettingsInfoDto } from 'src/modules/settings-info/dto/create-settings-info.dto';

export class UpdateSettingsInfoDto extends PartialType(CreateSettingsInfoDto) {
  @ApiProperty({
    description: 'Role of user',
    example: UserRole.CLIENT,
    type: UserRole,
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

  @ApiProperty({
    description: 'Description of user',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    description: 'URL to avatar of user',
    example: 'https',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly avatarURL: string;

  @ApiProperty({
    description: 'Confidential settings that user has',
    example: ConfidentialSettings.EMAIL_ONLY,
    type: ConfidentialSettings,
    required: false,
  })
  @IsOptional()
  @IsEnum(ConfidentialSettings)
  readonly confidentialSettings: ConfidentialSettings;
}

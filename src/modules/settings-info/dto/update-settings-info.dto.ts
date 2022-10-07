import { PartialType } from '@nestjs/mapped-types';
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
import { CreateSettingsInfoDto } from './create-settings-info.dto';

export class UpdateSettingsInfoDto extends PartialType(CreateSettingsInfoDto) {
  @IsOptional()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  readonly phone: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly avatarURL: string;

  @IsOptional()
  @IsEnum(ConfidentialSettings)
  readonly confidentialSettings: ConfidentialSettings;
}

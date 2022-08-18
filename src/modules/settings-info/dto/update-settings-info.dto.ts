import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateSettingsInfoDto } from './create-settings-info.dto';

export class UpdateSettingsInfoDto extends PartialType(CreateSettingsInfoDto) {
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
}

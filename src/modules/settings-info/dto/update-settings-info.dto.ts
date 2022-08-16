import { PartialType } from '@nestjs/mapped-types';
import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { CreateSettingsInfoDto } from './create-settings-info.dto';

export class UpdateSettingsInfoDto extends PartialType(CreateSettingsInfoDto) {
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @IsString()
  @MaxLength(50)
  readonly lastName: string;

  @IsString()
  @IsPhoneNumber()
  readonly phone: string;
}

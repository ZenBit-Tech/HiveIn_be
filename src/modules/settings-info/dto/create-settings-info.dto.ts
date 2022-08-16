import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateSettingsInfoDto {
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

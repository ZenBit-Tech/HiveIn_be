import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSettingsInfoDto {
  @IsEmail()
  @IsString()
  readonly email: string;

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

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
  @IsEmail()
  @IsString()
  readonly email: string;

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
}

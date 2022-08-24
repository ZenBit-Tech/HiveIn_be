import { IsString, IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @IsEmail()
  @IsString()
  readonly email: string;
}

import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRestorePasswordDto {
  @IsString()
  readonly token: string;

  @MinLength(8, {
    message: 'Password can`t be less than 8',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

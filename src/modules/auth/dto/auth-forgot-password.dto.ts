import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsEmail()
  @IsString()
  readonly email: string;
}

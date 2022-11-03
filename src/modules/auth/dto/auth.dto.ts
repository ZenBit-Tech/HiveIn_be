import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: '12345678qW!',
  })
  @MinLength(8, {
    message: 'Password can`t be less than 8',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

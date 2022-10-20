import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class ForgotPassword {
  @ApiProperty({
    description: 'Id of forgot password',
    example: 1,
  })
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @ApiProperty({
    description: 'User that forgot password',
    example: Users,
  })
  @ManyToOne(() => Users, (user) => user.forgotPassword)
  user: Users;

  @ApiProperty({
    description: 'Link to restore password',
    example: 'https',
  })
  @Column({ unique: true })
  @IsString()
  link: string;
}

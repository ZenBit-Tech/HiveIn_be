import { IsString, MaxLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class ForgotPassword {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @ManyToOne(() => Users, (user) => user.forgotPassword)
  user: Users;

  @Column({ unique: true })
  @IsString()
  @MaxLength(150)
  link: string;
}

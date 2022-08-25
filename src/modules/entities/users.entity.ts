import { IsEmail, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { ForgotPassword } from './forgot-password.entity';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  UNDEFINED = '',
}
@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.UNDEFINED,
  })
  role: UserRole;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @Column({ nullable: true })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @OneToOne(() => Freelancer, (freelancer) => freelancer.user)
  user: Users;

  @OneToMany(
    () => ForgotPassword,
    (forgotPassword: ForgotPassword) => forgotPassword.user,
  )
  forgotPassword: ForgotPassword[];
}

import { IsEmail, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @Column()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @Column()
  @IsString()
  @IsPhoneNumber()
  phone: string;
}

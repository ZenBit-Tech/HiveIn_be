import { IsEmail, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  @IsEmail()
  @IsString()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
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

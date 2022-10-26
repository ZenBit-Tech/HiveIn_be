import { IsEmail, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ForgotPassword } from './forgot-password.entity';
import { Exclude } from 'class-transformer';
import PublicFile from 'src/modules/file/entities/publicFile.entity';
import { RecentlyViewedFreelancers } from 'src/modules/client/entities/recently-viewed-freelancers.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  UNDEFINED = '',
}

export enum ConfidentialSettings {
  VISIBLE = 'visible',
  PHONE_ONLY = 'phoneOnly',
  EMAIL_ONLY = 'emailOnly',
  HIDDEN = 'hidden',
}

@Entity()
export class Users {
  @ApiProperty({
    description: 'Id of user',
  })
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @ApiProperty({
    description: 'Email of user',
    example: 'email@gmail.com',
  })
  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password of user',
    example: '123123qQ!',
  })
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.UNDEFINED,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: ConfidentialSettings,
    default: null,
    nullable: true,
  })
  confidentialSetting: ConfidentialSettings;

  @ApiProperty({
    description:
      'Google id if user sing up with Google Sign Up. Otherwise null',
    examples: [null, 'OWIEFWEIFJ0293J2039J203J20OJ230O3F'],
  })
  @Column({ nullable: true, unique: true })
  googleId: string;

  @ApiProperty({
    description: 'Hash of Refresh token current user',
    example: '$2a$10$x0Q.mk/NETdQUCjx7BAVQOtC8Y.0g7XoEzxGSjdI.DP',
  })
  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @ApiProperty({
    description: 'First name of user',
    example: 'Stephen',
  })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    example: 'King',
  })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'Users phone number',
    example: '+380999999999',
  })
  @Column({ nullable: true })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Description of user',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Column({ nullable: true })
  @IsString()
  description: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @OneToOne(() => Freelancer, (freelancer) => freelancer.user)
  user: Users;

  @OneToMany(
    () => ForgotPassword,
    (forgotPassword: ForgotPassword) => forgotPassword.user,
  )
  forgotPassword: ForgotPassword[];

  @OneToMany(
    () => RecentlyViewedFreelancers,
    (recentlyViewedFreelancers) => recentlyViewedFreelancers.user,
  )
  recentlyViewedFreelancers!: RecentlyViewedFreelancers[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  savedFreelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  hiredFreelancers: Freelancer[];
}

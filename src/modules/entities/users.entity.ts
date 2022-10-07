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

  @Column({
    type: 'enum',
    enum: ConfidentialSettings,
    default: null,
    nullable: true,
  })
  confidentialSetting: ConfidentialSettings;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

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

  @Column({ nullable: true })
  @IsString()
  description: string;

  @Column({ nullable: true })
  @IsString()
  avatarURL: string;

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

  @ManyToMany(() => Freelancer)
  @JoinTable()
  recentlyViewedFreelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  savedFreelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  hiredFreelancers: Freelancer[];
}
